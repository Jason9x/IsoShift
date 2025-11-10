import type { Container } from 'pixi.js'

import { Cube, DragState } from '@/core/modules/cube'
import type { Camera } from '@/core/engine/game'

import type { CubeCollection } from '../managers/CubeCollection'

export class CubeActions {
	readonly #collection: CubeCollection
	readonly #container: Container
	readonly #onFinalizeOperation: () => void

	#camera?: Camera

	constructor(
		cubeCollection: CubeCollection,
		container: Container,
		onFinalizeOperation: () => void
	) {
		this.#collection = cubeCollection
		this.#container = container
		this.#onFinalizeOperation = onFinalizeOperation
	}

	initialize(camera: Camera): void {
		this.#camera = camera
	}

	rotate(cube: Cube): void {
		cube.flip()
		this.#onFinalizeOperation()
	}

	startMove(cube: Cube): void {
		cube.container.alpha = 0.5
		cube.setDragState(DragState.Enabled)
		cube.beginDrag()
	}

	beginDrag(): void {
		if (!this.#camera) return

		this.#camera.enabled = false
	}

	delete(cube: Cube): void {
		this.#collection.remove(cube, this.#container)
		this.#onFinalizeOperation()
	}

	resetDrag(cube: Cube): void {
		cube.container.alpha = 1
		cube.setDragState(DragState.Idle)
	}

	enableCamera(): void {
		this.#camera && (this.#camera.enabled = true)
	}
}
