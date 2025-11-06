import { AvatarMovementController } from './AvatarMovementController'

import { Tile, TileMap, CubeLayer, AvatarContainer } from '@/core/modules'

import {
	Point3D,
	cartesianToIsometric,
	findClosestValidTilePosition,
	createColorInput,
	calculateInitialAvatarPosition
} from '@/core/utils'

import { AVATAR_OFFSETS } from '@/core/modules/avatar/constants'

export default class Avatar {
	readonly #position: Point3D
	readonly #container: AvatarContainer
	readonly #movementController: AvatarMovementController

	#tileMap?: TileMap
	#currentTile?: Tile
	#cubeLayer?: CubeLayer

	constructor() {
		this.#position = new Point3D(0, 0, 0)

		const isometricPosition = cartesianToIsometric(this.#position)

		this.#container = new AvatarContainer(isometricPosition)
		this.#movementController = new AvatarMovementController(this)
	}

	initialize(tileMap: TileMap, cubeLayer: CubeLayer): void {
		this.#tileMap = tileMap
		this.#cubeLayer = cubeLayer

		this.#movementController.initialize()
		this.#setInitialPosition(tileMap)

		this.#container.faces.forEach(face =>
			face?.on('rightdown', () =>
				createColorInput(hexColor => face.draw(hexColor))
			)
		)
	}

	async moveTo(goal: Point3D): Promise<void> {
		await this.#movementController.moveTo(goal)
	}

	async update(delta: number): Promise<void> {
		await this.#movementController.update(delta)
	}

	updateAvatarPosition(position: Point3D): void {
		this.#position.copyFrom(position)
		this.#container.position.set(position.x, position.y - position.z)
	}

	#setInitialPosition(tileMap: TileMap): void {
		const initialAvatarPosition = calculateInitialAvatarPosition(tileMap)
		const tilePosition = initialAvatarPosition.subtract(AVATAR_OFFSETS)

		this.#position.copyFrom(initialAvatarPosition)

		if (!this.#tileMap) return

		this.#currentTile = this.#tileMap.findTileByExactPosition(tilePosition)

		if (this.#currentTile) {
			this.#updateAvatarPositionFromCurrentTile()
			return
		}

		const validPosition = findClosestValidTilePosition(
			tilePosition,
			this.#tileMap.grid
		)

		if (!validPosition) return

		const isometricPosition = cartesianToIsometric(validPosition)

		this.#currentTile =
			this.#tileMap.findTileByExactPosition(isometricPosition)

		this.#updateAvatarPositionFromCurrentTile()
	}

	#updateAvatarPositionFromCurrentTile(): void {
		if (!this.#currentTile) return

		const positionOnTile = this.#getPositionOnTile(
			this.#currentTile.position
		)

		this.updateAvatarPosition(positionOnTile)
	}

	#getPositionOnTile(tilePosition: Point3D): Point3D {
		const position = tilePosition.add(AVATAR_OFFSETS)

		if (!this.#cubeLayer) return position

		const tallestCube = this.#cubeLayer.findTallestCubeAt(tilePosition)

		if (tallestCube) position.z = tallestCube.position.z + tallestCube.size

		return position
	}

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

	set currentTile(value: Tile | undefined) {
		this.#currentTile = value
	}
}
