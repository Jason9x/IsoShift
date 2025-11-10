import type { Point } from 'pixi.js'

import type Camera from '@/core/engine/game/Camera'

export class CameraTrackingManager {
	readonly #viewport: Camera['viewport']
	readonly #updateHover: (position: Point) => void
	readonly #clearHover: () => void

	#isDragging = false

	readonly #hoverUpdateHandler = (event: {
		global?: { x: number; y: number }
	}): void => {
		if (!event?.global || !this.#isDragging) return

		const localPoint = this.#viewport.toLocal(event.global)
		this.#updateHover(localPoint)
	}

	constructor(
		viewport: Camera['viewport'],
		updateHover: (position: Point) => void,
		clearHover: () => void
	) {
		this.#viewport = viewport
		this.#updateHover = updateHover
		this.#clearHover = clearHover
	}

	setup(): void {
		this.#viewport.on('drag-start', () => this.#handleDragStart())
		this.#viewport.on('drag-end', () => this.#handleDragEnd())
	}

	#handleDragStart(): void {
		this.#isDragging = true
		this.#viewport.on('pointermove', this.#hoverUpdateHandler)
	}

	#handleDragEnd(): void {
		this.#isDragging = false
		this.#viewport.off('pointermove', this.#hoverUpdateHandler)

		setTimeout(() => this.#clearHover(), 50)
	}
}
