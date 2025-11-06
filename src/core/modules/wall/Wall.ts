import { WallDirection, WallContainer } from '@/core/modules/wall'
import { Point3D, cartesianToIsometric, createColorInput } from '@/core/utils'

export default class Wall {
	readonly #direction: WallDirection
	readonly #container: WallContainer

	constructor(
		position: Point3D,
		direction: WallDirection,
		grid: number[][],
		height: number,
		thickness: number
	) {
		this.#direction = direction

		const isometricPosition = cartesianToIsometric(position)

		this.#container = new WallContainer(
			isometricPosition,
			direction,
			grid,
			height,
			thickness
		)

		this.#setupEventListeners()
	}

	#setupEventListeners = () =>
		this.#container.sides.forEach(side =>
			side.forEach((face, key) =>
				face?.on('rightclick', () =>
					createColorInput(hexColor =>
						this.#container.emit(
							'wall-face-right-clicked',
							this.#direction,
							key,
							hexColor
						)
					)
				)
			)
		)

	get container(): WallContainer {
		return this.#container
	}

	get direction(): WallDirection {
		return this.#direction
	}
}
