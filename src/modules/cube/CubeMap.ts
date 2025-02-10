import { Point } from 'pixi.js'

import Cube from '@/modules/cube/Cube'
import Tile from '@/modules/tile/Tile'

import Point3D from '@/utils/coordinates/Point3D'

import {
	cartesianToIsometric,
	isometricToCartesian,
} from '@/utils/coordinates/coordinateTransformations'
import {
	findClosestValidTilePosition,
	isValidTilePosition,
} from '@/utils/helpers/tilePositionHelpers'

import { CUBE_SETTINGS } from '@/constants/Cube.constants'
import { TILE_DIMENSIONS } from '@/constants/Tile.constants'
import ICubeMap from '@/interfaces/modules/ICubeMap'

import ITileMap from '@/interfaces/modules/ITileMap'
import { inject } from 'inversify'
import IAvatar from '@/interfaces/modules/IAvatar'
import calculateCubeOffsets from '@/utils/calculations/calculateCubeOffsets'

export default class CubeMap implements ICubeMap {
	readonly #tileMap: ITileMap
	readonly #avatar: IAvatar
	readonly #cubes: Cube[]

	constructor(
		@inject('ITileMap') tileMap: ITileMap,
		@inject('IAvatar') avatar: IAvatar,
	) {
		this.#tileMap = tileMap
		this.#avatar = avatar
		this.#cubes = []
	}

	populateSceneWithCubes = (): void =>
		CUBE_SETTINGS.forEach(({ position, size }) => {
			let validPosition = this.#getValidTilePosition(position)
			if (!validPosition) return

			const validSize = this.#getValidSize(size)
			let tilePosition = cartesianToIsometric(validPosition)

			let currentTile =
				this.#tileMap.findTileByExactPosition(tilePosition)
			if (!currentTile) return
			let tallestCubeAtTile = this.findTallestCubeAt(currentTile.position)
			const isCubeNarrower =
				tallestCubeAtTile && tallestCubeAtTile.size < validSize

			if (isCubeNarrower) {
				const data = this.#getClosestValidTileData(validPosition)
				if (!data) return
				;({
					tilePosition,
					currentTile,
					tallestCubeAtTile,
				} = data)
			}

			const cubeOffsets = calculateCubeOffsets(validSize)
			const finalPosition = this.#getFinalCubePosition(
				tilePosition,
				cubeOffsets,
				tallestCubeAtTile,
			)
			if (!currentTile) return
			const cube = new Cube(finalPosition, validSize, currentTile)
			this.#addCube(cube)
		})

	findTallestCubeAt = (position: Point3D): Cube | null =>
		this.#cubes.reduce((currentTallest: Cube | null, cube: Cube) => {
			const isAtPosition = cube.currentTile?.position.equals(position)
			const isTaller =
				cube.position.z > (currentTallest?.position.z ?? -Infinity)

			return isAtPosition && isTaller ? cube : currentTallest
		}, null)

	sortCubesByPosition(): void {
		this.#cubes.sort(this.#sortCubesByPosition)
		this.#cubes.forEach((cube, index) => (cube.graphics.zIndex = index))

		this.#avatar.container?.sortChildren()
	}

	adjustCubeRenderingOrder(): void {
		if (!this.#avatar.currentTile) return

		const avatarTilePosition = isometricToCartesian(
			this.#avatar.currentTile.position,
		)

		this.#cubes.forEach(cube => {
			if (!cube.currentTile) return

			const cubeTilePosition = isometricToCartesian(
				cube.currentTile.position,
			)

			if (!cubeTilePosition || !avatarTilePosition) return

			const isCubeAtAvatarPosition =
				cubeTilePosition.equals(avatarTilePosition)
			const isCubeInFrontOfAvatar =
				cubeTilePosition.x >= avatarTilePosition.x &&
				cubeTilePosition.y >= avatarTilePosition.y

			cube.graphics.zIndex = isCubeAtAvatarPosition
				? -1
				: isCubeInFrontOfAvatar
					? 1
					: -1
		})

		this.#avatar.container?.sortChildren()
	}

	#getValidTilePosition = (position: Point3D): Point3D | null =>
		isValidTilePosition(position)
			? position
			: findClosestValidTilePosition(position)

	#getValidSize = (size: number): number =>
		Math.max(8, Math.min(size, TILE_DIMENSIONS.height))

	#getClosestValidTileData(position: Point3D):
		| {
				validPosition: Point3D
				tilePosition: Point3D
				currentTile: Tile | undefined
				tallestCubeAtTile: Cube | null
		  }
		| undefined {
		const validPosition = findClosestValidTilePosition(position)

		if (!validPosition) return

		const tilePosition = cartesianToIsometric(validPosition)
		const currentTile = this.#tileMap.findTileByExactPosition(tilePosition)
		const tallestCubeAtTile = this.findTallestCubeAt(tilePosition)

		return { validPosition, tilePosition, currentTile, tallestCubeAtTile }
	}

	#getFinalCubePosition(
		tilePosition: Point3D,
		cubeOffsets: Point,
		tallestCubeAtTile: Cube | null,
	): Point3D {
		const finalPosition = tilePosition.subtract(cubeOffsets)

		finalPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: finalPosition.z

		return finalPosition
	}

	#addCube(cube: Cube): void {
		this.#cubes.push(cube)
	}

	#sortCubesByPosition = (cubeA: Cube, cubeB: Cube): number => {
		const { currentTile: currentTileA, position: positionA } = cubeA
		const { currentTile: currentTileB, position: positionB } = cubeB

		if (!currentTileA || !currentTileB) return 0

		const { position: tilePositionA } = currentTileA
		const { position: tilePositionB } = currentTileB

		const { z: zCoordinateA } = positionA
		const { z: zCoordinateB } = positionB

		if (zCoordinateA !== zCoordinateB) return zCoordinateA - zCoordinateB

		if (tilePositionA.y !== tilePositionB.y)
			return tilePositionA.y - tilePositionB.y

		return tilePositionA.x - tilePositionB.x
	}

	get cubes(): Cube[] {
		return this.#cubes
	}
}
