import { Application } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import { MAX_ZOOM, MININUM_ZOOM } from '@/core/engine/game/constants'

export default class Camera {
	#viewport: Viewport

	constructor(application: Application) {
		this.#viewport = new Viewport({
			screenWidth: application.screen.width,
			screenHeight: application.screen.height,
			events: application.renderer.events
		})

		this.#viewport
			.drag()
			.pinch()
			.wheel()
			.clampZoom({ minScale: MININUM_ZOOM, maxScale: MAX_ZOOM })

		this.#setupEventListeners()
	}

	#setupEventListeners() {
		this.#viewport.on('pointerdown', async event => {
			const { selectedCube } = await import('@/ui/store/inventory')

			if (selectedCube.value && event.target === this.#viewport)
				selectedCube.value = null
		})
	}

	get viewport(): Viewport {
		return this.#viewport
	}

	set enabled(enabled: boolean) {
		if (!this.#viewport) return

		this.#viewport.pause = !enabled
	}
}
