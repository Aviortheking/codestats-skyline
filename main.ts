import { objectLoop, objectValues } from '@dzeio/object-util'
import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import { CodeStatsJSON } from './interfaces'
// @ts-expect-error no typing available for this lib
import nodescad from 'nodescad'

const months = [
	'',
	'jan',
	'feb',
	'mar',
	'apr',
	'may',
	'jun',
	'jul',
	'aug',
	'sep',
	'oct',
	'nov',
	'dec',
]

async function exists(path: string) {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}

export const generateThingy = async (username: string, filterYear?: number): Promise<Buffer | null> => {

	// Start generation
	const now = new Date()
	console.log(`Generating for ${username} (year = ${filterYear})`)

	// Fetch from code::stats the informations (currently no cache is used, but is too much requests are sent one will be put)
	const res = await fetch(`https://codestats.net/api/users/${username}`, {
		headers: {
			// Identify the software
			'User-Agent': '@aviortheking/codestats-skyline'
		}
	})

	if (res.status !== 200) {
		console.error(`Could not generate STL, Code::Stats is being mean to me (statusCode: ${res.status})`)
		return null
	}

	// Response from Code::Stats
	const data = await res.json() as CodeStatsJSON

	// object that will contain aggregated values
	const correctedData: Record<string, Array<number>> = {}

	// Fill the arrays
	for (const month of months) {
		if (month === '') {
			continue
		}
		correctedData[month] = Array(31).fill(0)
	}

	// loop through each dates
	objectLoop(data.dates, (value, key) => {
		// get the year-month-day from the key
		const [yearTxt, monthTxt, dayTxt] = key.split('-')
		const [year, month, day] = [parseInt(yearTxt), parseInt(monthTxt), parseInt(dayTxt)]

		// if there is year filtering and it is not the correct year, filter out
		if (filterYear && filterYear !== year) {
			return
		}

		// add XP points to the new object
		correctedData[months[month]][day] += value
	})

	// get the maximum value from the list
	const max = objectValues(correctedData).reduce((p, c) => {
		const monthMax = Math.max(...c.slice(1))
		return monthMax > p ? monthMax : p
	}, 0)

	// get the minimum value from the list
	const min = objectValues(correctedData).reduce((p, c) => {
		const monthMax = Math.min(...c.slice(1))
		return monthMax < p ? monthMax : p
	}, 0)

	// prepare the file replacement
	let final = ''

	// Add each months
	objectLoop(correctedData, (value, key) => {
		final += `${key} = [${value.slice(1).join(', ')}];\n`
	})

	// Add additionnal informations for generation
	final += `max = ${max};\n`
	final += `min = ${min};\n`
	final += `text = "${username}";\n`
	final += `year = "${filterYear}";\n`

	// Fetch the CAD file
	let cadPath = './3d.scad'
	if (!await exists(cadPath)) {
		cadPath = '../3d.scad'
	}
	const file = await fs.readFile(cadPath, 'utf-8')

	// Modify the file content with our previous values
	const modified = file.replace(/\/\*-.+-\*\//gs, final)

	// Render the file to an STL with OpenSCAD
	const stl = await new Promise<any>((res, rej) => {
		nodescad.render({
			input: modified
		}, (err: Error, result: any) => {
			if (err) {
				rej(err)
				return
			}

			res(result)
		})
	})

	console.log(`Finished generating for ${username} (year = ${filterYear}, timeToGenerate = ${new Date().getTime() - now.getTime()}ms)`)

	// return the buffer
	return stl.buffer as Buffer
}
