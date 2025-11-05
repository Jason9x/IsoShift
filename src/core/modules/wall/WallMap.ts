import { Container } from 'pixi.js'

import { Wall, WallDirection } from '@/core/modules/wall'
import type { FaceKey } from '@/core/utils'

export default class WallMap extends Container {
	readonly #walls: Wall[]

	constructor() {
		super()
		this.#walls = []
	}

	addWall(wall: Wall): void {
		this.#walls.push(wall)
		this.addChild(wall.container)

		wall.container.on(
			'wall-face-right-clicked',
			this.#handleWallFaceRightClick
		)
		wall.container.on('deselect-cube', () => this.emit('deselect-cube'))
	}

	#handleWallFaceRightClick = (
		direction: WallDirection,
		key: FaceKey,
		hexColor: string
	) => {
		const numericColor = parseInt(hexColor.replace('#', ''), 16)

		this.#walls.forEach(wall => {
			if (wall.direction === direction)
				wall.container.sides.forEach(side =>
					side.get(key)?.draw(numericColor)
				)
		})
	}
}
