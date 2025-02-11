import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import Point3D from '@/utils/coordinates/Point3D'

import { TILE_SURFACE_POINTS } from '@/constants/Tile.constants'
import container from '@/inversify.config'

import TileContainer from './TileContainer'

import { FaceKey } from '@/types/BoxFaces.types'

import createColorInput from '@/utils/helpers/colorInputHelper'
import { cartesianToIsometric, isometricToCartesian } from '@/utils/coordinates/coordinateTransformations'

import ITileMap from '@/interfaces/modules/ITileMap'
import IAvatar from '@/interfaces/modules/IAvatar'

export default class Tile {
	readonly #position: Point3D
	readonly #container: TileContainer

	constructor(position: Point3D) {
		this.#position = position
		this.#container = new TileContainer(
			cartesianToIsometric(this.#position),
			this.#getBorders()
		)

		this.#setupEventListeners()
	}

	isPositionWithinBounds(position: Point) {
		const { x, y, z } = cartesianToIsometric(this.#position)

		const transformedPoints = TILE_SURFACE_POINTS.map(
			(point, index) => point + (index % 2 === 0 ? x : y - z)
		)
		const polygon = new Polygon(transformedPoints)

		return polygon.contains(position.x, position.y)
	}

	#setupEventListeners() {
		this.#container.faces.forEach((face, key) =>
			face?.on('rightclick', this.#handleFaceClick.bind(this, key))
		)

		this.#container
			.on('pointerover', this.#handlePointerOver.bind(this))
			.on('pointerdown', this.#handlePointerDown.bind(this))
			.on('pointerout', this.#handlePointerOut.bind(this))
	}

	#getBorders = (): [boolean, boolean] => [
		this.#isTileEmpty(new Point(0, 1)),
		this.#isTileEmpty(new Point(1, 0))
	]

	#isTileEmpty(delta: Point) {
		const { x, y, z } = isometricToCartesian(this.#position)

		const grid = container.get<number[][]>('Grid')
		const nextRow = grid[x + delta.x]
		if (!nextRow) return true

		const tileZ = nextRow[y + delta.y]

		return !tileZ || tileZ !== z
	}

	#handleFaceClick = (key: FaceKey) =>
		createColorInput(hexColor =>
			container
				.get<ITileMap>('ITileMap')
				.tiles.forEach(tile =>
				tile.container?.faces.get(key)?.initialize(hexColor)
			)
		)

	#handlePointerOver() {
		this.#container.createHoverEffect()
	}

	async #handlePointerDown(event: FederatedPointerEvent) {
		if (event.button !== 0) return

		const avatar = container.get<IAvatar>('IAvatar')
		avatar.goalPosition = this.#position.clone()

		await avatar.calculatePath()
	}

	#handlePointerOut() {
		this.#container.destroyHoverEffect()
	}

	get container(): TileContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}
}
