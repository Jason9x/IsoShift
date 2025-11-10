import { Point } from 'pixi.js'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

export const AVATAR_COLORS = {
	TOP_FACE: 0x9932cc, // DarkOrchid
	LEFT_FACE: 0x32cd32, // LimeGreen
	RIGHT_FACE: 0x00bfff // DeepSkyBlue
}

export const AVATAR_DIMENSIONS = {
	WIDTH: 20,
	HEIGHT: 60
}

export const AVATAR_OFFSETS: Point = new Point(
	TILE_DIMENSIONS.width / 2 - AVATAR_DIMENSIONS.WIDTH,
	TILE_DIMENSIONS.height / 2
)

export const AVATAR_MOVEMENT = {
	GRAVITY: 2.5,
	BASE_SPEED: 1.0,
	STRAIGHT_SPEED: 1.2,
	MAX_FALL_SPEED: 3.0,
	DOWNWARD_ACCELERATION: 1.5
}
