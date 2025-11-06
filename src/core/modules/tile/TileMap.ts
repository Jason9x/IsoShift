import { Container, Point } from 'pixi.js'

import { Tile, Avatar } from '@/core/modules'
import { type FaceKey, Point3D } from '@/core/utils'

import { selectedCube } from '@/ui/store/inventory'

export default class TileMap extends Container {
	readonly #grid: number[][]
	readonly #tiles: Tile[]

	#avatar?: Avatar

	constructor(grid: number[][]) {
		super()

		this.#grid = grid
		this.#tiles = []
	}

	initialize(avatar: Avatar, thickness: number): void {
		this.#avatar = avatar

		this.#generateTiles(thickness)
	}

	#generateTiles = (thickness: number) => {
		for (let x = 0; x < this.#grid.length; x++) {
			const row = this.#grid[x]

			for (let y = 0; y < row.length; y++) {
				const z = row[y]

				if (z === -1) continue

				const position = new Point3D(x, y, z)
				const tile = new Tile(position, this.#grid, thickness)

				this.#tiles.push(tile)
				this.addChild(tile.container)

				tile.setupEventHandlers({
					onTileClick: this.#handleTileClick,
					onTileHover: this.#handleTileHover,
					onTileHoverEnd: this.#handleTileHoverEnd,
					onTileFaceRightClick: this.#handleTileFaceRightClick
				})
			}
		}
	}

	#handleTileClick = async (position: Point3D) =>
		selectedCube.value
			? this.emit('place-cube', position, selectedCube.value.size)
			: this.#avatar?.moveTo(position)

	#handleTileHover = (position: Point3D) => {
		this.emit('show-blueprint', position, selectedCube.value?.size)
		this.emit('disable-cubes')
	}

	#handleTileHoverEnd = () => {
		this.emit('hide-blueprint')
		this.emit('enable-cubes')
	}

	#handleTileFaceRightClick = (key: FaceKey, hexColor: number) => {
		const numericColor = parseInt(hexColor.toString().replace('#', ''), 16)

		for (let i = 0; i < this.#tiles.length; i++) {
			const tile = this.#tiles[i]
			tile.container?.faces.get(key)?.draw(numericColor)
		}
	}

	getGridValue = (position: Point): number =>
		this.#grid[position.x]?.[position.y] ?? -1

	findTileByExactPosition = (position: Point3D): Tile | undefined =>
		this.#tiles.find(tile => tile.position.equals(position))

	findTileByPositionInBounds = (position: Point): Tile | undefined =>
		this.#tiles.find(tile => tile.isPositionWithinBounds(position))

	get grid(): number[][] {
		return this.#grid
	}
}
