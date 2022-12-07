import express from 'express'
import http from 'http'
import { generateThingy } from './main'

const app = express()

app.get('/', async (req, res) => {
	const { username } = req.query

	if (!username) {
		res.status(400).send('Error: missing username parameter in query')
		return
	}

	const bfr = await generateThingy(username as string)

	res.setHeader('Content-Disposition', `attachment; filename=${username}.stl`)
	res.status(200).send(bfr)
})

const server = http
	.createServer(app)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
server.listen(port, '0.0.0.0')
console.log(`Server started on port ${port}!`)