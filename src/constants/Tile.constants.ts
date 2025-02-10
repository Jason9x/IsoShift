import { TileDimensions, TileStyles } from '@/types/Tile.types'

export const TILE_DIMENSIONS: TileDimensions = {
	width: 64,
	height: 32,
	thickness: 6,
}

export const TILE_STYLES: TileStyles = {
	surface: {
		fillColor: 0x979764,
		borderColor: 0x909060,
		borderWidth: 1,
	},
	leftBorder: {
		fillColor: 0x979764,
		borderColor: 0x2b2b1d,
		borderWidth: 1,
	},
	rightBorder: {
		fillColor: 0x646442,
		borderColor: 0x2b2b1d,
		borderWidth: 1,
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
