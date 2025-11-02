import { Container } from 'pixi.js'

import { PolygonGraphics, Point3D } from '@/core/utils'
import type { BoxFaces } from '@/core/modules/cube/types'
import { CUBE_FACE_COLORS } from '@/core/modules/cube/constants'

export default class CubeContainer extends Container {
	readonly #size: number
	readonly #faces: BoxFaces

	constructor(position: Point3D, size: number) {
		super()

		this.position.set(position.x, position.y - position.z)
		this.#size = size
		this.#faces = new Map([
			[
				'top',
				new PolygonGraphics(
					CUBE_FACE_COLORS.topFace,
					this.#topFacePoints,
				),
			],
			[
				'left',
				new PolygonGraphics(
					CUBE_FACE_COLORS.leftFace,
					this.#leftFacePoints,
				),
			],
			[
				'right',
				new PolygonGraphics(
					CUBE_FACE_COLORS.rightFace,
					this.#rightFacePoints,
				),
			],
		])

		this.#faces.forEach(face => face && this.addChild(face))

		this.eventMode = 'dynamic'
	}

	get #topFacePoints() {
		return [
			0,
			0,
			this.#size,
			-this.#size / 2,
			this.#size * 2,
			0,
			this.#size,
			this.#size / 2,
		]
	}

	get #leftFacePoints() {
		return [
			0,
			0,
			0,
			this.#size,
			this.#size,
			this.#size * 1.5,
			this.#size,
			this.#size / 2,
		]
	}

	get #rightFacePoints() {
		return [
			this.#size * 2,
			0,
			this.#size * 2,
			this.#size,
			this.#size,
			this.#size * 1.5,
			this.#size,
			this.#size / 2,
		]
	}

	get faces() {
		return this.#faces
	}
}
