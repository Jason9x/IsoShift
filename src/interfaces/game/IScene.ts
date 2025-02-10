import { Application } from 'pixi.js'

export default interface IScene {
	initialize(application: Application): void
	centerStage(application: Application): void
}
