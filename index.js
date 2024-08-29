const express = require('express');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const app = express();

// 处理根路径请求
app.get('/', (req, res) => {
    res.send('API is working. Use the /define endpoint to get word definitions.');
});

app.get('/define', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Please provide a word to define');
    }

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(`https://www.ldoceonline.com/jp/dictionary/${query}`);

        const definition = await page.evaluate(() => {
            const element = document.querySelector('.dictentry .Sense');
            return element ? element.innerText : 'Definition not found';
        });

        await browser.close();
        res.json({ word: query, definition });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching the definition');
    }
});

// 设置监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
