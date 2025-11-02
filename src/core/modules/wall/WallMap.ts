import { Container } from 'pixi.js'

import { Wall, WallDirection } from '@/core/modules/wall'
import type { FaceKey } from '@/core/modules/wall/types'

export default class WallMap extends Container {
	readonly #walls: Wall[]

	constructor() {
		super()
		this.#walls = []
	}

	addWall(wall: Wall) {
		this.#walls.push(wall)
		this.addChild(wall.container)

		wall.container.on(
			'wall-face-right-clicked',
			this.#handleWallFaceRightClick,
		)
	}

	#handleWallFaceRightClick = (
		direction: WallDirection,
		key: FaceKey,
		hexColor: string,
	) => {
		const numericColor = parseInt(hexColor.replace('#', ''), 16)
		this.#walls.forEach(wall => {
			if (wall.direction === direction) {
				wall.container.sides.forEach(side => {
					side.get(key)?.initialize(numericColor)
				})
			}
		})
	}

	get walls() {
		return this.#walls
	}
}
