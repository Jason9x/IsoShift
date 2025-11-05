import './index.css'

import './index.css'

import { Application } from 'pixi.js'

import { Client } from './core/engine/game'
import { initializeUI } from './ui'

initializeUI()

const application = new Application()

new Client(application)
