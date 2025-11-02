import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import { Point3D, cartesianToIsometric, isometricToCartesian } from '@/utils/coordinates'
import { TILE_SURFACE_POINTS } from '@/modules/tile/constants'
import { TileContainer } from '@/modules'
import type { FaceKey } from './types'
import { createColorInput } from '@/utils/helpers'

export default class Tile {
	readonly #position: Point3D
	readonly #container: TileContainer

	readonly #grid: number[][]

	constructor(position: Point3D, grid: number[][]) {
		this.#position = position
		this.#grid = grid
		this.#container = new TileContainer(
			cartesianToIsometric(this.#position),
			this.#getBorders(),
		)

		this.#setupEventListeners()
	}

	isPositionWithinBounds(position: Point) {
		const { x, y, z } = cartesianToIsometric(this.#position)

		const transformedPoints = TILE_SURFACE_POINTS.map(
			(point, index) => point + (index % 2 === 0 ? x : y - z),
		)
		const polygon = new Polygon(transformedPoints)

		return polygon.contains(position.x, position.y)
	}

	#setupEventListeners() {
		this.#container.faces.forEach((face, key) =>
			face?.on('rightclick', this.#handleFaceClick.bind(this, key)),
		)

		this.#container
			.on('pointerover', this.#handlePointerOver) // Bind removed as it's now an arrow function property
			.on('pointerdown', this.#handlePointerDown) // Bind removed as it's now an arrow function property
			.on('pointerout', this.#handlePointerOut) // Bind removed as it's now an arrow function property
	}

	#getBorders = (): [boolean, boolean] => [
		this.#isTileEmpty(new Point(0, 1)),
		this.#isTileEmpty(new Point(1, 0)),
	]

	#isTileEmpty(delta: Point) {
		const { x, y, z } = isometricToCartesian(this.#position)

		const nextRow = this.#grid[x + delta.x]
		if (!nextRow) return true

		const tileZ = nextRow[y + delta.y]

		return !tileZ || tileZ !== z
	}

	#handleFaceClick = (key: FaceKey) => {
		createColorInput(hexColor => {
			this.#container.emit('tile-face-right-clicked', this.#position.clone(), key, hexColor)
		})
	}

	#handlePointerOver = () => {
		this.#container.createHoverEffect()
	}

	#handlePointerDown = (event: FederatedPointerEvent) => {
		if (event.button !== 0) return

		this.#container.emit('tile-clicked', this.#position.clone())
	}

	#handlePointerOut = () => {
		this.#container.destroyHoverEffect()
	}

	get container(): TileContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}
}
