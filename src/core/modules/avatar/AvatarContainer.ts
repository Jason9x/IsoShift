import { Container } from 'pixi.js'

import {
	AVATAR_COLORS,
	AVATAR_DIMENSIONS
} from '@/core/modules/avatar/constants'

import {
	PolygonGraphics,
	type BoxFaces,
	Point3D,
	type FaceKey
} from '@/core/utils'

export default class AvatarContainer extends Container {
	readonly #faces: BoxFaces

	constructor(
		position: Point3D,
		colors?: { top?: number; left?: number; right?: number }
	) {
		super()

		this.position.set(position.x, position.y - position.z)

		const { WIDTH, HEIGHT } = AVATAR_DIMENSIONS

		this.#faces = new Map([
			[
				'top',
				new PolygonGraphics(colors?.top ?? AVATAR_COLORS.TOP_FACE, [
					0,
					-HEIGHT,
					WIDTH,
					-HEIGHT - WIDTH / 2,
					WIDTH * 2,
					-HEIGHT,
					WIDTH,
					-HEIGHT + WIDTH / 2
				])
			],
			[
				'left',
				new PolygonGraphics(colors?.left ?? AVATAR_COLORS.LEFT_FACE, [
					0,
					0,
					0,
					-HEIGHT,
					WIDTH,
					-HEIGHT + WIDTH / 2,
					WIDTH,
					WIDTH / 2
				])
			],
			[
				'right',
				new PolygonGraphics(colors?.right ?? AVATAR_COLORS.RIGHT_FACE, [
					WIDTH,
					WIDTH / 2,
					WIDTH,
					-HEIGHT + WIDTH / 2,
					WIDTH * 2,
					-HEIGHT,
					WIDTH * 2,
					0
				])
			]
		])

		this.#faces.forEach(face => face && this.addChild(face))
	}

	applyFaceColor(face: FaceKey, color: number): void {
		const faceGraphics = this.#faces.get(face)

		faceGraphics?.draw(color)
	}

	get faces(): BoxFaces {
		return this.#faces
	}
}
