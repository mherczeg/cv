const puppeteer = require('puppeteer');

async function init() {

    const browser = await puppeteer.launch({
        product: "chrome",
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

    await page.goto(`file://${process.cwd()}/index.html`, {
        waitUntil: 'networkidle0'
    });

    const height = await page.evaluate(() => document.documentElement.offsetHeight);
    const width = await page.evaluate(() => document.documentElement.offsetWidth);

    await page.pdf({
        path: "mherczeg-cv.pdf",
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