import Point3D from '@/utils/coordinates/Point3D'

import {
	isValidTilePosition,
	findClosestValidTilePosition,
} from '@/utils/helpers/tilePositionHelpers'

import { cartesianToIsometric } from '@/utils/coordinates/coordinateTransformations'

import {
	AVATAR_INITIAL_POSITION,
	AVATAR_OFFSETS,
} from '@/constants/Avatar.constants'

const calculateInitialAvatarPosition = () => {
	let initialPosition: Point3D | null = AVATAR_INITIAL_POSITION

	if (!isValidTilePosition(initialPosition))
		initialPosition = findClosestValidTilePosition(initialPosition)

	if (!initialPosition) return

	return cartesianToIsometric(initialPosition).add(AVATAR_OFFSETS)
}

export default calculateInitialAvatarPosition
