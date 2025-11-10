import { Ticker } from 'pixi.js'

import { AvatarMovementController } from './AvatarMovementController'

import {
	findInitialTilePosition,
	findTileForPosition,
	calculatePositionOnTile
} from './helpers'

import { AvatarContainer, Tile, TileMap, CubeLayer } from '@/core/modules'
import { Point3D, cartesianToIsometric, createColorInput } from '@/core/utils'

export default class Avatar {
	readonly #position: Point3D
	readonly #container: AvatarContainer
	readonly #movementController: AvatarMovementController

	#tileMap?: TileMap
	#currentTile?: Tile
	#cubeLayer?: CubeLayer

	constructor() {
		this.#position = new Point3D(0, 0, 0)
		this.#container = new AvatarContainer(
			cartesianToIsometric(this.#position)
		)
		this.#movementController = new AvatarMovementController(this)
	}

	initialize(
		tileMap: TileMap,
		cubeLayer: CubeLayer,
		doorPosition?: Point3D
	): void {
		this.#tileMap = tileMap
		this.#cubeLayer = cubeLayer

		this.#setInitialPosition(doorPosition)
		this.#setupEventListeners()
		this.#startTicker()
		this.#container.on('removed', this.#stopTicker, this)
	}

	moveTo = async (goal: Point3D): Promise<void> =>
		await this.#movementController.moveTo(goal)

	update = async (delta: number): Promise<void> =>
		await this.#movementController.update(delta)

	updatePosition(position: Point3D): void {
		this.#position.copyFrom(position)
		this.#container.position.set(position.x, position.y - position.z)
	}

	#setInitialPosition(doorPosition?: Point3D): void {
		if (!this.#tileMap) return

		const tilePosition = findInitialTilePosition(
			this.#tileMap,
			this.#cubeLayer,
			doorPosition
		)

		const tile = findTileForPosition(this.#tileMap, tilePosition)

		if (tile) {
			this.#currentTile = tile
			this.#updatePositionFromCurrentTile()
		}
	}

	#updatePositionFromCurrentTile(): void {
		if (!this.#currentTile) return

		const position = calculatePositionOnTile(
			this.#currentTile.position,
			this.#cubeLayer
		)
		this.updatePosition(position)
	}

	#setupEventListeners = (): void =>
		this.#container.faces.forEach(face =>
			face?.on('rightdown', () =>
				createColorInput(hexColor => face.draw(hexColor))
			)
		)

	#startTicker = () =>
		Ticker.shared.add(
			(ticker: Ticker) => this.update(ticker.deltaTime),
			this
		)

	#stopTicker = () =>
		Ticker.shared.remove(
			(ticker: Ticker) => this.update(ticker.deltaTime),
			this
		)

	get position(): Point3D {
		return this.#position
	}

	get tileMap(): TileMap | undefined {
		return this.#tileMap
	}

	get cubeLayer(): CubeLayer | undefined {
		return this.#cubeLayer
	}

	get container(): AvatarContainer {
		return this.#container
	}

	get currentTile(): Tile | undefined {
		return this.#currentTile
	}

	set currentTile(value: Tile) {
		if (this.#currentTile === value) return

		this.#currentTile = value

		if (value) this.#updatePositionFromCurrentTile()
	}
}
