import MangaSite from './MangaSite';

/**
 * Manga Panda class used to define queries to scrape manga
 * from https://www.mangapanda.com
 */
class MangaPanda extends MangaSite {
    siteName = 'Manga Panda';
    domainName = 'https://www.mangapanda.com';

    mangaTitleQuery = '.aname';
    alternateTitleQuery = '#mangaproperties tbody tr:nth-child(2) td:nth-child(2)';
    yearOfReleaseQuery = '#mangaproperties tbody tr:nth-child(3) td:nth-child(2)';
    statusQuery = '#mangaproperties tbody tr:nth-child(4) td:nth-child(2)';
    authorQuery = '#mangaproperties tbody tr:nth-child(5) td:nth-child(2)';

    getCurrentNumOfChaptersQuery = '#listing > tbody > tr';
    getChaptersArrayQuery = '#listing > tbody > tr';
    getNumberOfChapterPagesQuery = '#pageMenu option:last-child';
    chapterURLParameterFormatTemplate = '%d';
    getChapterPageImageURLQuery = '#img';
    skippableElements = ['table_head'];

    getChapterHTMLQuery = 'td:nth-child(1)';
    getChapterURLHyperlinkQuery = 'td:nth-child(1) a';
    getChapterDateQuery = 'td:nth-child(2)';
}

export default MangaPanda;