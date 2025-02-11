import { Container, Graphics } from 'pixi.js'

import PolygonGraphics from '@/shared/PolygonGraphics'

import Point3D from '@/utils/coordinates/Point3D'
import { isometricToCartesian } from '@/utils/coordinates/coordinateTransformations'

import { BoxFaces } from '@/types/BoxFaces.types'

import { TILE_DIMENSIONS, TILE_STYLES } from '@/constants/Tile.constants'

export default class TileContainer extends Container {
	readonly #faces: BoxFaces
	#hoverEffect?: Graphics

	constructor(position: Point3D, hasBorders: [boolean, boolean]) {
		super()

		this.position.set(position.x, position.y - position.z)
		this.#hoverEffect = new Graphics()

		const [hasLeftBorder, hasRightBorder] = hasBorders

		const cartesianPosition = isometricToCartesian(position)
		const isAtFirstColumn = cartesianPosition.x === 0
		const isAtFirstRow = cartesianPosition.y === 0

		this.#faces = new Map([
			[
				'top',
				new PolygonGraphics(
					TILE_STYLES.surface.fillColor,
					this.#surfacePoints,
					TILE_STYLES.surface.borderColor,
					TILE_STYLES.surface.borderWidth,
					{
						top: !isAtFirstRow,
						bottom: false,
						left: !isAtFirstColumn && hasLeftBorder,
						right: hasRightBorder
					}
				)
			],
			[
				'left',
				hasLeftBorder
					? new PolygonGraphics(
						TILE_STYLES.leftBorder.fillColor,
						this.#leftBorderPoints,
						TILE_STYLES.leftBorder.borderColor,
						TILE_STYLES.leftBorder.borderWidth,
						{ top: true, bottom: true }
					)
					: null
			],
			[
				'right',
				hasRightBorder
					? new PolygonGraphics(
						TILE_STYLES.rightBorder.fillColor,
						this.#rightBorderPoints,
						TILE_STYLES.rightBorder.borderColor,
						TILE_STYLES.rightBorder.borderWidth,
						{ top: true, bottom: true }
					)
					: null
			]
		])

		this.#faces.forEach(face => face && this.addChild(face))

		this.eventMode = 'static'
	}

	createHoverEffect() {
		if (this.#hoverEffect) this.destroyHoverEffect()

		this.#hoverEffect = new Graphics()
		this.#hoverEffect.lineStyle(1, 0xffff00)
		this.#hoverEffect.drawPolygon(this.#surfacePoints)
		this.#hoverEffect.endFill()
		this.#hoverEffect.y -= 1

		this.addChild(this.#hoverEffect)
	}

	destroyHoverEffect() {
		if (!this.#hoverEffect) return

		this.#hoverEffect?.destroy()
		this.removeChild(this.#hoverEffect)
		this.#hoverEffect = undefined
	}

	get #surfacePoints() {
		return [
			TILE_DIMENSIONS.width / 2,
			0,
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width / 2,
			TILE_DIMENSIONS.height,
			0,
			TILE_DIMENSIONS.height / 2
		]
	}

	get #leftBorderPoints() {
		return [
			0,
			TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width / 2,
			TILE_DIMENSIONS.height,
			TILE_DIMENSIONS.width / 2,
			TILE_DIMENSIONS.height + TILE_DIMENSIONS.thickness,
			0,
			TILE_DIMENSIONS.height / 2 + TILE_DIMENSIONS.thickness
		]
	}

	get #rightBorderPoints() {
		return [
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2,
			TILE_DIMENSIONS.width / 2,
			TILE_DIMENSIONS.height,
			TILE_DIMENSIONS.width / 2,
			TILE_DIMENSIONS.height + TILE_DIMENSIONS.thickness,
			TILE_DIMENSIONS.width,
			TILE_DIMENSIONS.height / 2 + TILE_DIMENSIONS.thickness
		]
	}

	get faces() {
		return this.#faces
	}
}
