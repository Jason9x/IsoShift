import { Container } from 'pixi.js'

import WallDirection from './WallDirection'

import {
	WALL_SIDE_STYLES,
	WALL_COORDINATES,
} from '@/core/modules/wall/constants'

import { Point3D, PolygonGraphics, type BoxFaces } from '@/core/utils'

export default class WallContainer extends Container {
	readonly #sides: BoxFaces[]

	constructor(position: Point3D, direction: WallDirection, grid: number[][]) {
		super()

		this.position.copyFrom(position)
		this.#sides = [this.#createSide(position, direction, grid)]

		this.#sides.forEach(side =>
			side.forEach(face => face && this.addChild(face))
		)

		this.eventMode = 'static'

		this.on('pointerdown', async event => {
			if (event.button !== 0) return

			const { selectedCube } = await import('@/ui/store/inventory')

			event.stopPropagation()
			selectedCube.value = null
			this.emit('deselect-cube')
		})
	}

	#createSide(position: Point3D, direction: WallDirection, grid: number[][]) {
		const isLeft = direction === WallDirection.Left
		const styles = isLeft ? WALL_SIDE_STYLES.left : WALL_SIDE_STYLES.right
		const coordinates = isLeft
			? WALL_COORDINATES.left
			: WALL_COORDINATES.right

		const isAtLeftBorder = position.x === 0 && position.y === grid.length
		const isAtRightBorder =
			position.y === 0 && position.x === grid.length - 1

		const faces: BoxFaces = new Map([
			[
				'top',
				new PolygonGraphics(
					styles.surface.fillColor,
					coordinates.surface,
					styles.surface.borderColor,
					styles.surface.borderWidth,
					{ left: true, right: true }
				),
			],
			[
				'left',
				new PolygonGraphics(
					styles.border.fillColor,
					coordinates.border,
					styles.border.borderColor,
					styles.border.borderWidth,
					{
						top: true,
						bottom: true,
						left: isAtLeftBorder || isAtRightBorder,
						right: true,
					}
				),
			],
			[
				'right',
				new PolygonGraphics(
					styles.borderTop.fillColor,
					coordinates.borderTop,
					styles.borderTop.borderColor,
					styles.borderTop.borderWidth,
					{
						top: true,
						bottom: true,
						left: isAtLeftBorder,
						right: isAtRightBorder,
					}
				),
			],
		]) as BoxFaces

		faces.forEach(face => face && (face.eventMode = 'static'))

		return faces
	}

	get sides(): BoxFaces[] {
		return this.#sides
	}
}
