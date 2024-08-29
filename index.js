const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

// 定义 API 路由
app.get('/define', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Please provide a word to define');
    }

    try {
        // 启动 Puppeteer 并访问朗文词典
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(`https://www.ldoceonline.com/jp/dictionary/${query}`);

        // 提取定义
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
