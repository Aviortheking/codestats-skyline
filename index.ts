import express from 'express'
import http from 'http'
import { generateThingy } from './main'

const app = express()

app.get('/', async (req, res) => {

	// Fetch the query
	const { username, year } = req.query as Record<string, string>

	// if no username is sent in the request return this simple HTML lul
	if (!username) {
		res.status(400).send('Error: missing username parameter in query')
		return
	}

	// transform the year intoo a number
	const yearN = year ? isNaN(parseInt(year)) ? undefined : parseInt(year) : undefined

	// Generate the STL
	const bfr = await generateThingy(username, yearN)

	if (!bfr) {
		res.status(500)
			.send('It seems the generator could not generate, Please open an issue on Github https://github.com/aviortheking/codestats-skyline/issues/new')
		return
	}

	// force download the STL with a good name
	res
		.setHeader('Content-Disposition', `attachment; filename=${username}-${year ? year : 'full'}.stl`)
		.status(200)
		.send(bfr)
})

// Create the server
const server = http
	.createServer(app)

// start the server on the specified port or the 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
server.listen(port, '0.0.0.0')

console.log(`Server started on port ${port}!`)
