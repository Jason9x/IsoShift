import { FederatedPointerEvent, Point } from 'pixi.js'

import type { Cube, Avatar } from '@/core/modules'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

import { Point3D } from '@/core/utils/coordinates'

const calculateCubeOffsets = (size: number): Point => {
	const horizontalOffset = size - TILE_DIMENSIONS.width / 2
	const verticalOffset = size - TILE_DIMENSIONS.height / 2

	return new Point(horizontalOffset, verticalOffset)
}

export const calculateCubePosition = (
	tilePosition: Point3D,
	cubeSize: number,
	tallestCube: Cube | null
): Point3D => {
	const offsets = calculateCubeOffsets(cubeSize)
	const position = tilePosition.subtract(offsets)

	position.z = tallestCube
		? tallestCube.position.z + tallestCube.size
		: position.z

	return position
}

export const createMockPointerEvent = (
	globalPosition: Point
): FederatedPointerEvent =>
	({
		pointerId: 0,
		width: 1,
		height: 1,
		isPrimary: true,
		pressure: 0.5,
		button: 0,
		buttons: 0,
		clientX: globalPosition.x,
		clientY: globalPosition.y
	}) as FederatedPointerEvent

export const sortByPosition = (
	firstEntity: Cube | Avatar,
	secondEntity: Cube | Avatar
): number => {
	const firstSortPosition = getSortPosition(firstEntity)
	const secondSortPosition = getSortPosition(secondEntity)

	const positionComparison = compareByPosition(
		firstSortPosition,
		secondSortPosition
	)

	if (positionComparison !== 0) return positionComparison

	return firstEntity.position.z - secondEntity.position.z
}

const compareByPosition = (
	firstPosition: Point3D,
	secondPosition: Point3D
): number => {
	if (firstPosition.y !== secondPosition.y)
		return firstPosition.y - secondPosition.y

	return firstPosition.x - secondPosition.x
}

const getSortPosition = (entity: Cube | Avatar): Point3D => {
	const tile = entity.currentTile

	if (!tile) return new Point3D(0, 0, -Infinity)

	const { x, y, z } = tile.position
	return new Point3D(x, y, z)
}
