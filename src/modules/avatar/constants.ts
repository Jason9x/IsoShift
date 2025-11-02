import { Point } from 'pixi.js'
import { Point3D } from '@/utils/coordinates'
import { TILE_DIMENSIONS } from '@/modules/tile/constants'

export const AVATAR_COLORS = {
	TOP_FACE: 0x9932cc, // DarkOrchid
	LEFT_FACE: 0x32cd32, // LimeGreen
	RIGHT_FACE: 0x00bfff, // DeepSkyBlue
}

export const AVATAR_DIMENSIONS = {
	WIDTH: 20,
	HEIGHT: 60,
}

export const AVATAR_OFFSETS: Point = new Point(
	TILE_DIMENSIONS.width / 2 - AVATAR_DIMENSIONS.WIDTH,
	TILE_DIMENSIONS.height / 2,
)

export const AVATAR_INITIAL_POSITION: Point3D = new Point3D(0, 0, 0)

export const AVATAR_SPEED: number = 1
