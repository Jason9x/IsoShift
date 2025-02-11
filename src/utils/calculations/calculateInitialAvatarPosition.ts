import Point3D from '@/utils/coordinates/Point3D'

import { findClosestValidTilePosition, isValidTilePosition } from '@/utils/helpers/tilePositionHelpers'

import { cartesianToIsometric } from '@/utils/coordinates/coordinateTransformations'

import { AVATAR_INITIAL_POSITION, AVATAR_OFFSETS } from '@/constants/Avatar.constants'

const calculateInitialAvatarPosition = (): Point3D => {
	let initialPosition: Point3D = AVATAR_INITIAL_POSITION.clone()

	if (!isValidTilePosition(initialPosition)) {
		const closest = findClosestValidTilePosition(initialPosition)

		if (!closest) throw new Error('No valid avatar start position found')

		initialPosition = closest
	}

	return cartesianToIsometric(initialPosition).add(AVATAR_OFFSETS)
}

export default calculateInitialAvatarPosition
