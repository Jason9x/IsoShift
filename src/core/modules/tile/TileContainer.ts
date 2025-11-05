import { Container, Graphics } from 'pixi.js'

import { TILE_COORDINATES, TILE_STYLES } from '@/core/modules/tile/constants'

import {
	PolygonGraphics,
	borderPresets,
	type BoxFaces,
	Point3D,
} from '@/core/utils'

type FaceInitOptions = {
	hasLeftBorder: boolean
	hasRightBorder: boolean
	isAtFirstColumn: boolean
	isAtFirstRow: boolean
}

export default class TileContainer extends Container {
	readonly #faces: BoxFaces
	#hoverEffect?: Graphics

	constructor(position: Point3D, hasBorders: boolean[]) {
		super()

		this.position.set(position.x, position.y - position.z)

		const [hasLeftBorder, hasRightBorder] = hasBorders
		const isAtFirstColumn = position.x === 0
		const isAtFirstRow = position.y === 0

		this.#faces = this.#initializeFaces({
			hasLeftBorder,
			hasRightBorder,
			isAtFirstColumn,
			isAtFirstRow,
		})

		this.#faces.forEach(face => face && this.addChild(face))
		this.eventMode = 'static'
	}

	#initializeFaces = (options: FaceInitOptions): BoxFaces => {
		const { hasLeftBorder, hasRightBorder, isAtFirstColumn, isAtFirstRow } =
			options

		return new Map([
			[
				'top',
				new PolygonGraphics(
					TILE_STYLES.surface.fillColor,
					TILE_COORDINATES.surface,
					TILE_STYLES.surface.borderColor,
					TILE_STYLES.surface.borderWidth,
					borderPresets.tileSurface(
						isAtFirstRow,
						isAtFirstColumn,
						hasLeftBorder,
						hasRightBorder
					)
				),
			],
			[
				'left',
				hasLeftBorder
					? new PolygonGraphics(
							TILE_STYLES.leftBorder.fillColor,
							TILE_COORDINATES.leftBorder,
							TILE_STYLES.leftBorder.borderColor,
							TILE_STYLES.leftBorder.borderWidth,
							borderPresets.tileBorder()
						)
					: null,
			],
			[
				'right',
				hasRightBorder
					? new PolygonGraphics(
							TILE_STYLES.rightBorder.fillColor,
							TILE_COORDINATES.rightBorder,
							TILE_STYLES.rightBorder.borderColor,
							TILE_STYLES.rightBorder.borderWidth,
							borderPresets.tileBorder()
						)
					: null,
			],
		])
	}

	createHoverEffect(): void {
		this.#hoverEffect = new Graphics()
		this.#hoverEffect.setStrokeStyle({ width: 1, color: 0xffff00 })
		this.#hoverEffect.poly(TILE_COORDINATES.surface, true).stroke()
		this.#hoverEffect.y -= 1

		this.addChild(this.#hoverEffect)
	}

	destroyHoverEffect(): void {
		this.#hoverEffect?.destroy()
		if (this.#hoverEffect) this.removeChild(this.#hoverEffect)
		this.#hoverEffect = undefined
	}

	get faces(): BoxFaces {
		return this.#faces
	}
}
