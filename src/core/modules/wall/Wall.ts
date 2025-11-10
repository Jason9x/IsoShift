import { WallDirection, WallContainer } from '@/core/modules/wall'
import { Point3D, cartesianToIsometric, createColorInput } from '@/core/utils'

export default class Wall {
	readonly #container: WallContainer

	constructor(
		position: Point3D,
		direction: WallDirection,
		grid: number[][],
		height: number,
		thickness: number
	) {
		this.#container = new WallContainer(
			cartesianToIsometric(position),
			direction,
			grid,
			height,
			thickness
		)

		this.#setupEventListeners(direction)
	}

	#setupEventListeners = (direction: WallDirection) =>
		this.#container.sides.forEach(side =>
			side.forEach((face, key) =>
				face?.on('rightclick', () =>
					createColorInput(hexColor =>
						this.#container.emit(
							'wall-face-right-clicked',
							direction,
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
}
