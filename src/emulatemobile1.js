// This project builds on emulatemobile.js but grabs all the titles from the first 4 pages and packages it in a csv file
const puppeteer = require('puppeteer');
const fs = require('fs');
const m = puppeteer.devices['iPhone 12'];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate(m);

// 'networkidle2' doesnt work - 0 means 0 connections for 500 ms
    await page.goto('https://www.reddit.com', {
      waitUntil: 'networkidle0'                                  
    });

// inspect website in mobile view and then copy the selector to find continue button in mobile
    const continbtn = '#container > div > div.AppMainPage > div.NavFrame > div:nth-child(1) > div > div.XPromoPopup__content.m-animated > div.XPromoPopup__actions > div:nth-child(2) > button'
    await page.click(continbtn);
  
// screenshot
    await page.screenshot({path: 'iPhone12-1.png'});

//scrape titles from a page - dynamically generated post selectors make it hard to figure out...
// the "." in .Post__titleAndFlair refers to the class in html, further more - spaces are meaningful in the query 
    for (let i=0; i < 4; i++) {
        var grabTitles = await page.evaluate(() => {
            const posts = document.querySelectorAll('.Post__titleAndFlair');
            let postTitles = []
            posts.forEach((tag) => {
                postTitles.push(tag.querySelector('a').innerText);
            });
            return postTitles;
        }); 

        console.log(grabTitles);

        //Click Next Button - it can click any button regardless of whether or not it is visible on screen...
        const nextbtn = '#container > div > div.AppMainPage > div.NavFrame > div > div > div > div > div > nav > div > div:nth-child(2) > a > div'
        await page.click(nextbtn);
        await page.waitForTimeout(3000);
    }
    await browser.close();
})();