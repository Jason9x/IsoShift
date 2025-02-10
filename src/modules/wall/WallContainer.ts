import { Container } from 'pixi.js'
import container from '@/inversify.config'

import WallDirection from '@/modules/wall/WallDirection'

import PolygonGraphics from '@/shared/PolygonGraphics'

import { BoxFaces } from '@/types/BoxFaces.types'

import { WALL_DIMENSIONS, WALL_SIDE_STYLES } from '@/constants/Wall.constants'
import { TILE_DIMENSIONS } from '@/constants/Tile.constants'

import { isometricToCartesian } from '@/utils/coordinates/coordinateTransformations'
import Point3D from '@/utils/coordinates/Point3D'

export default class WallContainer extends Container {
	readonly #sides: BoxFaces[]

	constructor(position: Point3D, direction: WallDirection) {
		super()

		this.position.copyFrom(position)
		this.#sides = this.#createSides(position, direction)

		this.#sides.forEach(side =>
			side.forEach(face => face && this.addChild(face)),
		)
	}

	#createSides(position: Point3D, direction: WallDirection): BoxFaces[] {
		const sides: BoxFaces[] = []
		const directions = [WallDirection.Left, WallDirection.Right]

		directions.forEach(_direction =>
			direction === _direction
				? sides.push(this.#createSide(position, _direction))
				: null,
		)

		return sides
	}

	#createSide(position: Point3D, direction: WallDirection): BoxFaces {
		const wallStyles =
			direction === WallDirection.Left
				? WALL_SIDE_STYLES.left
				: WALL_SIDE_STYLES.right

		const surfacePoints =
			direction === WallDirection.Left
				? this.#leftSurfacePoints
				: this.#rightSurfacePoints

		const borderPoints =
			direction === WallDirection.Left
				? this.#leftBorderPoints
				: this.#rightBorderPoints

		const borderTopPoints =
			direction === WallDirection.Left
				? this.#topLeftBorderPoints
				: this.#topRightBorderPoints

		const cartesianPosition = isometricToCartesian(position)
		const grid = container.get<number[][]>('Grid')

		const isAtLeftBorder =
			cartesianPosition.x === 0 && cartesianPosition.y === grid.length
		const isAtRightBorder =
			cartesianPosition.y === 0 && cartesianPosition.x === grid.length - 1
		const isAtBorders = isAtLeftBorder || isAtRightBorder

		return new Map([
			[
				'top',
				new PolygonGraphics(
					wallStyles.surface.fillColor,
					surfacePoints,
					wallStyles.surface.borderColor,
					wallStyles.surface.borderWidth,
					{ left: true, right: true },
				),
			],
			[
				'left',
				new PolygonGraphics(
					wallStyles.border.fillColor,
					borderPoints,
					wallStyles.border.borderColor,
					wallStyles.border.borderWidth,
					{
						top: true,
						bottom: true,
						left: isAtBorders,
						right: true,
					},
				),
			],
			[
				'right',
				new PolygonGraphics(
					wallStyles.borderTop.fillColor,
					borderTopPoints,
					wallStyles.borderTop.borderColor,
					wallStyles.borderTop.borderWidth,
					{
						top: true,
						bottom: true,
						left: isAtLeftBorder,
						right: isAtRightBorder,
					},
				),
			],
		])
	}

	get #leftSurfacePoints(): number[] {
		return [
			0,
			TILE_DIMENSIONS.height / 2,
			0,
			-WALL_DIMENSIONS.height,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width / 2,
			0,
		]
	}

	get #leftBorderPoints(): number[] {
		return [
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
		]
	}

	get #topLeftBorderPoints(): number[] {
		return [
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
		]
	}

	get #rightSurfacePoints(): number[] {
		return [
			TILE_DIMENSIONS.width / 2,
			0,
			TILE_DIMENSIONS.width / 2,
			-WALL_DIMENSIONS.height - TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width,
			-WALL_DIMENSIONS.height,
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2,
		]
	}

	get #rightBorderPoints(): number[] {
		return [
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
		]
	}

	get #topRightBorderPoints(): number[] {
		return [
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
		]
	}

	get sides(): BoxFaces[] {
		return this.#sides
	}
}
