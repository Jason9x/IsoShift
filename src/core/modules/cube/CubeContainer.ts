import { Container } from 'pixi.js'

import { CUBE_FACE_COLORS } from '@/core/modules/cube/constants'
import { PolygonGraphics, type BoxFaces, Point3D } from '@/core/utils'

export default class CubeContainer extends Container {
	readonly #faces: BoxFaces

	constructor(position: Point3D, size: number) {
		super()

		this.pivot.set(size, 0)
		this.position.set(position.x + size, position.y - position.z)

		this.#faces = this.#createFaces(size)
		this.#faces.forEach(face => {
			if (face) this.addChild(face)
		})

		this.eventMode = 'dynamic'
	}

	#createFaces = (size: number): BoxFaces =>
		new Map([
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

	get faces(): BoxFaces {
		return this.#faces
	}
}
