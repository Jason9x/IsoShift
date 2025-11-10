import { Container, type FederatedPointerEvent } from 'pixi.js'

import WallDirection from './WallDirection'
import { createWallSide } from './geometry'
import { Point3D, type BoxFaces } from '@/core/utils'

export default class WallContainer extends Container {
	readonly #sides: BoxFaces[]

	constructor(
		position: Point3D,
		direction: WallDirection,
		grid: number[][],
		height: number,
		thickness: number
	) {
		super()

		this.position.copyFrom(position)
		this.eventMode = 'static'

		const side = createWallSide(
			position,
			direction,
			height,
			thickness,
			grid
		)

		this.#sides = [side]

		side.forEach(face => {
			if (!face) return

			face.eventMode = 'static'
			this.addChild(face)
		})

		this.on('pointerdown', this.#handlePointerDown)
	}

	#handlePointerDown = async (event: FederatedPointerEvent) => {
		if (event.button !== 0) return

		const { selectedCube } = await import('@/ui/store/inventory')

		event.stopPropagation()
		selectedCube.value = null

		this.emit('deselect-cube')
	}

	get sides(): BoxFaces[] {
		return this.#sides
	}
}
