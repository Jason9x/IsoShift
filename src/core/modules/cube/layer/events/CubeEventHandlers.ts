import type { Container, Point } from 'pixi.js'

import {
	Tile,
	TileMap,
	Cube,
	Avatar,
	CubeDragTracker,
	CubeMenuHandler,
	CubeActions,
	CubeCollection
} from '@/core/modules'

import type { Camera } from '@/core/engine/game'

import {
	createMockPointerEvent,
	canMoveToTile,
	canPlaceCubeAtTile,
	placeCubeOnTile
} from '../helpers'

export class CubeEventHandlers {
	#avatar?: Avatar
	#tileMap?: TileMap

	readonly #collection: CubeCollection
	readonly #dragTracker: CubeDragTracker
	readonly #menuHandler: CubeMenuHandler
	readonly #actions: CubeActions
	readonly #onFinalizeOperation: () => void

	constructor(
		collection: CubeCollection,
		container: Container,
		onFinalizeOperation: () => void
	) {
		this.#collection = collection
		this.#onFinalizeOperation = onFinalizeOperation

		this.#dragTracker = new CubeDragTracker(collection, () => {
			const cube = this.#dragTracker.draggingCube
			if (cube) this.#handleDragEnd(cube)
		})

		this.#menuHandler = new CubeMenuHandler()
		this.#actions = new CubeActions(
			collection,
			container,
			onFinalizeOperation
		)
	}

	initialize(camera: Camera, avatar: Avatar, tileMap: TileMap): void {
		this.#avatar = avatar
		this.#tileMap = tileMap
		this.#dragTracker.initialize(camera, avatar, tileMap)
		this.#actions.initialize(camera)
	}

	setup(cube: Cube): void {
		cube.container.on('cube-clicked', this.#handleClick.bind(this))
		cube.container.on('cube-drag-start', this.#handleDragStart.bind(this))
		cube.container.on('cube-drag-move', this.#handleDragMove.bind(this))
		cube.container.on('cube-drag-end', (cube: Cube) =>
			this.#handleDragEnd(cube)
		)
	}

	canPlaceCubeAtTile = (tile: Tile, cubeSize: number): boolean =>
		canPlaceCubeAtTile(tile, cubeSize, this.#avatar, this.#collection)

	#handleClick = async (cube: Cube, globalPosition: Point): Promise<void> => {
		if (this.#menuHandler.justFinishedDragging) return

		const { cubeMenuState } = await import('@/ui/store/cubeMenu')

		cubeMenuState.value = {
			x: globalPosition.x,
			y: globalPosition.y,
			onRotate: () => this.#actions.rotate(cube),
			onMove: () => this.#startMove(cube),
			onDelete: () => this.#actions.delete(cube)
		}
	}

	#startMove = (cube: Cube): void => this.#actions.startMove(cube)

	#handleDragStart = (cube: Cube): void => {
		this.#actions.beginDrag()
		this.#dragTracker.start(cube)
	}

	#handleDragMove = (cube: Cube, globalPosition: Point): void => {
		const mockEvent = createMockPointerEvent(globalPosition)
		cube.currentTile?.container.emit('pointerout', mockEvent)

		const targetTile = this.#tileMap?.findTileByPositionInBounds(
			this.#tileMap.toLocal(globalPosition)
		)

		if (
			!targetTile ||
			!canMoveToTile(cube, targetTile, this.#avatar, this.#collection)
		)
			return

		placeCubeOnTile(cube, targetTile, this.#collection)

		this.#onFinalizeOperation()

		cube.currentTile?.container.emit('pointerover', mockEvent)
	}

	#handleDragEnd = (cube: Cube): void => {
		this.#dragTracker.stop()
		this.#actions.resetDrag(cube)
		this.#onFinalizeOperation()
		this.#menuHandler.blockClicks()
		this.#actions.enableCamera()
	}
}
