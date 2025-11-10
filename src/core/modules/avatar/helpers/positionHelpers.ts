import {
	TileMap,
	CubeLayer,
	Tile,
	Avatar,
	findClosestValidTilePosition,
	isValidTilePosition
} from '@/core/modules'

import { Point3D, cartesianToIsometric } from '@/core/utils'
import { AVATAR_OFFSETS, AVATAR_DIMENSIONS } from '../constants'

export const calculatePositionOnTile = (
	tilePosition: Point3D,
	cubeLayer?: CubeLayer
): Point3D => {
	const position = cartesianToIsometric(tilePosition).add(AVATAR_OFFSETS)
	const tallestCube = cubeLayer?.findTallestCubeAt(tilePosition)

	if (tallestCube) position.z = tallestCube.position.z + tallestCube.size

	return position
}

export const findInitialTilePosition = (
	tileMap: TileMap,
	cubeLayer: CubeLayer | undefined,
	door?: Point3D
): Point3D => {
	const doorPosition = door ?? new Point3D(0, 0, 0)
	const isDoorSuitable = isSuitableTile(doorPosition, tileMap, cubeLayer)

	if (isDoorSuitable) return doorPosition

	const closest = findClosestValidTilePosition(doorPosition, tileMap.grid)

	if (!closest) throw new Error('No valid avatar start position found')

	return findSuitableTilePosition(closest, tileMap, cubeLayer, doorPosition)
}

const isSuitableTile = (
	position: Point3D,
	tileMap: TileMap,
	cubeLayer?: CubeLayer
): boolean => {
	const isValidPosition = isValidTilePosition(position, tileMap)

	if (!isValidPosition) return false

	const cube = cubeLayer?.findTallestCubeAt(position)

	return !cube || cube.size >= AVATAR_DIMENSIONS.WIDTH
}

export const findSuitableTilePosition = (
	startPosition: Point3D,
	tileMap: TileMap,
	cubeLayer: CubeLayer | undefined,
	preferredPosition: Point3D
): Point3D => {
	const grid = tileMap.grid
	let closest: Point3D | null = null
	let minimumDistance = Infinity

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x]?.length; y++) {
			const z = grid[x][y]

			if (z < 0) continue

			const candidatePosition = new Point3D(x, y, z)
			const isCandidateSuitable = isSuitableTile(
				candidatePosition,
				tileMap,
				cubeLayer
			)

			if (!isCandidateSuitable) continue

			const distance = preferredPosition.distanceTo(candidatePosition)

			if (distance >= minimumDistance) continue

			closest = candidatePosition
			minimumDistance = distance
		}
	}

	return closest ?? startPosition
}

export const findTileForPosition = (
	tileMap: TileMap,
	position: Point3D
): Tile | undefined => {
	const tile = tileMap.findTileByExactPosition(position)

	if (tile) return tile

	const validPosition = findClosestValidTilePosition(position, tileMap.grid)

	return validPosition
		? tileMap.findTileByExactPosition(validPosition)
		: undefined
}

export const recalculateAvatarPosition = (
	avatar: Avatar,
	cubeLayer: CubeLayer,
	tileMap: TileMap,
	onPositionUpdated?: (avatar: Avatar) => void
): void => {
	const currentTile = avatar.currentTile
	if (!currentTile) return

	const doorPosition = currentTile.position
	const suitablePosition = findSuitableTilePosition(
		doorPosition,
		tileMap,
		cubeLayer,
		doorPosition
	)

	const targetTile = tileMap.findTileByExactPosition(suitablePosition)

	if (!targetTile) return

	const positionOnTile = calculatePositionOnTile(
		targetTile.position,
		cubeLayer
	)

	const hasTileChanged = targetTile !== currentTile

	if (hasTileChanged) avatar.currentTile = targetTile

	avatar.updatePosition(positionOnTile)
	onPositionUpdated?.(avatar)
}
