const path = require('path');
const puppeteer = require('puppeteer');

const publicDir = "public";
const source = "index.html";
const destination = "mherczeg-cv.pdf";

async function init() {

    const browser = await puppeteer.launch({  
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        browser: "chrome",
        headless: true,
    });

    const page = await browser.newPage();

    // sizing is kinda wonky. css breakpoint indicates that the layout breakpoint we want is around 992 width
    // but for some reason, when exporting pdf, it uses mobile layout till around 1400 width
    // even though we end up with a bunch of margin
    // of course pdf generation only works in headless for whatever reason, so debugging it is just more trouble than worth
    await page.setViewport({
        width: 1400,
        height: 1080
    })

    await page.goto(`file://${path.join(process.cwd(), publicDir, source)}`, {
        waitUntil: 'networkidle2'
    });

    const height = await page.evaluate(() => document.documentElement.offsetHeight);
    const width = await page.evaluate(() => document.documentElement.offsetWidth);

    await page.pdf({
        path: path.join(publicDir, destination),
        height: `${height+1}px`,
        width: `${width}px`,
        printBackground: true,
    }).then(
        () => console.log("success"),
        (error) => console.error("error", error)
    );
    
    await browser.close();

}

init().then(() => console.log("complete"));