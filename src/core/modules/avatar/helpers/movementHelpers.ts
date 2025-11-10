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
	targetPosition: Point3D
): number => {
	const direction = targetPosition.subtract(avatar.position).normalize()
	const isStraight = direction.x === 0 || direction.y === 0
	const isMovingDown = targetPosition.z < avatar.position.z
	const heightDifference = avatar.position.z - targetPosition.z

	let speed = isStraight
		? AVATAR_MOVEMENT.STRAIGHT_SPEED
		: AVATAR_MOVEMENT.BASE_SPEED

	if (isMovingDown && heightDifference > TILE_DIMENSIONS.height) {
		const heightMultiplier = heightDifference / TILE_DIMENSIONS.height
		const accelerationMultiplier =
			1 + (AVATAR_MOVEMENT.DOWNWARD_ACCELERATION - 1) * heightMultiplier

		speed *= accelerationMultiplier
		speed = Math.min(speed, AVATAR_MOVEMENT.MAX_FALL_SPEED)
	}

	return speed
}
