// index.js

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/define', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Please provide a word to define');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.ldoceonline.com/jp/dictionary/${query}`);

    const definition = await page.evaluate(() => {
        const element = document.querySelector('.dictentry .Sense');
        return element ? element.innerText : 'Definition not found';
    });

    await browser.close();
    res.json({ word: query, definition });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
