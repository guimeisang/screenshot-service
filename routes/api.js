
'use strict';

const Router = require('koa-router')
const route = new Router()
const uuidv4 = require('uuid/v4');
const querystring = require('querystring');

const screenshot = require('../service/screenshot')
const fullScreenshot = require('../service/fullScreenshot')
const pdf = require('../service/pdf')
const render = require('../service/render')
const file2zip = require('../service/file2zip')
const resumeScreenshot = require('../service/resumeScreenshot')



route.use(async (ctx, next)=>{
	// Assert url 
	let url = ctx.query.url || ctx.request.body.url;
	if( ["/screenshot", "/screenshot/full", "/pdf", "/render"].indexOf(ctx.path) != -1 ) {
		ctx.assert(url, 400, "Url can't be null");
	}
	// set url
	global.url = url;
	// 如果监听公网IP地址则最好启用 `ticket` 验证，防止未授权使用
	// let ticket = ctx.query.ticket || ctx.request.body.ticket;
	// ctx.assert(ticket === 'your ticket',400,"Ticket error");
	await next();

})

route.all('screenshot',async ctx => {
	// Screenshot
	// width default 1920 height default 1080
	let width = ctx.query.width || ctx.request.body.width || 1920;
	let height = ctx.query.height || ctx.request.body.height || 1080;
	let filename = `${uuidv4()}.png`;
	screenshot(url,parseInt(width),parseInt(height),filename)
	ctx.body = {status: 200 ,error: '',message:'success screenshot',type:'screenshot',filename:filename};

});

route.all('screenshot/full',async ctx => {
	// Full screenshot
	let filename = `${uuidv4()}.png`;
	fullScreenshot(url,filename)
	ctx.body = {status: 200 ,error: '',message:'success fullscreenshot',type:'fullscreenshot', filename: filename};
});

route.all('pdf',async ctx => {
	// PDF
	let format = ctx.query.format || ctx.request.body.format;
	let filename = `${uuidv4()}.pdf`;
	// width default 1920 height default 1080
	let width = ctx.query.width || ctx.request.body.width || 1920;
	let height = ctx.query.height || ctx.request.body.height || 1080;
	pdf(url,parseInt(width),parseInt(height),filename,format)
	ctx.body = {status: 200 , error: '', message:'success pdf', type:'pdf', filename: filename};
});


route.all('render', async ctx => {
	// Render
	// await page load
	let html = await render(url);
	ctx.header['content-type'] = 'text/html; charset=UTF-8';
	ctx.body = html;

});

// 增加简历批量下载截图接口
route.all('downLoadZip', async ctx => {
	let userUuids = ctx.query.userUuids || ctx.request.body.userUuids; // 用户uuid
	let type = ctx.query.type || ctx.request.body.type; // 文件类型
	let projectName = ctx.query.projectName || ctx.request.body.projectName; // 项目名称
	let userUuidArr = userUuids.split(";"), filePaths = [], fileNames = [];
	console.log('userUuidArr: ', userUuidArr)
	// 特殊处理下仅仅一个uuid的时候
	if(userUuidArr.length == 1) {
		userUuidArr[0].slice(1).slice(0, -1)
	}
	userUuidArr.forEach((item) => {
		fileNames.push(item + '.' + type)
		filePaths.push(projectName + "/" + type + "/" + item + "." + type)
	});
	let zipBuffer = await file2zip([fileNames], [filePaths])
	ctx.body = zipBuffer;
})

// 增加简历截图接口
route.post('resumeScreenshot', async ctx => {
	let { resumeInfos, filename, fileType, projectName } = ctx.request.body
	await resumeScreenshot(resumeInfos, filename, fileType, projectName)
	ctx.body = { status: 200, error:'', message: "success",  type:'pdf', filename: filename, projectName: projectName}
})


module.exports = route;



