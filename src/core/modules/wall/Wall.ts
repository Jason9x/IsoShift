import { FederatedPointerEvent } from 'pixi.js'

import { WallDirection, WallContainer } from '@/core/modules/wall'
import { Point3D, cartesianToIsometric, type FaceKey } from '@/core/utils'

import type WallMap from './WallMap'

export default class Wall {
	readonly #container: WallContainer
	readonly #position: Point3D
	readonly #direction: WallDirection
	readonly #map: WallMap

	constructor(
		position: Point3D,
		direction: WallDirection,
		grid: number[][],
		height: number,
		thickness: number,
		map: WallMap,
		colors?: { top?: number; left?: number; right?: number }
	) {
		this.#position = position
		this.#direction = direction
		this.#map = map
		this.#container = new WallContainer(
			cartesianToIsometric(position),
			direction,
			grid,
			height,
			thickness,
			colors
		)

		this.#setupEventListeners()
	}

	#setupEventListeners = (): void =>
		this.#container.sides.forEach(side =>
			side.forEach((face, key) => {
				if (!face) return

				face.on('rightdown', (event: FederatedPointerEvent) =>
					this.#handleFaceRightClick(key, event.global)
				)
			})
		)

	async #handleFaceRightClick(
		faceKey: string,
		globalPosition: { x: number; y: number }
	): Promise<void> {
		const { colorMenuState } = await import('@/ui/store/colorMenu')
		const { setWallColor } = await import('@/ui/store/colors')

		colorMenuState.value = {
			x: globalPosition.x,
			y: globalPosition.y,
			type: 'cube',
			entityId: 'all-walls',
			faceKey: faceKey,
			onColorChange: (color: number) => {
				setWallColor(faceKey as FaceKey, color)

				this.#map.applyFaceColorToAllWalls(faceKey as FaceKey, color)
			}
		}
	}

	get container(): WallContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}

	get direction(): WallDirection {
		return this.#direction
	}
}
