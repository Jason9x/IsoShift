import { Container } from 'pixi.js'

import { PolygonGraphics } from '@/shared'
import { Point3D } from '@/utils/coordinates'
import type { BoxFaces } from './types'
import { CUBE_FACE_COLORS } from '@/modules/cube/constants'

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
					CUBE_FACE_COLORS.TOP_FACE,
					this.#topFacePoints,
				),
			],
			[
				'left',
				new PolygonGraphics(
					CUBE_FACE_COLORS.LEFT_FACE,
					this.#leftFacePoints,
				),
			],
			[
				'right',
				new PolygonGraphics(
					CUBE_FACE_COLORS.RIGHT_FACE,
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
