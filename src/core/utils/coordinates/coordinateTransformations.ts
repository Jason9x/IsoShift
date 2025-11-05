import { Point3D } from '@/core/utils/coordinates'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

const HALF_WIDTH = TILE_DIMENSIONS.width / 2
const HALF_HEIGHT = TILE_DIMENSIONS.height / 2

export const cartesianToIsometric = (position: Point3D): Point3D =>
	new Point3D(
		(position.x - position.y) * HALF_WIDTH,
		(position.x + position.y) * HALF_HEIGHT,
		position.z * TILE_DIMENSIONS.height
	)

export const isometricToCartesian = (position: Point3D): Point3D => {
	const x = position.x / HALF_WIDTH
	const y = position.y / HALF_HEIGHT

	return new Point3D(
		(x + y) / 2,
		(y - x) / 2,
		position.z / TILE_DIMENSIONS.height
	)
}
