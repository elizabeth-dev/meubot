'use strict'

const https = require('https')
const agent = new https.Agent({ keepAlive: true, maxFreeSockets: 5 })
const botgram = require('botgram')
const bot = botgram(process.env.TELEGRAM_TOKEN, { agent: agent })

const sqlite = require('sqlite3')
const db = new sqlite.Database('chats.db', (err) => {
	if (err) {
		console.error('DB load error: ' + err)
	}
})

db.run('CREATE TABLE IF NOT EXISTS Chats (id INT PRIMARY KEY)')

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

const pizza = [
	'CAADAgADHgEAApmPpQf3fMyh0ylgAgI', // Need pizza
	'CAADBAADfwMAAlI5kwY00qE2riDGNgI', // Eat inside box
	'CAADBAADiQMAAlI5kwYtssSryVDSGAI', // Make pizza
	'CAADAgADuAADmY-lB4KvrWz3nRM1Ag' // Eat pizza
]

const oh = 'CAADBAAD5AIAAlI5kwYZMtKT6WhHTgI';

function meowTimeout() {
	return Math.floor((Math.random() * 36e5) + 36e5) // Random timeout for every meow
}

function isSleeping() {
	if ((new Date().getUTCHours() + 1) % 24 >= 9) {
		return false
	} else {
		return true
	}
}
function random(length) {
	return Math.floor(Math.random() * length)
}

function meow() {
	db.each('SELECT id from Chats', (err, row) => {
		if (err) {
			console.error('Meow error: ' + err)
		} else {
			let reply = bot.reply(row.id)
			let randAction = random(12)

			if (randAction === 0) {
				reply.sticker('CAADAgADDQADW34RE1irFTfwz4QiAg') // Ask for cookies
			} else if (randAction === 1) {
				reply.sticker('CAADAgADnQEAAjbsGwVbpgs1795URwI') // Sad
			} else if (randAction === 2) {
				reply.sticker('CAADBAAD2AIAAlI5kwa4IYnU6rFSuAI') // Angry
			} else if (randAction === 3) {
				reply.document('CgADBAADZJ4AAkQdZAfeKxymj1rlLwI') // Computer gif
			} else {
				let text = 'Mè'

				// Generate a random number of 'e', between 0 and 10
				const randLetters = random(12)
				for (let i = 0; i < randLetters; i++) {
					text += 'e'
				}

				text += 'u'
				reply.text(text)
			}
			console.log('Meowed to ' + row.id)
		}
	}, (err, rows) => {
		if (err) {
			console.error('Meow completion error: ' + err)
		} else {
			console.log('Meowed ' + rows + ' times.')
		}
	})
}

function onTimeout() {
	if (!isSleeping()) {
		meow()
	}
	setTimeout(onTimeout, meowTimeout())
}

bot.command('register', (msg, reply) => {
	db.run('INSERT INTO Chats VALUES (' + msg.chat.id + ')', (err) => {
		if (err) {
			console.error('Register error: ' + err)
			reply.text('Ha ocurrido un error al registrar este chat.')
		} else {
			reply.text('Este chat ha sido registrado, ahora, recibirá visitas de Méubot de vez en cuando.')
		}
	})
})

bot.command('unregister', (msg, reply) => {
	db.run('DELETE FROM Chats WHERE id = ' + msg.chat.id, (err) => {
		if (err) {
			console.error('Register error: ' + err)
			reply.text('Ha ocurrido un error al eliminar este chat.')
		} else {
			reply.text('Este chat ha sido eliminado, ahora, Méubot no volverá a maullar hasta que le vuelvas a llamar.')
		}
	})
})

bot.command((msg, reply, next) => {
	if (isSleeping()) {
		reply.sticker('CAADAgADCgADW34RE_We9I4GPSllAg') // Sleeping
	} else {
		next()
	}
})

bot.command('patpat', 'start', (msg, reply) => {
	reply.sticker(patpat[random(patpat.length)])
})

bot.command('cookie', (msg, reply) => {
	reply.sticker(cookie[random(cookie.length)])
})

bot.command('pizza', (msg, reply) => {
	reply.sticker(pizza[random(pizza.length)])
})

bot.all((msg, reply) => {
	if (!isSleeping()) {
		if ((msg.type === 'text' && msg.text.toUpperCase() === 'OH') || (msg.type === 'sticker' && msg.file.id === oh)) {
			reply.sticker(oh) // Oh
		}
	}
})

setTimeout(onTimeout, meowTimeout)
