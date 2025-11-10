import { Ticker, FederatedPointerEvent } from 'pixi.js'

import { AvatarMovementController } from './AvatarMovementController'

import {
	findInitialTilePosition,
	findTileForPosition,
	calculatePositionOnTile
} from './helpers'

import { AvatarContainer, Tile, TileMap, CubeLayer } from '@/core/modules'
import { Point3D, cartesianToIsometric, type FaceKey } from '@/core/utils'

export default class Avatar {
	readonly #position: Point3D
	readonly #container: AvatarContainer
	readonly #movementController: AvatarMovementController

	#tileMap?: TileMap
	#currentTile?: Tile
	#cubeLayer?: CubeLayer

	constructor(colors?: { top?: number; left?: number; right?: number }) {
		this.#position = new Point3D(0, 0, 0)
		this.#container = new AvatarContainer(
			cartesianToIsometric(this.#position),
			colors
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
		this.#container.faces.forEach((face, key) => {
			if (!face) return

			face.on('rightdown', (event: FederatedPointerEvent) =>
				this.#handleFaceRightClick(key, event.global)
			)
		})

	async #handleFaceRightClick(
		face: FaceKey,
		globalPosition: { x: number; y: number }
	): Promise<void> {
		const { colorMenuState } = await import('@/ui/store/colorMenu')
		const { setAvatarColor } = await import('@/ui/store/colors')

		colorMenuState.value = {
			x: globalPosition.x,
			y: globalPosition.y,
			type: 'avatar',
			entityId: 'avatar',
			faceKey: face,
			onColorChange: (color: number) => {
				setAvatarColor(face, color)

				this.#container.applyFaceColor(face, color)
			}
		}
	}

	applyFaceColor = (face: FaceKey, color: number): void =>
		this.#container.applyFaceColor(face, color)

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
