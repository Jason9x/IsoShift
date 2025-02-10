import IScene from '@/interfaces/game/IScene'

import { Application, IApplicationOptions } from 'pixi.js'
import { inject, injectable } from 'inversify'

@injectable()
export default class Client {
	readonly #application: Application
	readonly #scene: IScene

	constructor(@inject('IScene') scene: IScene) {
		this.#application = new Application(this.#applicationOptions)
		this.#scene = scene

		this.#initialize()
	}

	#initialize() {
		this.#scene.initialize(this.#application)

		this.#appendViewToDOM()
		this.#setupEventListeners()
	}

	get #applicationOptions(): Partial<IApplicationOptions> {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x000000,
			antialias: false,
			resolution: 1,
			autoDensity: true,
		}
	}

	#appendViewToDOM = () =>
		document.body.appendChild(this.#application.view as HTMLCanvasElement)

	#setupEventListeners() {
		window.addEventListener('resize', this.#handleWindowResize.bind(this))
		window.addEventListener('contextmenu', (event: MouseEvent) =>
			event.preventDefault(),
		)
	}

	#handleWindowResize() {
		const { innerWidth, innerHeight } = window

		this.#application.renderer.resize(innerWidth, innerHeight)
		this.#scene.centerStage(this.#application)
	}

	get application(): Application {
		return this.#application
	}
}
