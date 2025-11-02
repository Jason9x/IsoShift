import { Application, type ApplicationOptions } from 'pixi.js'

import type { Scene } from '@/engine/game'

export default class Client {
	readonly #application: Application
	readonly #scene: Scene

	constructor(application: Application, scene: Scene) {
		this.#application = application
		this.#scene = scene

		void this.#initialize()
	}

	async #initialize() {
		await this.#application.init(this.#applicationOptions)
		this.#scene.initialize(this.#application)

		this.#appendViewToDOM()
		this.#setupEventListeners()
	}

	get #applicationOptions(): Partial<ApplicationOptions> {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			background: 0x000000,
			antialias: false,
			resolution: 1,
			autoDensity: true
		}
	}

	#appendViewToDOM = () =>
		document.body.appendChild(this.#application.canvas as HTMLCanvasElement)

	#setupEventListeners() {
		window.addEventListener('resize', this.#handleWindowResize.bind(this))
		window.addEventListener('contextmenu', (event: MouseEvent) =>
			event.preventDefault(),
		)
	}

	#handleWindowResize() {
		this.#application.renderer.resize(window.innerWidth, window.innerHeight)
		this.#scene.centerStage(this.#application)
	}
}
