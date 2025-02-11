import { injectable } from 'inversify'

import { Application, Container, DisplayObject, Point } from 'pixi.js'

import ICamera from '@/interfaces/game/ICamera'

import { MAX_ZOOM, MIN_ZOOM } from '@/constants/Camera.constants'

@injectable()
export default class Camera implements ICamera {
	#enabled: boolean = true
	#initialDragPosition: Point | null = null
	#zoomFactor: number = 0.1

	setupEventListeners(application: Application): void {
		const view = application.view as HTMLCanvasElement
		const stage = application.stage as Container<DisplayObject>

		view.addEventListener(
			'pointerdown',
			this.#onPointerDown.bind(this, stage),
		)
		view.addEventListener(
			'pointermove',
			this.#onPointerMove.bind(this, stage),
		)
		view.addEventListener('pointerup', this.#onPointerUp.bind(this))
		view.addEventListener('wheel', this.#onMouseWheel.bind(this, stage))
	}

	#onPointerDown(_: Container<DisplayObject>, event: MouseEvent): void {
		if (event.button !== 0 || !this.#enabled) return

		this.#initialDragPosition = new Point(event.clientX, event.clientY)
	}

	#onPointerMove(stage: Container<DisplayObject>, event: MouseEvent): void {
		if (!this.#enabled || !this.#initialDragPosition) return

		const delta = new Point(
			event.clientX - this.#initialDragPosition.x,
			event.clientY - this.#initialDragPosition.y,
		)

		stage.position.x += delta.x
		stage.position.y += delta.y

		this.#initialDragPosition = new Point(event.clientX, event.clientY)
	}

	#onPointerUp = (): null => (this.#initialDragPosition = null)

	#onMouseWheel(stage: Container<DisplayObject>, event: WheelEvent): void {
		if (!this.#enabled) return

		// Adjust the zoom factor based on wheel delta (positive for zoom in, negative for zoom out).
		this.#zoomFactor -= event.deltaY * 0.001
		this.#zoomFactor = Math.max(
			MIN_ZOOM,
			Math.min(MAX_ZOOM, this.#zoomFactor),
		)

		stage.scale.set(this.#zoomFactor)
	}

	set enabled(enabled: boolean) {
		this.#enabled = enabled
	}
}
