import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import { TileContainer } from '@/core/modules/tile'

import {
	Point3D,
	createColorInput,
	isometricToCartesian,
	cartesianToIsometric
} from '@/core/utils'

export default class Tile {
	readonly #position: Point3D
	readonly #container: TileContainer

	constructor(position: Point3D, grid: number[][], thickness: number) {
		this.#position = position

		const hasBorders = [
			this.#isTileEmpty(new Point(0, 1), grid),
			this.#isTileEmpty(new Point(1, 0), grid)
		]

		const isometricPosition = cartesianToIsometric(position)

		this.#container = new TileContainer(
			isometricPosition,
			hasBorders,
			thickness
		)

		this.#setupEventListeners()
	}

	isPositionWithinBounds(position: Point): boolean {
		const { x, y, z } = cartesianToIsometric(this.#position)

		const transformedPoints = this.#container.surfaceCoordinates.map(
			(point, index) => point + (index % 2 === 0 ? x : y - z)
		)

		const polygon = new Polygon(transformedPoints)

		return polygon.contains(position.x, position.y)
	}

	#isTileEmpty(delta: Point, grid: number[][]) {
		const { x, y, z } = isometricToCartesian(this.#position)
		const nextRow = grid[x + delta.x]

		return !nextRow || nextRow[y + delta.y] !== z
	}

	#setupEventListeners() {
		const surfaceFace = this.#container.faces.get('top')

		surfaceFace
			?.on('pointerover', () =>
				this.#container.emit('tile:hover', this.#position)
			)
			.on(
				'pointertap',
				(event: FederatedPointerEvent) =>
					event.button === 0 &&
					this.#container.emit('tile:click', this.#position)
			)
			.on('pointerout', () => this.#container.emit('tile:hoverEnd'))
			.on('pointerleave', () => this.#container.emit('tile:hoverEnd'))

		this.#container.faces.forEach((face, key) =>
			face?.on('rightclick', () =>
				createColorInput(hexColor =>
					this.#container.emit('tile:face-right-click', key, hexColor)
				)
			)
		)
	}

	get container(): TileContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}
}
