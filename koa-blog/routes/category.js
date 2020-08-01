const CategoryModel = require('../models/category')

module.exports = {
	async create(ctx, next) {
		if (ctx.method === 'GET') {
			await ctx.render('create_category', {
				title: '新建分类'
			})
			return
		}
		const {name} = ctx.request.body
		let errMsg = ''
		if (name === '') {
			errMsg = '分类名不能为空 !'
		}
		if (errMsg) {
			ctx.flash = {
				warning: errMsg
			}
			ctx.redirect('back')
			return
		}
		await CategoryModel.create(ctx.request.body)
		ctx.redirect('/category')
	},
	async list(ctx, next) {
		const categories = await CategoryModel.find({})
		await ctx.render('category', {
			title: '新建分类',
			categories
		})
	},
	async destroy(ctx, next) {
		const cid = ctx.params.id
		if (cid.length !== 24) {
			ctx.throw(404, '分类不存在 !')
		}
		const category = await CategoryModel.findById(cid)
		if (!category) {
			ctx.throw(404, '分类不存在 !')
		}
		await CategoryModel.findByIdAndRemove(cid)
		ctx.flash = {
			success: '删除分类成功 !'
		}
		ctx.redirect('/category')
	}
}
