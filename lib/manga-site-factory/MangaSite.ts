import { isCharacter, sanitizePathName } from '../Helpers';
import IMangaSite from './IMangaSite';

/**
 * MangaSite abstract class used to define a default implementation
 * for extractChapterNumberFromChapterHTML and extractChapterNameFromHTML
 */
abstract class MangaSite implements IMangaSite {
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

    /**
     * Extracts chapter number from chapter HTML
     * @param {string} chapterHTML Chapter HTML
     * @return {number} The extracted chapter number
     */
    extractChapterNumberFromHTML(chapterHTML: string): number {
        const endIndex = chapterHTML.indexOf(':');

        let startIndex = endIndex;

        for (; startIndex >= 0; --startIndex) {
            if (isCharacter(chapterHTML.charAt(startIndex))) {
                break;
            }
        }

        const chapterNumString = chapterHTML.slice(startIndex + 1, endIndex).trim();

        return parseInt(chapterNumString, 10);
    }

    /**
     * Extracts chapter name from chapter HTML
     * @param {string} chapterHTML Chater HTML
     * @return {string} The extracted chapter number
     */
    extractChapterNameFromHTML(chapterHTML: string): string {
        return sanitizePathName(chapterHTML.trim().substr(chapterHTML.indexOf(':')))
    }
}

export default MangaSite;