import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';
import cheerio from 'cheerio';
import Table from 'cli-table';
import fs from 'fs';
import url from 'url';
import util from 'util';
import { createDirectory, sanitizePathName } from './Helpers';
import IMangaSite from './manga-site-factory/IMangaSite';
import MangaPanda from './manga-site-factory/MangaPanda';

/**
 * Options interface used to defined options for the manga scrape
 *
 * @interface Options
 * @member {number} timeout Timeout time in milliseconds
 * @member {number} maxRetries Max request retries
 * @member {string} downloadDirectory Root directory to download manga
 */
interface Options {
    timeout: number,
    maxRetries: number,
    downloadDirectory: string
}

class MangaScrapper {
    axiosInstance: AxiosInstance
    maxRetries: number;

    /**
     * Scrape manga from URL
     * @param {string} mangaURL The URL of the manga to be scraped
     * @param {Options} options Scraping options
     */
    async scrapeManga(mangaURL: string, options: Options) {
        this.maxRetries = options.maxRetries;

        // Create Axios instance
        this.axiosInstance = axios.create({
            timeout: options.timeout,
            method: 'GET',
            headers: {
                'DNT': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
            }
        });

        console.log('| # Manga URL: ' + mangaURL);

        // Extract domain name from URL
        const mangaSiteDomainName = url.parse(mangaURL).hostname;

        // Identify manga site
        const mangaSite = this.identifyMangaSite(mangaSiteDomainName);

        console.log('| # Manga domain name: ' + mangaSiteDomainName);
        console.log('|');

        // Create manga site download directory with manga site name
        const mangaSiteDownloadDirectory = options.downloadDirectory + '/' + mangaSite.siteName;

        // Create manga site download directory
        createDirectory(mangaSiteDownloadDirectory);

        let mangaSiteResponse;

        try {
            mangaSiteResponse = await axios.get(mangaURL);
        } catch (Exception) {
            console.log(chalk.red('-! Manga site error:' + mangaURL + ' !-'));
            process.exit(0);
        }

        const $ = cheerio.load(mangaSiteResponse.data);

        // Get manga meta data
        mangaSite.mangaTitle = $(mangaSite.mangaTitleQuery).html();
        mangaSite.alternateTitle = $(mangaSite.alternateTitleQuery).html();
        mangaSite.yearOfRelease = $(mangaSite.yearOfReleaseQuery).html();
        mangaSite.status = $(mangaSite.statusQuery).html();
        mangaSite.author = $(mangaSite.authorQuery).html();
        mangaSite.currentNumOfChapters = $(mangaSite.getCurrentNumOfChaptersQuery).length;
        mangaSite.allMangaChapters = $(mangaSite.getChaptersArrayQuery).toArray();

        console.log('| # Manga name: ' + mangaSite.mangaTitle);
        console.log('| # Alternate Name: ' + mangaSite.alternateTitle);
        console.log('| # Number of chapters: ' + mangaSite.currentNumOfChapters);
        console.log('|')

        const mangaDownloadDirectory = mangaSiteDownloadDirectory + '/' + sanitizePathName(mangaSite.mangaTitle);

        console.log('| # Manga download directory: ' + mangaDownloadDirectory);
        console.log('|--------------------------------------------------------------');

        createDirectory(mangaDownloadDirectory);

        this.scrapeMangaChapters(mangaDownloadDirectory, mangaSite);
    }

    /**
     * Scrape the chapters of the manga
     * @param {string} mangaDownloadDirectory The manga download directory
     * @param {IMangaSite} mangaSite The manga site queries
     */
    private async scrapeMangaChapters(mangaDownloadDirectory: string, mangaSite: IMangaSite) {

        // Create a console table
        const tableBuilder = new Table({
            head: ['Chapter Name', 'Chapter Number', 'URL', 'Release Date'],
            style: { head: ['green'] }
        });

        for (const chapter of mangaSite.allMangaChapters) {
            const $ = cheerio.load(chapter);

            // Skip elements that don't matter
            let skippingElement = false;

            for (const skipableElement of mangaSite.skippableElements) {
                if ($(chapter).attr('class') === skipableElement) {
                    skippingElement = true;
                    break;
                }
            }

            if (skippingElement) {
                continue;
            }

            // Extract the chapter meta data
            const chapterHTML = $(mangaSite.getChapterHTMLQuery).text();
            const chapterName = mangaSite.extractChapterNameFromHTML(chapterHTML);
            const chapterURL = mangaSite.domainName + $(mangaSite.getChapterURLHyperlinkQuery).attr('href');
            const chapterNum = mangaSite.extractChapterNumberFromHTML(chapterHTML);
            const chapterDate = $(mangaSite.getChapterDateQuery).text();

            const chapterDownloadDirectory = mangaDownloadDirectory + '/Chapter ' + chapterNum + ' - ' + chapterName;

            createDirectory(chapterDownloadDirectory);

            this.downloadMangaChapterPages(chapterName, chapterNum, chapterURL, chapterDownloadDirectory, mangaSite);

            tableBuilder.push([chapterName, chapterNum, chapterURL, chapterDate])
        }

        console.log(tableBuilder.toString());
    }

