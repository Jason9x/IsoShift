import {
	TileMap,
	Cube,
	findClosestValidTilePosition,
	isValidTilePosition,
	calculateCubePosition
} from '@/core/modules'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'
import { Point3D, cartesianToIsometric } from '@/core/utils/coordinates'

export class CubeManager {
	readonly #tileMap?: TileMap
	readonly #findTallestCubeAt: (position: Point3D) => Cube | null

	constructor(
		tileMap: TileMap | undefined,
		findTallestCubeAt: (position: Point3D) => Cube | null
	) {
		this.#tileMap = tileMap
		this.#findTallestCubeAt = findTallestCubeAt
	}

	createCubeAtPosition(
		position: Point3D,
		size: number,
		flipped: boolean = false
	): Cube | null {
		const validSize = Math.max(8, Math.min(size, TILE_DIMENSIONS.height))
		const tilePosition = cartesianToIsometric(position)
		const currentTile = this.#tileMap?.findTileByExactPosition(position)

		if (!currentTile) return null

		const tallestCubeAtTile = this.#findTallestCubeAt(position)
		const finalPosition = calculateCubePosition(
			tilePosition,
			validSize,
			tallestCubeAtTile
		)

		return new Cube(finalPosition, validSize, currentTile, flipped)
	}

	getValidTilePosition(position: Point3D): Point3D | null {
		if (!this.#tileMap) return null

		return isValidTilePosition(position, this.#tileMap)
			? position
			: findClosestValidTilePosition(position, this.#tileMap.grid)
	}
}
