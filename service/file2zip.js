const JSZip = require('jszip')
const fs = require('fs')
const path = require('path')
const rootPath = path.join(__dirname, '../')

async function file2zip(_fileName, _filePath) {
    var zip = new JSZip()
    _filePath = ['/pdf/2a0d97e3-6377-47a1-a1c1-b81eda0c3e90.pdf', '/pdf/6b5ff30e-fc10-4514-bba2-d28724702675.pdf']
    _fileName = ['2a0d97e3-6377-47a1-a1c1-b81eda0c3e90.pdf', '6b5ff30e-fc10-4514-bba2-d28724702675.pdf']
    for(var i = 0; i < _filePath.length; i++) {
        // 允许部分简历可以下载不下来
        try {
            let buffer = Buffer.from(fs.readFileSync(rootPath + _filePath[i])) // 注意一定要加上rootPath
            zip.file(_fileName[i], buffer, {base64: true}) // 注意name一定要加上类型，pdf，不然下载的文件会有问题
        } catch (error) {
            // TODO 将不能下载的简历收集一下，并且返回不能下载的名单回去
            console.log(error)
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