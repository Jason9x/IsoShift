import { Point3D, cartesianToIsometric } from '@/core/utils/coordinates'
import {
	findClosestValidTilePosition,
	isValidTilePosition,
} from '@/core/utils/helpers'
import {
	AVATAR_INITIAL_POSITION,
	AVATAR_OFFSETS,
} from '@/core/modules/avatar/constants'
import { TileMap } from '@/core/modules'

const calculateInitialAvatarPosition = (
	tileMap: TileMap,
	grid: number[][],
): Point3D => {
	let initialPosition: Point3D = AVATAR_INITIAL_POSITION.clone()

	if (!isValidTilePosition(initialPosition, tileMap)) {
		const closest = findClosestValidTilePosition(initialPosition, grid)

		if (!closest) throw new Error('No valid avatar start position found')

		initialPosition = closest
	}

	return cartesianToIsometric(initialPosition).add(AVATAR_OFFSETS)
}

export default calculateInitialAvatarPosition
