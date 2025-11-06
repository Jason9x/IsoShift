import { Container, Graphics } from 'pixi.js'

import { TILE_DIMENSIONS, TILE_STYLES } from '@/core/modules/tile/constants'

import {
	PolygonGraphics,
	borderPresets,
	type BoxFaces,
	type FaceKey,
	Point3D
} from '@/core/utils'

type TileCoordinates = {
	surface: number[]
	leftBorder: number[]
	rightBorder: number[]
}

type FaceInitOptions = {
	hasLeftBorder: boolean
	hasRightBorder: boolean
	isAtFirstColumn: boolean
	isAtFirstRow: boolean
}

export default class TileContainer extends Container {
	readonly #faces: BoxFaces
	readonly #surfaceCoordinates: number[]
	#hoverEffect?: Graphics

	constructor(
		position: Point3D,
		hasBorders: boolean[],
		tileThickness: number
	) {
		super()

		this.position.set(position.x, position.y - position.z)

		const [hasLeftBorder, hasRightBorder] = hasBorders
		const isAtFirstColumn = position.x === 0
		const isAtFirstRow = position.y === 0

		const coordinates = this.#getTileCoordinates(tileThickness)
		this.#surfaceCoordinates = coordinates.surface

		this.#faces = this.#initializeFaces(
			{
				hasLeftBorder,
				hasRightBorder,
				isAtFirstColumn,
				isAtFirstRow
			},
			coordinates
		)

		this.#faces.forEach(face => face && this.addChild(face))
		this.eventMode = 'static'
	}

	get surfaceCoordinates(): number[] {
		return this.#surfaceCoordinates
	}

	#getTileCoordinates(tileThickness: number): TileCoordinates {
		const { width, height } = TILE_DIMENSIONS
		const thickness = tileThickness

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

	#initializeFaces = (
		options: FaceInitOptions,
		coordinates: TileCoordinates
	): BoxFaces => {
		const { hasLeftBorder, hasRightBorder, isAtFirstColumn, isAtFirstRow } =
			options

		const faceConfig: Array<
			[
				FaceKey,
				typeof TILE_STYLES.surface,
				number[],
				ReturnType<typeof borderPresets.tileSurface>,
				boolean
			]
		> = [
			[
				'top',
				TILE_STYLES.surface,
				coordinates.surface,
				borderPresets.tileSurface(
					isAtFirstRow,
					isAtFirstColumn,
					hasLeftBorder,
					hasRightBorder
				),
				true
			],
			[
				'left',
				TILE_STYLES.leftBorder,
				coordinates.leftBorder,
				borderPresets.tileBorder(),
				hasLeftBorder
			],
			[
				'right',
				TILE_STYLES.rightBorder,
				coordinates.rightBorder,
				borderPresets.tileBorder(),
				hasRightBorder
			]
		]

		return new Map(
			faceConfig.map(([key, style, coords, borders, shouldCreate]) => [
				key,
				shouldCreate
					? new PolygonGraphics(
							style.fillColor,
							coords,
							style.borderColor,
							style.borderWidth,
							borders
						)
					: null
			])
		) as BoxFaces
	}

	createHoverEffect(): void {
		this.destroyHoverEffect()

		this.#hoverEffect = new Graphics()
		this.#hoverEffect.setStrokeStyle({ width: 1, color: 0xffff00 })
		this.#hoverEffect.poly(this.#surfaceCoordinates, true).stroke()
		this.#hoverEffect.y -= 1

		this.addChild(this.#hoverEffect)
	}

	destroyHoverEffect(): void {
		if (!this.#hoverEffect) return

		this.removeChild(this.#hoverEffect)
		this.#hoverEffect.destroy()
		this.#hoverEffect = undefined
	}

	get faces(): BoxFaces {
		return this.#faces
	}
}
