import './index.css'

import { Application } from 'pixi.js'

import ClientFactory from './core/ClientFactory'
import { initializeUI } from './ui'

const application = new Application()

initializeUI()
ClientFactory.create(application)
