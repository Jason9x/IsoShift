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
	collection?: CubeCollection
): boolean => {
	if (targetTile === cube.currentTile || targetTile === avatar?.currentTile)
		return false

	if (!collection) return true

	const cubesAtPosition = collection.all.filter(
		existingCube =>
			existingCube !== cube &&
			existingCube.currentTile?.position.x === targetTile.position.x &&
			existingCube.currentTile?.position.y === targetTile.position.y
	)

	if (cubesAtPosition.length === 0) return true

	const tallestCube = cubesAtPosition.reduce<Cube | null>(
		(tallest, existingCube) => {
			if (!tallest) return existingCube
			
			const tallestTop = tallest.position.z + tallest.size
			const currentTop = existingCube.position.z + existingCube.size

			return currentTop > tallestTop ? existingCube : tallest
		},
		null
	)

	if (tallestCube && cube.size > tallestCube.size) return false

	return true
}

export const canPlaceCubeAtTile = (
	tile: Tile,
	cubeSize: number,
	avatar: Avatar | undefined,
	collection: CubeCollection
): boolean => {
	if (tile === avatar?.currentTile) return false

	const cubesAtPosition = collection.all.filter(
		cube =>
			cube.currentTile?.position.x === tile.position.x &&
			cube.currentTile?.position.y === tile.position.y
	)

	if (cubesAtPosition.length === 0) return true

	const tallestCube = cubesAtPosition.reduce<Cube | null>(
		(tallest, cube) => {
			if (!tallest) return cube

			const tallestTop = tallest.position.z + tallest.size
			const currentTop = cube.position.z + cube.size

			return currentTop > tallestTop ? cube : tallest
		},
		null
	)

	if (tallestCube && cubeSize > tallestCube.size) return false

	return true
}

export const placeCubeOnTile = (
	cube: Cube,
	targetTile: Tile,
	collection: CubeCollection
): void => {
	const cubesAtPosition = collection.all.filter(
		existingCube =>
			existingCube !== cube &&
			existingCube.currentTile?.position.x === targetTile.position.x &&
			existingCube.currentTile?.position.y === targetTile.position.y
	)

	const tallestCubeAtTile =
		cubesAtPosition.reduce<Cube | null>((tallest, existingCube) => {
			if (!tallest) return existingCube

			const tallestTop = tallest.position.z + tallest.size
			const currentTop = existingCube.position.z + existingCube.size

			return currentTop > tallestTop ? existingCube : tallest
		}, null) ?? null

	const tilePosition = cartesianToIsometric(targetTile.position)
	const newPosition = calculateCubePosition(
		tilePosition,
		cube.size,
		tallestCubeAtTile
	)

	cube.placeOnTile(targetTile, newPosition)
}
