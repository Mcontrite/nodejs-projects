const Koa = require('koa')
const path = require('path')
const koastatic = require('koa-static')
const views = require('koa-views')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const marked = require('marked')
const error = require('./middlewares/error_handler')
const flash = require('./middlewares/flash')
const router = require('./routes')
const CONFIG = require('./config/config')

const app = new Koa()

mongoose.connect(CONFIG.mongodb)

app.keys = ['sessionkey']
app.use(session({
	key: CONFIG.session.key,
	maxAge: CONFIG.session.maxAge
}, app))

app.use(flash())

app.use(error())

app.use(bodyParser())

app.use(koastatic(
	path.join(__dirname, 'public')
))

app.use(views(path.join(__dirname, 'views'), {
	map: {
		html: 'nunjucks'
	}
}))

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
})

app.use(async (ctx, next) => {
	ctx.state.ctx = ctx
	ctx.state.marked = marked
	await next()
})

router(app)

if (!module.parent) app.listen(CONFIG.port)
console.log(`server is running on http://localhost:${CONFIG.port}...`)
