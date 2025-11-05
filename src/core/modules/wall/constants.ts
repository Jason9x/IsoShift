import type { WallDimensions, WallSideStyles, WallCoordinates } from './types'

import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

export const WALL_DIMENSIONS: WallDimensions = {
	height: 100,
	thickness: 6,
}

export const WALL_COORDINATES: WallCoordinates = {
	left: {
		surface: [
			0,
			TILE_DIMENSIONS.height / 2,
			0,
			-WALL_DIMENSIONS.height,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width / 2,
			0,
		],
		border: [
			0,
			TILE_DIMENSIONS.height / 2 + TILE_DIMENSIONS.thickness,
			-WALL_DIMENSIONS.thickness,
			TILE_DIMENSIONS.height / 2 +
				TILE_DIMENSIONS.thickness -
				WALL_DIMENSIONS.thickness / 2,
			-WALL_DIMENSIONS.thickness,
			-WALL_DIMENSIONS.height - WALL_DIMENSIONS.thickness / 2,
			0,
			-WALL_DIMENSIONS.height,
		],
		borderTop: [
			-WALL_DIMENSIONS.thickness,
			-WALL_DIMENSIONS.height - WALL_DIMENSIONS.thickness / 2,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height -
				TILE_DIMENSIONS.height / 2 -
				WALL_DIMENSIONS.thickness,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
			0,
			-WALL_DIMENSIONS.height,
		],
	},
	right: {
		surface: [
			TILE_DIMENSIONS.width / 2,
			0,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width,
			-WALL_DIMENSIONS.height,
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2,
		],
		border: [
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2 + TILE_DIMENSIONS.thickness,
			TILE_DIMENSIONS.width + WALL_DIMENSIONS.thickness,
			TILE_DIMENSIONS.height / 2 +
				TILE_DIMENSIONS.thickness -
				WALL_DIMENSIONS.thickness / 2,
			TILE_DIMENSIONS.width + WALL_DIMENSIONS.thickness,
			-WALL_DIMENSIONS.height - WALL_DIMENSIONS.thickness / 2,
			TILE_DIMENSIONS.width,
			-WALL_DIMENSIONS.height,
		],
		borderTop: [
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height -
				TILE_DIMENSIONS.height / 2 -
				WALL_DIMENSIONS.thickness,
			TILE_DIMENSIONS.width + WALL_DIMENSIONS.thickness,
			-WALL_DIMENSIONS.height - WALL_DIMENSIONS.thickness / 2,
			TILE_DIMENSIONS.width,
			-WALL_DIMENSIONS.height,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
		],
	},
}

export const WALL_SIDE_STYLES: WallSideStyles = {
	left: {
		surface: {
			fillColor: 0x9fa8da, // Soft lavender for a modern look
			borderColor: 0x5c6bc0, // Deeper indigo for definition
			borderWidth: 0,
		},
		border: {
			fillColor: 0x7986cb, // Medium lavender for subtle contrast
			borderColor: 0x3f51b5, // Rich indigo for depth
			borderWidth: 0,
		},
		borderTop: {
			fillColor: 0x5c6bc0, // Darker indigo for shadow effect
			borderColor: 0x3949ab, // Even darker indigo for borders
			borderWidth: 0,
		},
	},
	right: {
		surface: {
			fillColor: 0xb0bec5, // Light gray-blue for a clean look
			borderColor: 0x78909c, // Medium gray-blue for definition
			borderWidth: 0,
		},
		border: {
			fillColor: 0x90a4ae, // Medium gray-blue for contrast
			borderColor: 0x607d8b, // Darker gray-blue for depth
			borderWidth: 0,
		},
		borderTop: {
			fillColor: 0x78909c, // Darker gray-blue for shadow
			borderColor: 0x546e7a, // Even darker gray-blue for borders
			borderWidth: 0,
		},
	},
}
