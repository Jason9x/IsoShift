import { WallDirection, WallContainer } from '@/modules/wall'
import type { FaceKey } from './types'
import { Point3D, cartesianToIsometric } from '@/utils/coordinates'
import { createColorInput } from '@/utils/helpers'

export default class Wall {
	readonly #position: Point3D
	readonly #direction: WallDirection
	readonly #container: WallContainer

	constructor(position: Point3D, direction: WallDirection, grid: number[][]) {
		this.#position = position
		this.#direction = direction
		this.#container = new WallContainer(
			cartesianToIsometric(this.#position),
			this.#direction,
			grid,
		)

		this.#setupEventListeners()
	}

	#setupEventListeners = () =>
		this.#container.sides.forEach(side =>
			side.forEach((face, key) =>
				face?.on('rightclick', this.#handleFaceClick.bind(this, key)),
			),
		)

	#handleFaceClick = (key: FaceKey) =>
		createColorInput(hexColor =>
			this.#container.emit(
				'wall-face-right-clicked',
				this.#direction,
				key,
				hexColor,
			),
		)

	get container() {
		return this.#container
	}

	get direction() {
		return this.#direction
	}
}
