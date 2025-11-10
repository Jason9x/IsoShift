import type Avatar from '../Avatar'
import { AVATAR_OFFSETS, AVATAR_MOVEMENT } from '../constants'

import { Point3D, cartesianToIsometric } from '@/core/utils'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

export const calculateTargetPosition = (
	avatar: Avatar,
	position: Point3D
): Point3D => {
	const target = cartesianToIsometric(position).add(AVATAR_OFFSETS)
	const tallestCube = avatar.cubeLayer?.findTallestCubeAt(position)

	if (tallestCube) target.z = tallestCube.position.z + tallestCube.size

	return target
}

export const calculateSpeed = (
	avatar: Avatar,
	targetPosition: Point3D,
	isMovingDown: boolean
): number => {
	const direction = targetPosition.subtract(avatar.position).normalize()
	const isStraight = direction.x === 0 || direction.y === 0

	let speed = isStraight
		? AVATAR_MOVEMENT.STRAIGHT_SPEED
		: AVATAR_MOVEMENT.BASE_SPEED

	if (isMovingDown && isOnTallStack(avatar))
		speed *= AVATAR_MOVEMENT.DOWNWARD_ACCELERATION

	return speed
}

export const isOnTallStack = (avatar: Avatar): boolean => {
	const { currentTile, cubeLayer } = avatar

	if (!currentTile || !cubeLayer) return false

	const tallestCube = cubeLayer.findTallestCubeAt(currentTile.position)

	if (!tallestCube) return false

	const tileBaseZ = currentTile.position.z * TILE_DIMENSIONS.height
	const stackTop = tallestCube.position.z + tallestCube.size

	return (
		tallestCube.position.z > tileBaseZ &&
		stackTop > tileBaseZ + TILE_DIMENSIONS.height
	)
}
