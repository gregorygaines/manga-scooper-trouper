#!/usr/bin/env node

import yargs from 'yargs';
import MangaScrapper, { Options } from './lib/MangaScrapper';
import chalk from 'chalk';

// Initialize manga scrapper
const mangaScrapper = new MangaScrapper();

// Default options
const options: Options = {
    timeout: 0,
    maxRetries: 90,
    downloadDirectory: './manga_downloads'
};

// Initialize command line arguments
const argv = yargs
    .usage('Usage: scrape <url> [options]')
    .example('scrape http://www.mangapanda.com/xxx', 'Downloads manga xxx from Manga Panda')
    .alias('t', 'timeout')
    .describe('t', 'Request timeout in milliseconds, default 0')
    .alias('m', 'max-retries')
    .describe('m', 'Max retries, default 10')
    .alias('d', 'download-directory')
    .describe('d', 'Download directory, default ./manga_downloads')
    .number(['t', 'm'])
    .string(['d'])
    .demandCommand(1, 'You need to provide a manga url')
    .help(false)
    .version(false)
    .argv;

// Parse manga url from args
let mangaURL;

if (argv._.indexOf(',') === -1) {
    mangaURL = argv._.toString();
} else {
    mangaURL = argv._.slice(0, argv._.indexOf(',')).toString();
}

// Parse passed timeout arg
if (argv.t !== undefined) {
    const timeoutArg = argv.t;

    if (!isNaN(timeoutArg) && timeoutArg > 0) {
        options.timeout = timeoutArg;
    }
}

// Parse passed max retries arg
if (argv.m !== undefined) {
    const maxRetiresArg = argv.m;

    if (!isNaN(maxRetiresArg) && maxRetiresArg > 0) {
        options.maxRetries = maxRetiresArg;
    }
}

// Parse download directory arg
if (argv.d !== undefined) {
    options.downloadDirectory = argv.d;
}

console.log(chalk.blue('[Timeout: ' + options.timeout + '], [Max Retries: ' + options.maxRetries + '], [Download Directory: ' + options.downloadDirectory + ']' + '\n'));

// Start scrapping manga!
mangaScrapper.scrapeManga(mangaURL, options);