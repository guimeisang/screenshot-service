'use strict';

const puppeteer = require('puppeteer');
const path = require('path')
const rootPath = path.join(__dirname, '../')

const config = require('../config/index')
const autoScroll = require("../utils/autoScroll")
const { campusBackUrl } = config

async function resumeScreenshot(resumeInfos, filename, fileType, projectName, width, height){

    console.log(`[puppeteer.app.resumeScreenshot] 1 DEBUG: ResumeScreenshot saving ${fileType} Filename: ${filename}`, 'url: ', campusBackUrl);

    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--enable-features=NetworkService',
        '-—disable-dev-tools'
        ]
    });

    const page = await browser.newPage();

    try {
        await page.goto(campusBackUrl, {waitUntil: ['domcontentloaded', 'load','networkidle0']});
        // 设置 localStorage
        await page.evaluate((resumeInfos) => {
            localStorage.setItem('resumeInfos', resumeInfos);
        }, resumeInfos);
        await page.goto(campusBackUrl, {waitUntil: ['domcontentloaded', 'load','networkidle0']});
        await page.setViewport({
            width: width || 1200, 
            height: height || 800
        });

        // 滚动浏览器截图全部的图
        await autoScroll(page);

        // format 的优先级高于 width,height 如果设置了，将覆盖 width 和 height 配置 默认是 'Letter'。
        const filepath = `${rootPath}/${projectName}/${fileType}/${filename}.${fileType}`
        if(fileType == 'pdf') {
            await page.pdf({path: filepath,headerTemplate: `${page.url} ${page.title}`, width: width, height: height});
        }else {
            await page.screenshot({
                path: filepath,
                fullPage: true
            });
        }

        await browser.close();
        console.log(`[puppeteer.app.resumeScreenshot] 2 DEBUG: ResumeScreenshot save ${fileType} successfully Filename: ${filename}`);
    } catch (e) {
        // TODO 将错误上抛
        console.log(`[puppeteer.app.resumeScreenshot] 3 ERROR: ResumeScreenshot save ${fileType} failed Error:${e}`);
    }
}

module.exports = resumeScreenshot;