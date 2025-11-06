import { Container } from 'pixi.js'

import { PolygonGraphics, type BoxFaces, Point3D } from '@/core/utils'
import { CUBE_FACE_COLORS } from '@/core/modules/cube/constants'

export default class CubeContainer extends Container {
	readonly #size: number
	readonly #faces: BoxFaces

	constructor(position: Point3D, size: number) {
		super()

		this.position.set(position.x, position.y - position.z)

		this.#size = size
		this.#faces = this.#createFaces()

		this.#faces.forEach(face => face && this.addChild(face))

		this.eventMode = 'dynamic'
	}

	#createFaces(): BoxFaces {
		const size = this.#size

		return new Map([
			[
				'top',
				new PolygonGraphics(CUBE_FACE_COLORS.topFace, [
					0,
					0,
					size,
					-size / 2,
					size * 2,
					0,
					size,
					size / 2
				])
			],
			[
				'left',
				new PolygonGraphics(CUBE_FACE_COLORS.leftFace, [
					0,
					0,
					0,
					size,
					size,
					size * 1.5,
					size,
					size / 2
				])
			],
			[
				'right',
				new PolygonGraphics(CUBE_FACE_COLORS.rightFace, [
					size * 2,
					0,
					size * 2,
					size,
					size,
					size * 1.5,
					size,
					size / 2
				])
			]
		])
	}

	get faces(): BoxFaces {
		return this.#faces
	}
}
