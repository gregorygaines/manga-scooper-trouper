import fs, { PathLike } from 'fs';

/**
 * Create directory if it doesn't exist
 * @param {string} directory Directory path to create
 */
function createDirectory(directory: PathLike) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory , { recursive: true });
    }
}

/**
 * Sanitize directory for use of a path or file name
 * @param  {string} directory Directory name to sanitize
 * @return {string} Sanitized path
 */
function sanitizePathName(directory: PathLike): string {
    const illegalCharacters = /[^a-zA-Z0-9-_\.]/g;
    return directory.toString().replace(illegalCharacters, ' ');
}

/**
 * Check if character is alphabetic
 * @param  {string} chatacter Character to be checked
 * @return {boolean} true if character is alphabetic
 */
function isCharacterAlphabetic(character: string): boolean {
    return character.toUpperCase() !== character.toLowerCase();
}

export { createDirectory, sanitizePathName, isCharacterAlphabetic as isCharacter };
