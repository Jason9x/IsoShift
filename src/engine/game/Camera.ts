import { Application } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import { MAX_ZOOM, MIN_ZOOM } from './constants'

export default class Camera {
	#viewport?: Viewport

	setupEventListeners(application: Application): Viewport {
		this.#viewport = new Viewport({
			events: application.renderer.events,
		})

		this.#viewport
			.drag({ mouseButtons: 'middle' })
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
