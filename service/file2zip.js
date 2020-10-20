const JSZip = require('jszip')
const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '../')

async function file2zip(fileNameArr, filePathArr) {
    console.log(`[puppeteer.app.file2zip] 2 DEBUG: get file by zip  fileNameArr: ${fileNameArr}`, 'filePathArr: ', filePathArr);

    var zip = new JSZip()

    for(var i = 0; i < fileNameArr.length; i++) {
        // 允许部分简历可以下载不下来
        try {
            let buffer = Buffer.from(fs.readFileSync(rootPath + filePathArr[i])) // 注意一定要加上rootPath
            zip.file(fileNameArr[i], buffer, {base64: true}) // 注意name一定要加上类型，pdf，不然下载的文件会有问题
            console.log(`[puppeteer.app.file2zip] 2 DEBUG: get file by zip successfully fileNameArr: ${fileNameArr[i]}`);
        } catch (error) {
            // TODO 将不能下载的简历收集一下，并且返回不能下载的名单回去
            console.log(`[puppeteer.app.file2zip] 3 ERROR: get file by zip failed Error:${error}`);
        }
    }

    // 将zip
    return await zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    })
}

module.exports = file2zip;