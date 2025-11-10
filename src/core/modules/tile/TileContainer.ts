import { Container, Graphics } from 'pixi.js'

import {
	getTileCoordinates,
	createTileFaces,
	type FaceInitOptions
} from './geometry'

import { Point3D, type BoxFaces, type FaceKey } from '@/core/utils'

export default class TileContainer extends Container {
	readonly #faces: BoxFaces

	#hoverEffect?: Graphics

	constructor(
		position: Point3D,
		hasBorders: boolean[],
		tileThickness: number,
		colors?: { surface?: number; leftBorder?: number; rightBorder?: number }
	) {
		super()

		this.position.set(position.x, position.y - position.z)
		this.#faces = this.#createFaces(
			position,
			hasBorders,
			tileThickness,
			colors
		)
		this.#faces.forEach(face => face && this.addChild(face))
		this.eventMode = 'static'
	}

	#createFaces(
		position: Point3D,
		hasBorders: boolean[],
		thickness: number,
		colors?: { surface?: number; leftBorder?: number; rightBorder?: number }
	): BoxFaces {
		const [hasLeftBorder, hasRightBorder] = hasBorders
		const coordinates = getTileCoordinates(thickness)

		const config: FaceInitOptions = {
			hasLeftBorder,
			hasRightBorder,
			isAtFirstColumn: position.x === 0,
			isAtFirstRow: position.y === 0
		}

		return createTileFaces(config, coordinates, colors)
	}

	applyFaceColor(face: FaceKey, color: number): void {
		const faceGraphics = this.#faces.get(face)

		faceGraphics?.draw(color)
	}

	createHoverEffect(): void {
		this.destroyHoverEffect()

		const surfaceCoordinates = this.#getSurfaceCoordinates()

		this.#hoverEffect = new Graphics()
		this.#hoverEffect.stroke({ width: 1, color: 0xffff00 })
		this.#hoverEffect.poly(surfaceCoordinates, true).stroke()
		this.#hoverEffect.y -= 1

		this.addChild(this.#hoverEffect)
	}

	destroyHoverEffect(): void {
		if (!this.#hoverEffect) return

		this.removeChild(this.#hoverEffect)
		this.#hoverEffect.destroy()
		this.#hoverEffect = undefined
	}

	#getSurfaceCoordinates = (): number[] =>
		this.#faces.get('top')?.points ?? []

	get faces(): BoxFaces {
		return this.#faces
	}

	get surfaceCoordinates(): number[] {
		return this.#getSurfaceCoordinates()
	}
}
