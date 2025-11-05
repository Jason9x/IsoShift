import type { Application } from 'pixi.js'

import SceneManager from './SceneManager'
import Camera from './Camera'

export default class Client {
	readonly #application: Application

	constructor(application: Application) {
		this.#application = application

		this.#initialize()
	}

	async #initialize() {
		await this.#setupApplication()

		const camera = await this.#setupCamera()
		this.#setupEventListeners(camera.viewport)

		new SceneManager().watchRoomChanges(camera).startTicker()
	}

	async #setupApplication() {
		await this.#application.init({
			width: window.innerWidth,
			height: window.innerHeight,
			background: 0x000000,
			resolution: 1,
		})

		document.body.appendChild(this.#application.canvas)
	}

	async #setupCamera(): Promise<Camera> {
		const camera = new Camera(this.#application)
		const { viewport } = camera

		this.#application.stage.addChild(viewport)

		viewport.position.set(
			this.#application.screen.width / 2,
			this.#application.screen.height / 2
		)

		const { setViewport } = await import('@/ui/viewport')
		setViewport(viewport)

		return camera
	}

	#setupEventListeners(viewport: Camera['viewport']) {
		window.addEventListener('resize', () =>
			this.#application.renderer.resize(
				window.innerWidth,
				window.innerHeight
			)
		)

		window.addEventListener('contextmenu', event => event.preventDefault())

		viewport.on('pointerdown', async event => {
			const { selectedCube } = await import('@/ui/store/inventory')

			if (selectedCube.value && event.target === viewport)
				selectedCube.value = null
		})
	}
}
