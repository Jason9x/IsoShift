import { FederatedPointerEvent, Point, Polygon } from 'pixi.js'

import { TileContainer } from '@/core/modules/tile'

import {
	Point3D,
	isometricToCartesian,
	cartesianToIsometric,
	type FaceKey
} from '@/core/utils'

import type TileMap from './TileMap'

export default class Tile {
	readonly #position: Point3D
	readonly #container: TileContainer
	readonly #map: TileMap

	constructor(
		position: Point3D,
		grid: number[][],
		thickness: number,
		map: TileMap,
		colors?: { surface?: number; leftBorder?: number; rightBorder?: number }
	) {
		this.#position = position
		this.#map = map

		const hasBorders = [
			this.#isTileEmpty(new Point(0, 1), grid),
			this.#isTileEmpty(new Point(1, 0), grid)
		]

		const isometricPosition = cartesianToIsometric(position)

		this.#container = new TileContainer(
			isometricPosition,
			hasBorders,
			thickness,
			colors
		)

		this.#setupEventListeners()
	}

	isPositionWithinBounds(position: Point): boolean {
		const { x, y, z } = cartesianToIsometric(this.#position)

		const transformedPoints = this.#container.surfaceCoordinates.map(
			(point, index) => point + (index % 2 === 0 ? x : y - z)
		)

		const polygon = new Polygon(transformedPoints)

		return polygon.contains(position.x, position.y)
	}

	#isTileEmpty(delta: Point, grid: number[][]) {
		const { x, y, z } = isometricToCartesian(this.#position)
		const nextRow = grid[x + delta.x]

		return !nextRow || nextRow[y + delta.y] !== z
	}

	#setupEventListeners() {
		const surfaceFace = this.#container.faces.get('top')

		surfaceFace
			?.on('pointerover', () =>
				this.#container.emit('tile:hover', this.#position)
			)
			.on(
				'pointertap',
				(event: FederatedPointerEvent) =>
					event.button === 0 &&
					this.#container.emit('tile:click', this.#position)
			)
			.on('pointerout', () => this.#container.emit('tile:hoverEnd'))
			.on('pointerleave', () => this.#container.emit('tile:hoverEnd'))

		this.#container.faces.forEach((face, key) => {
			if (!face) return

			face.on('rightdown', (event: FederatedPointerEvent) =>
				this.#handleFaceRightClick(key, event.global)
			)
		})
	}

	async #handleFaceRightClick(
		face: FaceKey,
		globalPosition: { x: number; y: number }
	): Promise<void> {
		const { colorMenuState } = await import('@/ui/store/colorMenu')
		const { setTileColor } = await import('@/ui/store/colors')

		const storeFaceKey =
			face === 'top'
				? 'surface'
				: face === 'left'
					? 'leftBorder'
					: 'rightBorder'

		colorMenuState.value = {
			x: globalPosition.x,
			y: globalPosition.y,
			type: 'tile',
			entityId: 'all-tiles',
			faceKey: storeFaceKey as 'surface' | 'leftBorder' | 'rightBorder',
			onColorChange: (color: number) => {
				setTileColor(
					storeFaceKey as 'surface' | 'leftBorder' | 'rightBorder',
					color
				)

				this.#map.applyFaceColorToAllTiles(face, color)
			}
		}
	}

	applyFaceColor = (face: FaceKey, color: number): void =>
		this.#container.applyFaceColor(face, color)

	get container(): TileContainer {
		return this.#container
	}

	get position(): Point3D {
		return this.#position
	}
}
