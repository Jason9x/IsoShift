import { PolygonGraphics, type BoxFaces, type FaceKey } from '@/core/utils'

import { TILE_DIMENSIONS, TILE_STYLES } from '../constants'
import { tileBorderPresets } from './borderPresets'

type TileCoordinates = {
	surface: number[]
	leftBorder: number[]
	rightBorder: number[]
}

export type FaceInitOptions = {
	hasLeftBorder: boolean
	hasRightBorder: boolean
	isAtFirstColumn: boolean
	isAtFirstRow: boolean
}

export const getTileCoordinates = (thickness: number): TileCoordinates => {
	const { width, height } = TILE_DIMENSIONS

	return {
		surface: [
			width / 2,
			0,
			width,
			height / 2,
			width / 2,
			height,
			0,
			height / 2
		],
		leftBorder: [
			0,
			height / 2,
			width / 2,
			height,
			width / 2,
			height + thickness,
			0,
			height / 2 + thickness
		],
		rightBorder: [
			width,
			height / 2,
			width / 2,
			height,
			width / 2,
			height + thickness,
			width,
			height / 2 + thickness
		]
	}
}

export const createTileFaces = (
	options: FaceInitOptions,
	coordinates: TileCoordinates,
	colors?: { surface?: number; leftBorder?: number; rightBorder?: number }
): BoxFaces => {
	const { hasLeftBorder, hasRightBorder, isAtFirstColumn, isAtFirstRow } =
		options

	const faceConfig: Array<
		[
			FaceKey,
			typeof TILE_STYLES.surface,
			number[],
			ReturnType<typeof tileBorderPresets.surface>,
			boolean,
			number | undefined
		]
	> = [
		[
			'top',
			TILE_STYLES.surface,
			coordinates.surface,
			tileBorderPresets.surface(
				isAtFirstRow,
				isAtFirstColumn,
				hasLeftBorder,
				hasRightBorder
			),
			true,
			colors?.surface
		],
		[
			'left',
			TILE_STYLES.leftBorder,
			coordinates.leftBorder,
			tileBorderPresets.border(),
			hasLeftBorder,
			colors?.leftBorder
		],
		[
			'right',
			TILE_STYLES.rightBorder,
			coordinates.rightBorder,
			tileBorderPresets.border(),
			hasRightBorder,
			colors?.rightBorder
		]
	]

	return new Map(
		faceConfig.map(([key, style, coords, borders, shouldCreate, color]) => [
			key,
			shouldCreate
				? new PolygonGraphics(
						color ?? style.fillColor,
						coords,
						style.borderColor,
						style.borderWidth,
						borders
					)
				: null
		])
	) as BoxFaces
}
