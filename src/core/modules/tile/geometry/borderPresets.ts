import type { Sides } from '@/core/utils/graphics/types'

export const tileBorderPresets = {
	surface: (
		isAtFirstRow: boolean,
		isAtFirstColumn: boolean,
		hasLeftBorder: boolean,
		hasRightBorder: boolean
	): Sides => ({
		top: !isAtFirstRow,
		bottom: false,
		left: !isAtFirstColumn && hasLeftBorder,
		right: hasRightBorder
	}),

	border: (): Sides => ({
		top: true,
		bottom: true
	})
}
