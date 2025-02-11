import { WallDimensions, WallSideStyles } from '@/types/Wall.types'

export const WALL_DIMENSIONS: WallDimensions = {
	height: 100,
	thickness: 6
}

export const WALL_SIDE_STYLES: WallSideStyles = {
	left: {
		surface: {
			fillColor: 0x9fa8da, // Soft lavender for a modern look
			borderColor: 0x5c6bc0, // Deeper indigo for definition
			borderWidth: 0
		},
		border: {
			fillColor: 0x7986cb, // Medium lavender for subtle contrast
			borderColor: 0x3f51b5, // Rich indigo for depth
			borderWidth: 0
		},
		borderTop: {
			fillColor: 0x5c6bc0, // Darker indigo for shadow effect
			borderColor: 0x3949ab, // Even darker indigo for borders
			borderWidth: 0
		}
	},
	right: {
		surface: {
			fillColor: 0xb0bec5, // Light gray-blue for a clean look
			borderColor: 0x78909c, // Medium gray-blue for definition
			borderWidth: 0
		},
		border: {
			fillColor: 0x90a4ae, // Medium gray-blue for contrast
			borderColor: 0x607d8b, // Darker gray-blue for depth
			borderWidth: 0
		},
		borderTop: {
			fillColor: 0x78909c, // Darker gray-blue for shadow
			borderColor: 0x546e7a, // Even darker gray-blue for borders
			borderWidth: 0
		}
	}
}
