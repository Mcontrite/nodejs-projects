module.exports = {
	port: process.env.PORT || 3000,
	session: {
		key: 'sessionkey',
		maxAge: 365*24*60*60
	},
	mongodb: 'mongodb://localhost:27017/koablog'
}
