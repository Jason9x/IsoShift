import { TileDimensions, TileStyles } from '@/types/Tile.types'

export const TILE_DIMENSIONS: TileDimensions = {
	width: 64,
	height: 32,
	thickness: 6,
}

export const TILE_STYLES: TileStyles = {
	surface: {
		fillColor: 0xd2b48c, // Warm sand color for base
		borderColor: 0xa0522d, // Rich terracotta for definition
		borderWidth: 0,
	},
	leftBorder: {
		fillColor: 0x8b4513, // Deep chocolate brown for shadow
		borderColor: 0x654321, // Darker brown for depth
		borderWidth: 0,
	},
	rightBorder: {
		fillColor: 0xcd853f, // Earthy orange-brown for highlights
		borderColor: 0xa0522d, // Matching terracotta
		borderWidth: 0,
	},
}

export const TILE_SURFACE_POINTS: number[] = [
	TILE_DIMENSIONS.width / 2,
	0,
	TILE_DIMENSIONS.width,
	TILE_DIMENSIONS.height / 2,
	TILE_DIMENSIONS.width / 2,
	TILE_DIMENSIONS.height,
	0,
	TILE_DIMENSIONS.height / 2,
]

export const TILE_GRID: number[][] = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
]
