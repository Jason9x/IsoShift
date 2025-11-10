import {
	TileMap,
	Avatar,
	Cube,
	DragState,
	CubeCollection
} from '@/core/modules'

import {
	canMoveToTile,
	placeCubeOnTile
} from '@/core/modules/cube/layer/helpers'

import type { Camera } from '@/core/engine/game'

export class CubeDragTracker {
	readonly #collection: CubeCollection
	readonly #onDragEnd: () => void

	#camera?: Camera
	#tileMap?: TileMap
	#avatar?: Avatar
	#draggingCube?: Cube

	#dragMoveHandler?: (event: { global?: { x: number; y: number } }) => void
	#dragEndHandler?: () => void

	constructor(cubeCollection: CubeCollection, onDragEnd: () => void) {
		this.#collection = cubeCollection
		this.#onDragEnd = onDragEnd
	}

	initialize(camera: Camera, avatar: Avatar, tileMap: TileMap): void {
		this.#camera = camera
		this.#avatar = avatar
		this.#tileMap = tileMap
	}

	start(cube: Cube): void {
		this.#draggingCube = cube
		this.#createHandlers()
		this.#attachEvents()
	}

	stop(): void {
		this.#detachEvents()
		this.#clearHandlers()
		this.#draggingCube = undefined
	}

	#createHandlers(): void {
		this.#dragMoveHandler = (event: {
			global?: { x: number; y: number }
		}) => {
			const cube = this.#draggingCube

			if (!cube || cube.dragState !== DragState.Dragging || !event.global)
				return

			this.#handleDragMove(event.global, cube)
		}

		this.#dragEndHandler = () => this.#onDragEnd()
	}

	#handleDragMove(global: { x: number; y: number }, cube: Cube): void {
		const targetTile = this.#tileMap?.findTileByPositionInBounds(
			this.#tileMap.toLocal(global)
		)

		if (
			!targetTile ||
			!canMoveToTile(cube, targetTile, this.#avatar, this.#collection)
		)
			return

		placeCubeOnTile(cube, targetTile, this.#collection)
	}

	#attachEvents(): void {
		const { viewport } = this.#camera ?? {}

		if (!viewport || !this.#dragMoveHandler || !this.#dragEndHandler) return

		viewport.on('pointermove', this.#dragMoveHandler)
		viewport.on('pointerup', this.#dragEndHandler)
		viewport.on('pointerupoutside', this.#dragEndHandler)
	}

	#detachEvents(): void {
		const { viewport } = this.#camera ?? {}

		if (!viewport || !this.#dragMoveHandler || !this.#dragEndHandler) return

		viewport.off('pointermove', this.#dragMoveHandler)
		viewport.off('pointerup', this.#dragEndHandler)
		viewport.off('pointerupoutside', this.#dragEndHandler)
	}

	#clearHandlers(): void {
		this.#dragMoveHandler = undefined
		this.#dragEndHandler = undefined
	}

	get draggingCube(): Cube | undefined {
		return this.#draggingCube
	}
}
