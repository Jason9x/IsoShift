import type { Sides } from './types'

export const borderPresets = {
	tileSurface: (
		isAtFirstRow: boolean,
		isAtFirstColumn: boolean,
		hasLeftBorder: boolean,
		hasRightBorder: boolean
	): Sides => ({
		top: !isAtFirstRow,
		bottom: false,
		left: !isAtFirstColumn && hasLeftBorder,
		right: hasRightBorder,
	}),

	tileBorder: (): Sides => ({
		top: true,
		bottom: true,
	}),

	wallSurface: (): Sides => ({
		left: true,
		right: true,
	}),

	wallBorder: (isAtLeftBorder: boolean, isAtRightBorder: boolean): Sides => ({
		top: true,
		bottom: true,
		left: isAtLeftBorder || isAtRightBorder,
		right: true,
	}),

	wallBorderTop: (
		isAtLeftBorder: boolean,
		isAtRightBorder: boolean
	): Sides => ({
		top: true,
		bottom: true,
		left: isAtLeftBorder,
		right: isAtRightBorder,
	}),
}
