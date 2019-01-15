'use strict'

const https = require('https')
const agent = new https.Agent({ keepAlive: true, maxFreeSockets: 5 })
const botgram = require('botgram')
const bot = botgram(process.env.TELEGRAM_TOKEN, { agent: agent })
const chatId = parseInt(process.env.CHAT_ID)

const env = 'process.env.NODE_ENV'

const patpat = [
	'CAADBAADNQADPhqrAuIowgEmh22mAg', // Happy
	'CAADAgADCAEAApmPpQfhiFbfzEYv7QI', // Leg
	'CAADBAADugIAAlI5kwYl_EvbjRwMIgI', // Heart
	'CAADAgADGAEAApmPpQeiMfcfzYAFCgI', // Inside a heart
	'CAADBAADMQADPhqrAl3dd2EKB5DuAg', // Hug
	'CAADAgADGgEAApmPpQceXluu7FDYHAI' // Saying a heart
]
const cookie = [
	'CAADAgADMAEAAjbsGwU_27lSGgyW8wI', // Cookie standing
	'CAADBAADKgADPhqrAmNilfnm_W7SAg', // Cookie Detective
	'CAADBAADNAADPhqrArEbkgABa7ltggI', // Santa cookie
	'CAADBAADJwADPhqrAuCITsSagxEXAg', // Donut
	'CAADBAADhQMAAlI5kwZMdMHREfPEeAI', // Cookie laying
	'CAADBAADsgMAAlI5kwYGlNbK360GhwI' // Pancakes
]

function isSleeping() {
	if ((new Date().getUTCHours() + 1) % 24 >= 9) {
                return false
        } else {
		return true
	}
}

function meow() {
	let reply = bot.reply(chatId)
	let random = Math.floor(Math.random() * 10)

	if (random === 0) {
		reply.sticker('CAADAgADDQADW34RE1irFTfwz4QiAg') // Ask for cookies
	} else if (random === 1) {
		reply.sticker('CAADAgADnQEAAjbsGwVbpgs1795URwI') // Sad
	} else {
		let text = 'Mè'

		// Generate a random number of 'e', between 0 and 10
		const randTime = Math.floor(Math.random() * 12)
		for (let i = 0; i < randTime; i++) {
			text += 'e'
		}

		text += 'u'
		reply.text(text)
	}
}

function onTimeout() {
	if (env === 'dev') {
		console.log(msg)
	}
	if (!isSleeping()) {
		meow()
	}
	setTimeout(onTimeout, Math.floor((Math.random() * 36e5) + 36e5))
}

bot.all((msg, reply, next) => {

	if (isSleeping() && msg.type === 'command') {
		reply.sticker('CAADAgADCgADW34RE_We9I4GPSllAg') // Sleeping
	} else {
		next()
	}
})

bot.command('patpat', 'start', (msg, reply) => {
	let random = Math.floor(Math.random() * patpat.length)
	reply.sticker(patpat[random])
})

bot.command('cookie', (msg, reply) => {
	let random = Math.floor(Math.random() * cookie.length)
	reply.sticker(cookie[random])
})

bot.text((msg, reply) => {
	if (msg.text.toUpperCase() === 'OH' && !isSleeping()) {
		reply.sticker('CAADBAAD5AIAAlI5kwYZMtKT6WhHTgI') // Oh
	}

})

onTimeout()
