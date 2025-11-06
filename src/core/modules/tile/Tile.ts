import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import { TileContainer } from '@/core/modules/tile'

import {
	Point3D,
	createColorInput,
	isometricToCartesian,
	type FaceKey,
	cartesianToIsometric
} from '@/core/utils'

type EventHandlers = {
	onTileClick: (position: Point3D) => void
	onTileHover: (position: Point3D) => void
	onTileHoverEnd: () => void
	onTileFaceRightClick: (key: FaceKey, hexColor: number) => void
}

export default class Tile {
	readonly #position: Point3D
	readonly #grid: number[][]
	readonly #container: TileContainer

	constructor(position: Point3D, grid: number[][], tileThickness: number) {
		this.#position = position
		this.#grid = grid

		const hasBorders = [
			this.#isTileEmpty(new Point(0, 1)),
			this.#isTileEmpty(new Point(1, 0))
		]

		const isometricPosition = cartesianToIsometric(position)

		this.#container = new TileContainer(
			isometricPosition,
			hasBorders,
			tileThickness
		)
	}

	setupEventHandlers(handlers: EventHandlers): void {
		this.#container.faces.forEach((face, key) =>
			face?.on('rightclick', () =>
				createColorInput(hexColor =>
					handlers.onTileFaceRightClick(key, hexColor)
				)
			)
		)

		this.#container
			.on('pointerover', () =>
				this.#handlePointerOver(handlers.onTileHover)
			)
			.on(
				'pointerdown',
				(event: FederatedPointerEvent) =>
					event.button === 0 && handlers.onTileClick(this.#position)
			)
			.on('pointerout', () =>
				this.#handlePointerOut(handlers.onTileHoverEnd)
			)
			.on('pointerleave', () =>
				this.#handlePointerOut(handlers.onTileHoverEnd)
			)
	}

	isPositionWithinBounds(position: Point): boolean {
		const { x, y, z } = cartesianToIsometric(this.#position)

		const transformedPoints = this.#container.surfaceCoordinates.map(
			(point, index) => point + (index % 2 === 0 ? x : y - z)
		)

		const polygon = new Polygon(transformedPoints)

		return polygon.contains(position.x, position.y)
	}

	#isTileEmpty(delta: Point) {
		const { x, y, z } = isometricToCartesian(this.#position)
		const nextRow = this.#grid[x + delta.x]

		return !nextRow || nextRow[y + delta.y] !== z
	}

	#handlePointerOver = (onTileHover: (position: Point3D) => void) => {
		this.#container.createHoverEffect()

		onTileHover(this.#position)
	}

	#handlePointerOut = (onTileHoverEnd: () => void) => {
		this.#container.destroyHoverEffect()

		onTileHoverEnd()
	}

	get container(): TileContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}
}
