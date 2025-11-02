import { Application } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import { MAX_ZOOM, MIN_ZOOM } from '@/core/engine/game/constants'

export default class Camera {
	#viewport?: Viewport

	setupEventListeners(application: Application): Viewport {
		this.#viewport = new Viewport({
			screenWidth: application.screen.width,
			screenHeight: application.screen.height,
			events: application.renderer.events,
		})

		this.#viewport
			.drag()
			.pinch()
			.wheel()
			.clampZoom({ minScale: MIN_ZOOM, maxScale: MAX_ZOOM })

		return this.#viewport
	}

	set enabled(enabled: boolean) {
		if (!this.#viewport) return

		this.#viewport.pause = !enabled
	}
}
