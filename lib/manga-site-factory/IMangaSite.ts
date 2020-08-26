/**
 * IMangaSite interface used to defined queries and functions to extract
 * data from a Manga Site
 *
 * @interface IMangaSite
 * @member {string} siteName Name of the manga site
 * @member {string} domainName Domain name of manga site
 *
 * @member {string} mangaTitle Title of the manga
 * @member {string} alternateTitle Alternate title of the manga
 * @member {string} yearOfRelease Manga year of release
 * @member {string} status Current status of manga
 * @member {string} author Author of the manga
 * @member {string} currentNumOfChapters Current number of released chapters
 * @member {CheerioElement[]} allMangaChapters All scraped chapters
 *
 * @member {string} mangaTitleQuery Query to scrape manga title
 * @member {string} alternateTitleQuery Query to scrape alternate title
 * @member {string} yearOfReleaseQuery Query to scrape year of release
 * @member {string} statusQuery Query to manga status
 * @member {string} authorQuery Query to scrape author
 *
 * @member {string} getChaptersArrayQuery Query to scrape all chapters
 * @member {string} getCurrentNumOfChaptersQuery Query to scrape current number of chapters
 * @member {string} getNumberOfChapterPagesQuery Query to scrape number of pages from chapter
 * @member {string} chapterURLParameterFormatTemplate Format template for the chapter pages URL's
 * @member {string} getChapterPageImageURLQuery Query to scrape img element from chapter pages
 * @member {string[]} skippableElements Elements to skip when scraping
 *
 * @member {string} getChapterHTMLQuery Query to get chapter HTML element from a scraped chapter
 * @member {string} getChapterURLHyperlinkQuery Query to get chapter URL Hyperlink from a scraped chapter
 * @member {string} getChapterDateQuery Query to get chapter date from a scraped chapter
 */
interface IMangaSite {
    siteName: string;
    domainName: string;

    mangaTitle: string;
    alternateTitle: string;
    yearOfRelease: string;
    status: string;
    author: string;
    currentNumOfChapters: number;
    allMangaChapters: CheerioElement[];

    mangaTitleQuery: string;
    alternateTitleQuery: string;
    yearOfReleaseQuery: string;
    statusQuery: string;
    authorQuery: string;

    getChaptersArrayQuery: string;
    getCurrentNumOfChaptersQuery: string;
    getNumberOfChapterPagesQuery: string;
    chapterURLParameterFormatTemplate: string;
    getChapterPageImageURLQuery: string;
    skippableElements: string[];

    getChapterHTMLQuery: string;
    getChapterURLHyperlinkQuery: string;
    getChapterDateQuery: string;

    extractChapterNameFromHTML(chapterHTML: string): string;
    extractChapterNumberFromHTML(chapterHTML: string): number;
}

export default IMangaSite;