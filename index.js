const config = require('./crude.json')

// Treat paths
const path = require('path')
const dataPath = path.resolve(__dirname, config.data)
const schemaPath = path.resolve(__dirname, config.schema)
const dbPath = path.resolve(__dirname, config.db)

// Deps
const express = require('express')
const crude = require('./src')

// Optional middleware
const cors = require('cors')
const nocache = require('nocache')

// Setup
const app = express()
app.set('port', (process.env.PORT || 3333))
app.use(cors())
app.use(nocache())

// Set up crude
crude.init(app, dbPath, schemaPath, dataPath)

// Specific command defined (other than start)
let command = process.argv[2]
if (command && command !== 'start') {

	// List of supported commands
	switch (command) {

	case 'clear':
		crude.clearDatabase()
		break

	case 'init':
		crude.setupDatabase()
		break

	case 'load':
		crude.loadData()
		break

	default:
		console.log('Unsupported command passed. Try "clear", "init" or "load"')
		break

	}

// Start the server
} else {

	// Start app with some debug info
	const chalk = require('chalk')
	app.listen(app.get('port'), function () {
		let url = 'http://localhost:' + app.get('port')

		console.log('Crude API is now running with these endpoints:')

		let endpoints = crude.endpoints()
		let lastPath

		for (let key in endpoints) {
			let endpoint = endpoints[key]
			let method = endpoint.method.toUpperCase()
			let path = url + endpoint.path + (endpoint.params ? '/:' + endpoint.params.join('/:') : '')

			let color = endpoint.method === 'get'
				? 'blue'
				: endpoint.method === 'delete'
					? 'yellow'
					: 'green'

			if (lastPath !== endpoint.path) {
				lastPath = endpoint.path
				console.log()
			}

			console.log(chalk[color]('\t' + method + '\t\t') + path)

		}

	})

}
