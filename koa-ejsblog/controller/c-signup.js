const md5 = require('md5')
const fs = require('fs')
const moment = require('moment')
const userModel = require('../lib/mysql.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin


exports.getSignup = async ctx => {
	await checkNotLogin(ctx)
	await ctx.render('signup', {
		session: ctx.session,
	})
}
// ctx.session 这个值存取的就是用户的信息，包括用户名、登录之后的id等，session一般是你关闭浏览器就过期了，
// 等于下次打开浏览器的时候就得重新登录了，用if判断他存不存在，就可以知道用户是否需要登录
exports.postSignup = async ctx => {
	let {
		name,
		password,
		repeatpass,
		avatar
	} = ctx.request.body
	console.log(typeof password)
	await userModel.findDataCountByName(name)
		.then(async (result) => {
			console.log(result)
			if (result[0].count >= 1) {
				ctx.body = {
					code: 500,
					message: '用户已存在 !'
				};
			} else if (password !== repeatpass || password.trim() === '') {
				ctx.body = {
					code: 500,
					message: '两次输入的密码不一致 !'
				};
			} else if (avatar && avatar.trim() === '') {
				ctx.body = {
					code: 500,
					message: '请上传头像 !'
				};
			} else {
				let base64Data = avatar.replace(/^data:image\/\w+;base64,/, ""),
					dataBuffer = new Buffer(base64Data, 'base64'),
					getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
					upload = await new Promise((reslove, reject) => {
						fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
							if (err) {
								throw err;
								reject(false)
							};
							reslove(true)
							console.log('头像上传成功 !')
						});
					});
				if (upload) {
					await userModel.insertData([name, md5(password), getName + '.png', moment().format('YYYY-MM-DD HH:mm:ss')])
						.then(res => {
							console.log('注册成功 !', res)
							ctx.body = {
								code: 200,
								message: '注册成功 !'
							};
						})
				} else {
					console.log('头像上传失败 !')
					ctx.body = {
						code: 500,
						message: '头像上传失败 !'
					}
				}
			}
		})
}
