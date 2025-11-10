import WallDirection from './WallDirection'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'
import {
	Point3D,
	PolygonGraphics,
	type BoxFaces,
	type FaceKey
} from '@/core/utils'

const WALL_STYLES = {
	left: { surface: 0x8b7355, front: 0x6b5344, back: 0x5a4233 },
	right: { surface: 0xa0826d, front: 0x8b7355, back: 0x6b5344 }
} as const

export const createWallSide = (
	position: Point3D,
	direction: WallDirection,
	height: number,
	thickness: number,
	grid: number[][]
): BoxFaces => {
	const isLeft = direction === WallDirection.Left
	const coordinates = getWallCoordinates(isLeft, height, thickness)
	const styles = WALL_STYLES[isLeft ? 'left' : 'right']

	const isAtLeftBorder = position.x === 0 && position.y === grid.length
	const isAtRightBorder = position.y === 0 && position.x === grid.length - 1

	const faceConfig: Array<[FaceKey, number, number[], string[]]> = [
		['top', styles.surface, coordinates.surface, ['left', 'right']],
		[
			'left',
			styles.front,
			coordinates.front,
			[
				'top',
				'bottom',
				'right',
				...(isAtLeftBorder || isAtRightBorder ? ['left'] : [])
			]
		],
		[
			'right',
			styles.back,
			coordinates.back,
			[
				'top',
				'bottom',
				...(isAtLeftBorder ? ['left'] : []),
				...(isAtRightBorder ? ['right'] : [])
			]
		]
	]

	return new Map(
		faceConfig.map(([key, color, coords, borders]) => [
			key,
			new PolygonGraphics(
				color,
				coords,
				0x000000,
				1,
				Object.fromEntries(borders.map(border => [border, true]))
			)
		])
	) as BoxFaces
}

const getWallCoordinates = (
	isLeft: boolean,
	height: number,
	thickness: number
) => {
	const { width: tileWidth, height: tileHeight } = TILE_DIMENSIONS
	const heightPx = height * tileHeight

	const halfWidth = tileWidth / 2
	const halfHeight = tileHeight / 2
	const top = -heightPx
	const topAngled = top - halfHeight

	if (isLeft)
		return {
			surface: [
				0,
				halfHeight,
				0,
				top,
				halfWidth,
				topAngled,
				halfWidth,
				0
			],
			front: [
				0,
				halfHeight + thickness,
				-thickness,
				halfHeight + thickness - thickness / 2,
				-thickness,
				top - thickness / 2,
				0,
				top
			],
			back: [
				-thickness,
				top - thickness / 2,
				halfWidth,
				topAngled - thickness,
				halfWidth,
				topAngled,
				0,
				top
			]
		}

	return {
		surface: [
			halfWidth,
			0,
			halfWidth,
			topAngled,
			tileWidth,
			top,
			tileWidth,
			halfHeight
		],
		front: [
			tileWidth,
			halfHeight + thickness,
			tileWidth + thickness,
			halfHeight + thickness - thickness / 2,
			tileWidth + thickness,
			top - thickness / 2,
			tileWidth,
			top
		],
		back: [
			halfWidth,
			topAngled - thickness,
			tileWidth + thickness,
			top - thickness / 2,
			tileWidth,
			top,
			halfWidth,
			topAngled
		]
	}
}