    /**
     * Download the pages of a chapter
     * @param  {string} chapterName The chapter name
     * @param  {string} chapterURL The chapter URL
     * @param  {string} chapterDownlaodDirectory The manga download directory
     * @param  {string} mangaSite The manga site queries
     */
    private async downloadMangaChapterPages(chapterName: string, chapterNum: number, chapterURL: string, chapterDownlaodDirectory: string, mangaSite: IMangaSite) {
        // Scrape the first page of the chapter to get how many pages it has
        const chapterFirstPageURL = util.format(chapterURL + '/' + mangaSite.chapterURLParameterFormatTemplate, 1);

        let chapterFirstPageResponse;

        try {
            chapterFirstPageResponse = await axios.get(chapterFirstPageURL);
        } catch (error) {
            console.log(chalk.red('!- Error downloading Chapter ' + chapterNum + ' - ' + chapterName + ' !-'));
            return;
        }

        let $ = cheerio.load(chapterFirstPageResponse.data);

        const numberOfPages = parseInt($(mangaSite.getNumberOfChapterPagesQuery).html(), 10);

        // Loop over and download all pages
        for (let page = 1; page <= numberOfPages; ++page) {
            const chapterPageURL = util.format(chapterURL + '/' + mangaSite.chapterURLParameterFormatTemplate, page);

            let chapterPageResponse;

            try {
                chapterPageResponse = await Promise.resolve(this.fetchPageContent(chapterPageURL));
            } catch (exception) {
                console.log(chalk.red('!- Error downloading Chapter ' + chapterNum + ' - ' + chapterName + '| Page: ' + page + '/' + numberOfPages + ' !-'));
                continue;
            }

            $ = cheerio.load(chapterPageResponse);

            let chapterPageImageURL;

            try {
                chapterPageImageURL = $(mangaSite.getChapterPageImageURLQuery).attr('src');
            } catch (error) {
                console.log(chalk.red('!- Error downloading Chapter ' + chapterNum + ' - ' + chapterName + ' Page: ' + page + '/' + numberOfPages + ' !-'));
                continue;
            }

            try {
                await this.downloadChapterImage(chapterPageImageURL, chapterDownlaodDirectory, mangaSite.mangaTitle + ' ' + chapterNum + ' - ' + chapterName + ' - Page ' + page, chapterNum, chapterName, page, numberOfPages);
            } catch (err) {
                console.log(chalk.red('!- Error downloading Chapter ' + chapterNum + ' - ' + chapterName + ' Page: ' + page + '/' + numberOfPages + ' !-'));
            }
        }
    }

    /**
     * Perform a GET request to the page URL and return the HTML
     * @param  {string} pageURL Page to scrate
     */
    private async fetchPageContent(pageURL: string): Promise<string> {
        let successfulResponse = false;

        let pageResponse;

        // Try to scrape page
        for (let tries = 0; tries < this.maxRetries; ++tries) {

            try {
                pageResponse = await this.axiosInstance.get(pageURL);
            } catch (ex) {
                continue;
            }

            // Break out of loop if GET is successful
            if (pageResponse.status === 200) {
                successfulResponse = true;
                break;
            }
        }

        if (!successfulResponse) {
            throw new Error();
        }

        return pageResponse.data;
    }

    /**
     * Download image fron url to designated image path
     * @param  {string} imageURL URL to download image
     * @param  {string} imagePath Designated path for downloaded image
     * @param  {string} fileName Name for the downloaded image file
     */
    private async downloadChapterImage(imageURL: string, imagePath: string, fileName: string, chapterNum: number, chapterName: string, page: number, numberOfPages: number) {
        // Axios instace to download images
        const axiosDownloadInstance = axios.create({
            url: imageURL,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'DNT': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
            }
        });

        let successfulResponse = false;

        let pageResponse;

        // Try to downlaod image
        for (let tries = 0; tries < this.maxRetries; ++tries) {

            try {
                pageResponse = await axiosDownloadInstance.get(imageURL);
            } catch (ex) {
                continue;
            }

            // Break out of loop if GET is successful
            if (pageResponse.status === 200) {
                console.log(chalk.blue('Successfully downloading Chapter ' + chapterNum + ' - ' + chapterName + ' Page: ' + page + '/' + numberOfPages));
                successfulResponse = true;
                break;
            }
        }

        if (!successfulResponse) {
            throw new Error();
        }

        // Save image to file
        pageResponse.data.pipe(fs.createWriteStream(imagePath + '/' + fileName + '.jpg'));
    }

    /**
     * Factory to identify mamga
     * @param  {string} mangaSiteDomainName Domain name to identify site
     */
    private identifyMangaSite(mangaSiteDomainName: string) {
        switch (mangaSiteDomainName) {
            case 'www.mangapanda.com': {
                return new MangaPanda();
            }

            default: {
                console.log(chalk.red('-! Manga domain name ' + mangaSiteDomainName + ' not found !-'));
                process.exit(0);
            }
        }
    }
}

export default MangaScrapper;
export { Options };

