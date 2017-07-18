const Database = require('better-sqlite3')

const insert = require('../insert')

module.exports = function (dbPath, schema, data) {

	// Init database connection
	const db = new Database(dbPath, {
		readonly: false
	})

	// Set up each resource
	for (let resourceType in schema) {
		// let resource = schema[resourceType]

		// Look initial data from JSON
		if (data[resourceType]) {
			let resourceData = data[resourceType]
			for (var i = 0; i < resourceData.length; i++) {
				insert.one(dbPath, schema, resourceType, resourceData[i])
			}
		}

	}

	db.close()

}
