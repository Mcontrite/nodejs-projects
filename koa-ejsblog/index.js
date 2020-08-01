const ejs = require('ejs')
const path = require('path')
const Koa = require('koa')
const router = require('koa-router')
const views = require('koa-views')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const mysqlsession = require('koa-mysql-session')
const staticcache = require('koa-static-cache')
const config = require('./config/default.js')
const app = new Koa()


const MysqlSessionConfig = {
	user: config.database.USERNAME,
	password: config.database.PASSWORD,
	database: config.database.DATABASE,
	host: config.database.HOST,
}

app.use(session({
	key: 'USER_SID',
	store: new mysqlsession(MysqlSessionConfig)
}))

app.use(staticcache(path.join(__dirname, './public'), {dynamic: true}, {
	maxAge: 365 * 24 * 60 * 60
}))
app.use(staticcache(path.join(__dirname, './images'), {dynamic: true}, {
	maxAge: 365 * 24 * 60 * 60
}))

app.use(views(path.join(__dirname, './views'), {
	extension: 'ejs'
}))

app.use(bodyparser({
	formLimit: '1mb'
}))

app.use(require('./routers/signin.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/signout.js').routes())


app.listen(config.port)
console.log(`listening on port ${config.port}...`)
