const _ = require('lodash')
const Database = require('better-sqlite3')
const squel = require('squel')

const select = require('./select')

module.exports = {

	one: function (dbPath, schema, resourceType, input) {
		let resource = schema[resourceType]

		// Start with defaults as defined in schema
		let defaults = {}
		for (let schemaKey in resource.fields) {

			// Default provided
			if (resource.fields.default !== undefined) {
				defaults[schemaKey] = resource.fields[schemaKey].default

			// NULL value
			} else {
				defaults[schemaKey] = null
			}
		}

		// Override with user input
		let finalValues = _.merge({}, defaults, input)

		// Prepare query
		let query = squel.insert().into(resource.plural)
		for (let key in finalValues) {
			query = query.set(key, finalValues[key])
		}
		query = query.toString()

		return new Promise(function (resolve, reject) {
			try	{

				// Init database connection
				const db = new Database(dbPath, {
					readonly: false
				})

				// Execute query
				let insertedInfo = db.prepare(query).run()

				// Close local database connection
				db.close()

				// Fetch the inserted object
				select.one(dbPath, schema, resourceType, insertedInfo.lastInsertROWID).then(function (row) {

					// Resolve promise
					resolve(row)
				})

			} catch (error) {
				reject(error)
			}
		})
	}

}
