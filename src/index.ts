import './index.css'

import { Application } from 'pixi.js'

import { Client } from './core/engine/game'
import { initializeUI } from './ui'

const main = async () => {
	initializeUI()

	const application = new Application()
	const client = new Client()

	await client.initialize(application)
}

main()
