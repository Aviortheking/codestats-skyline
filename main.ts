import { objectLoop, objectValues } from '@dzeio/object-util'
import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import { CodeStatsJSON } from './interfaces'
// @ts-expect-error no typing for this lib
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

export const generateThingy = async (username: string) => {

	const res = await fetch(`https://codestats.net/api/users/${username}`)
	
	const data = await res.json() as CodeStatsJSON

	const correctedData: Record<string, Array<number>> = {}

	for (const month of months) {
		if (month === '') {
			continue
		}
		correctedData[month] = Array(31).fill(0)
	}

	objectLoop(data.dates, (value, key) => {
		const [yearTxt, monthTxt, dayTxt] = key.split('-')
		// if we want to add a way to filter by year we can by using the `_` var
		const [_, month, day] = [parseInt(yearTxt), parseInt(monthTxt), parseInt(dayTxt)]
		if (!(months[month] in correctedData)) {
			correctedData[months[month]] = []
		}
		if (!(day in correctedData[months[month]])) {
			correctedData[months[month]][day] = 0
		}
		correctedData[months[month]][day] += value
	})

	const max = objectValues(correctedData).reduce((p, c) => {
		const monthMax = Math.max(...c)
		return monthMax > p ? monthMax : p
	}, 0)

	const min = objectValues(correctedData).reduce((p, c) => {
		const monthMax = Math.min(...c)
		return monthMax < p ? monthMax : p
	}, 0)

	let final = ''
	objectLoop(correctedData, (value, key) => {
		final += `${key} = [${value.slice(1).join(', ')}];\n`
	})
	final += `max = ${max};\n`
	final += `min = ${min};\n`
	final += `text = "${username}";`
	
	console.log('Output:')
	console.log(final)

	// handle prod file
	let cadPath = './3d.scad'
	if (!await exists(cadPath)) {
		cadPath = '../3d.scad'
	}

	const file = await fs.readFile(cadPath, 'utf-8')
	const modified = file.replace(/\/\/.+\/\//gs, final)
	// await fs.writeFile('output.scad', file.replace(/\/\/.+\/\//gs, final))

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

	return stl.buffer as Buffer
}
