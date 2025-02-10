import { WallDimensions, WallSideStyles } from '@/types/Wall.types'

export const WALL_DIMENSIONS: WallDimensions = {
	height: 100,
	thickness: 6,
}

export const WALL_SIDE_STYLES: WallSideStyles = {
	left: {
		surface: {
			fillColor: 0xa5a8b6,
			borderColor: 0x2b2b1d,
			borderWidth: 2,
		},
		border: {
			fillColor: 0xa5a8b6,
			borderColor: 0x2b2b1d,
			borderWidth: 1,
		},
		borderTop: {
			fillColor: 0x5b5d67,
			borderColor: 0x2b2b1d,
			borderWidth: 1,
		},
	},
	right: {
		surface: {
			fillColor: 0xb4b7c5,
			borderColor: 0x2b2b1d,
			borderWidth: 1,
		},
		border: {
			fillColor: 0x6c6e78,
			borderColor: 0x2b2b1d,
			borderWidth: 1,
		},
		borderTop: {
			fillColor: 0x5c5e67,
			borderColor: 0x2b2b1d,
			borderWidth: 1,
		},
	},
}
