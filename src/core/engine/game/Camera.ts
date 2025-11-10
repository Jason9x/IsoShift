import { Application, ObservablePoint, Rectangle } from 'pixi.js'
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

	center = (screen: Rectangle): ObservablePoint =>
		this.#viewport.position.set(screen.width / 2, screen.height / 2)

	#setupEventListeners() {
		let wheelTimer: ReturnType<typeof setTimeout> | undefined

		this.#viewport
			.on('pointerdown', async event => {
				const { selectedCube } = await import('@/ui/store/inventory')

				if (selectedCube.value && event.target === this.#viewport)
					selectedCube.value = null
			})
			.on(
				'drag-start',
				() => (this.#viewport.interactiveChildren = false)
			)
			.on('drag-end', () =>
				setTimeout(() => (this.#viewport.interactiveChildren = true), 0)
			)
			.on(
				'pinch-start',
				() => (this.#viewport.interactiveChildren = false)
			)
			.on('pinch-end', () =>
				setTimeout(() => (this.#viewport.interactiveChildren = true), 0)
			)
			.on('wheel', () => {
				this.#viewport.interactiveChildren = false

				if (wheelTimer) clearTimeout(wheelTimer)

				wheelTimer = setTimeout(
					() => (this.#viewport.interactiveChildren = true),
					150
				)
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
