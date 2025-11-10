import { Ticker, type Application } from 'pixi.js'

import { SceneManager } from './scene'
import Camera from './Camera'

export default class Client {
	async initialize(application: Application): Promise<void> {
		await this.#setupApplication(application)

		const camera = await this.#setupCamera(application)

		this.#setupEventListeners(application, camera)

		new SceneManager().watchRoomChanges(camera)

		if (!Ticker.shared.started) Ticker.shared.start()
	}

	async #setupApplication(application: Application) {
		await application.init({
			width: window.innerWidth,
			height: window.innerHeight,
			background: 0x000000,
			resolution: 1
		})

		document.body.appendChild(application.canvas)
	}

	async #setupCamera(application: Application): Promise<Camera> {
		const camera = new Camera(application)
		const { viewport } = camera

		application.stage.addChild(viewport)

		camera.center(application.screen)

		const { setViewport } = await import('@/ui/viewport')
		setViewport(viewport)

		return camera
	}

	#setupEventListeners(application: Application, camera: Camera) {
		window.addEventListener('resize', () => {
			const width = window.innerWidth
			const height = window.innerHeight

			application.renderer.resize(width, height)

			camera.viewport.resize(width, height)
			camera.center(application.screen)
		})

		window.addEventListener('contextmenu', event => event.preventDefault())
	}
}
