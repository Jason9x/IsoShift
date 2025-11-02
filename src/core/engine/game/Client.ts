import {
	Application,
	type ApplicationOptions,
	Container,
	Point,
	Ticker,
} from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import type { Camera } from '@/core/engine/game'
import type { Avatar } from '@/core/modules/avatar'

export default class Client {
	readonly #application: Application
	readonly #camera: Camera
	readonly #avatar: Avatar
	readonly #layers: Container[]
	#viewport?: Viewport

	constructor(
		application: Application,
		camera: Camera,
		avatar: Avatar,
		layers: Container[],
	) {
		this.#application = application
		this.#camera = camera
		this.#avatar = avatar
		this.#layers = layers

		void this.#initialize()
	}

	async #initialize() {
		const applicationOptions: Partial<ApplicationOptions> = {
			width: window.innerWidth,
			height: window.innerHeight,
			background: 0x000000,
			antialias: false,
			resolution: 1,
			autoDensity: true,
		}

		await this.#application.init(applicationOptions)

		this.#viewport = this.#camera.setupEventListeners(this.#application)
		this.#application.stage.addChild(this.#viewport)
		this.#viewport.addChild(...this.#layers)

		const { setViewport } = await import('@/ui/viewport')
		setViewport(this.#viewport)

		this.#centerViewport()
		this.#startTicker()

		this.#appendViewToDOM()
		this.#setupEventListeners()
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
		this.#centerViewport()
	}

	#centerViewport() {
		if (!this.#viewport) return

		const centerPosition = new Point(
			this.#application.screen.width / 2,
			this.#application.screen.height / 2,
		)

		this.#viewport.position.copyFrom(centerPosition)
	}

	#startTicker = () => Ticker.shared.add(this.#update, this)

	#update = (ticker: Ticker) => this.#avatar.update(ticker.deltaTime)
}
