import Point3D from '@/utils/coordinates/Point3D'

import { TILE_DIMENSIONS } from '@/constants/Tile.constants'

export const cartesianToIsometric = (position: Point3D) =>
	new Point3D(
		(position.x - position.y) * (TILE_DIMENSIONS.width / 2),
		(position.x + position.y) * (TILE_DIMENSIONS.height / 2),
		position.z * TILE_DIMENSIONS.height
	)

export const isometricToCartesian = (position: Point3D) => new Point3D(
	(position.x / (TILE_DIMENSIONS.width / 2) +
		position.y / (TILE_DIMENSIONS.height / 2)) /
	2,
	(position.y / (TILE_DIMENSIONS.height / 2) -
		position.x / (TILE_DIMENSIONS.width / 2)) /
	2,
	position.z / TILE_DIMENSIONS.height
)
