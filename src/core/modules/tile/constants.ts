import type { TileDimensions, TileStyles } from './types'

export const TILE_DIMENSIONS: TileDimensions = {
	width: 64,
	height: 32
}

export const TILE_STYLES: TileStyles = {
	surface: {
		fillColor: 0xd2b48c, // Warm sand color for base
		borderColor: 0xa0522d, // Rich terracotta for definition
		borderWidth: 0
	},
	leftBorder: {
		fillColor: 0x8b4513, // Deep chocolate brown for shadow
		borderColor: 0x654321, // Darker brown for depth
		borderWidth: 0
	},
	rightBorder: {
		fillColor: 0xcd853f, // Earthy orange-brown for highlights
		borderColor: 0xa0522d, // Matching terracotta
		borderWidth: 0
	}
}
