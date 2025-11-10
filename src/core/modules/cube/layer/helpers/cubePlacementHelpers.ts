import {
	Tile,
	Cube,
	Avatar,
	CubeCollection,
	calculateCubePosition
} from '@/core/modules'
import { cartesianToIsometric } from '@/core/utils/coordinates'

export const canMoveToTile = (
	cube: Cube,
	targetTile: Tile,
	avatar?: Avatar,
	cubeCollection?: CubeCollection
): boolean => {
	const isOccupiedByOriginOrAvatar =
		targetTile === cube.currentTile || targetTile === avatar?.currentTile

	if (isOccupiedByOriginOrAvatar) return false

	if (!cubeCollection) return true

	const tallestCube = cubeCollection.findTallestAt(targetTile.position)

	return !tallestCube || tallestCube.size <= cube.size
}

export const canPlaceCubeAtTile = (
	tile: Tile,
	cubeSize: number,
	avatar: Avatar | undefined,
	cubeCollection: CubeCollection
): boolean => {
	if (tile === avatar?.currentTile) return false

	const tallestCube = cubeCollection.findTallestAt(tile.position)

	return (
		!tallestCube ||
		tallestCube.position.z + tallestCube.size === tile.position.z ||
		cubeSize <= tallestCube.size
	)
}

export const placeCubeOnTile = (
	cube: Cube,
	targetTile: Tile,
	cubeCollection: CubeCollection
): void => {
	const tallestCubeAtTile = cubeCollection.findTallestAt(targetTile.position)
	const canPlace =
		!tallestCubeAtTile ||
		tallestCubeAtTile === cube ||
		cube.size >= tallestCubeAtTile.size

	if (!canPlace) return

	const tilePosition = cartesianToIsometric(targetTile.position)
	const newPosition = calculateCubePosition(
		tilePosition,
		cube.size,
		tallestCubeAtTile
	)

	cube.placeOnTile(targetTile, newPosition)
}
