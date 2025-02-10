import { Application } from 'pixi.js'

export default interface ICamera {
	enabled: boolean

	setupEventListeners(application: Application): void
}
