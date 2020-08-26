# Manga Scooper Trouper 📚 
Node.js program written in TypeScropt for scraping manga sites and downloading manga for local viewing pleasures!

# Compatable Sites
* [MangaPanda](http://mangapanda.com)

# Local Setup
Setup Manga Scooper Trouper in a local directory using commands:
``` 
git clone https://github.com/gregei/Manga-Scooper-Trouper.git 
npm install 
````

# Global Setup
Setup Manga Scooper Trouper as a global CLI using commands:
``` 
git clone https://github.com/gregei/Manga-Scooper-Trouper.git 
npm install -g
```

# Usage
```
Local: npm run start <url> [options]
Global: scrape <url> [options]
```

### Options

#### ```-t, --timeout```

The scraping timeout time in milliseconds. The default timeout is 0 for no timeout time.

#### ```-m, max-retries```

Amount of scraping retires before giving up. The default retries is 90.

#### ```-d, download-directory```

Root directory for downloaded manga. Default directory is "manga_downloads".


# Examples

```
Local: npm run start http://www.mangapanda.com/xxxxxxxxxx
Global: scrape http://www.mangapanda.com/xxxxxxxxxx

Local: npm run start http://www.mangapanda.com/xxxxxxxxxx -t 9000
Global: scrape http://www.mangapanda.com/xxxxxxxxxx -t 9000
```

# License
MIT License

Copyright (c) 2020 Gregory Gaines

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# Disclaimer
**Use at your own risk and for educational purposes only!!**
<br />
**All downloaded material such as manga/novels/..etc are copyrighted to their respective author(s)/owner(s)**

