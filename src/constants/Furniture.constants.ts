import { BLEND_MODES, Point } from 'pixi.js'

import { TILE_DIMENSIONS } from './Tile.constants'

export const BLEND_MODES_MAP: { [key: string]: BLEND_MODES } = {
	ADD: BLEND_MODES.ADD,
	MULTIPLY: BLEND_MODES.MULTIPLY,
	SCREEN: BLEND_MODES.SCREEN,
}

export const FURNITURE_OFFSETS = new Point(
	TILE_DIMENSIONS.width / 2,
	TILE_DIMENSIONS.height / 2,
)
