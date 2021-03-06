require('dotenv').config()

module.exports = {
	apps: [{
		name: "meubot",
		script: "./index.js",
		watch: true,
		ignore_watch: ['chats.db', 'chats.db-journal'],
		wait_ready: true,
		env: {
			NODE_ENV: "dev",
			TELEGRAM_TOKEN: process.env['TELEGRAM_TOKEN-dev']
		},
		env_production: {
			NODE_ENV: "production",
			TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN
		}
	}],
	deploy: {
		production: {
			user: 'git',
			host: 'github.com',
			ref: 'origin/master',
			repo: 'git@github.com:elizabeth-dev/meubot.git',
			path: '/var/bots/meubot',
			'post-deploy': 'npm install && pm2 reload process.js --env production'
		}
	}
}
