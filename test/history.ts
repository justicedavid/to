import * as fs from 'fs'
import * as path from 'path'

import test from 'ava'

import * as tempy from 'tempy'

import {
	createHistorian
} from '../source/history'

test('touches file if doesn\'t exist', t => {
	let filePath = tempy.file()

	t.false(fs.existsSync(filePath))
	createHistorian(filePath)
	t.true(fs.existsSync(filePath))
})

test('reads existing history', t => {
	let filePath = tempy.file()

	fs.writeFileSync(filePath, ['1', '2', '3'].join('\n') + '\n')

	let historian = createHistorian(filePath)
	t.deepEqual(historian.history, ['3', '2', '1'])
})

test('appends to file', t => {
	let filePath = tempy.file()

	fs.writeFileSync(filePath, ['1', '2', '3'].join('\n') + '\n')

	let historian = createHistorian(filePath)
	historian.commit('4')

	t.deepEqual(historian.history, ['4', '3', '2', '1'])
	t.deepEqual(
		fs.readFileSync(filePath, 'utf-8'),
		'1\n2\n3\n4\n'
	)
})

test('truncates file upon initialization if it\'s too long', t => {
	let filePath = tempy.file()
	let history = new Array(1500).fill(0).map((_, i) => i.toString())

	fs.writeFileSync(filePath, history.join('\n') + '\n')

	let readHistory = (): string =>
		fs.readFileSync(filePath, 'utf-8')

	let historian = createHistorian(filePath)

	let expectedTruncatedHistory = new Array(1000)
		.fill(0)
		.map((_, i) => (i + 500).toString())
		.reverse()

	t.is(expectedTruncatedHistory[0], '1499')

	t.is(readHistory().trim().split('\n').length, 1000)
	t.deepEqual(historian.history, expectedTruncatedHistory)

	t.deepEqual(
		readHistory().trim().split('\n'),
		expectedTruncatedHistory.reverse()
	)
})

test('mkdir -p\'s its history file path', t => {
	let baseDirectory = tempy.directory()
	let targetDirectory = path.join(baseDirectory, 'deep', 'nest')
	let targetPath = path.join(targetDirectory, 'file')

	createHistorian(targetPath)

	t.true(fs.existsSync(targetPath))
})
