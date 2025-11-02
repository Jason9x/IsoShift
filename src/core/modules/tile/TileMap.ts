import { Container, Point } from 'pixi.js'

import { Wall, Tile, WallMap, Avatar } from '@/core/modules'
import type { FaceKey } from '@/core/modules/tile/types'
import { Point3D } from '@/core/utils/coordinates'
import { calculateWallDirections } from '@/core/utils/calculations'
import { Pathfinder } from '@/core/engine/pathfinding'

export default class TileMap extends Container {
	readonly #grid: number[][]
	readonly #tiles: Tile[]
	#avatar?: Avatar
	#pathfinder?: Pathfinder

	constructor(grid: number[][]) {
		super()
		this.#grid = grid
		this.#tiles = []
	}

	initialize(wallMap: WallMap, avatar: Avatar, pathfinder: Pathfinder) {
		this.#avatar = avatar
		this.#pathfinder = pathfinder
		this.#generate(wallMap)
	}

	#generate(wallMap: WallMap) {
		this.#grid.forEach((row, x) =>
			row.forEach((z, y) => {
				if (z === -1) return

				const position = new Point3D(x, y, z)
				const tile = new Tile(position, this.#grid)

				this.#tiles.push(tile)
				this.addChild(tile.container)

				tile.container.on('tile-clicked', this.#handleTileClick)
				tile.container.on(
					'tile-face-right-clicked',
					this.#handleTileFaceRightClick,
				)

				const wallDirections = calculateWallDirections(x, y)

				wallDirections.forEach(direction => {
					const wall = new Wall(position, direction, this.#grid)

					wallMap.addWall(wall)
				})
			}),
		)
	}

	#handleTileClick = async (position: Point3D) => {
		if (!this.#avatar || !this.#pathfinder) return

		this.#avatar.goalPosition = position.clone()

		void this.#avatar.calculatePath()
	}

	#handleTileFaceRightClick = (
		position: Point3D,
		key: FaceKey,
		hexColor: string,
	) => {
		const numericColor = parseInt(hexColor.replace('#', ''), 16)
		this.#tiles.forEach(tile =>
			tile.container?.faces.get(key)?.initialize(numericColor),
		)
	}

	getGridValue = (position: Point) =>
		this.#grid[position.x]?.[position.y] ?? -1

	findTileByExactPosition = (position: Point3D) =>
		this.#tiles.find(tile => tile.position.equals(position))

	findTileByPositionInBounds = (position: Point) =>
		this.#tiles.find(tile => tile.isPositionWithinBounds(position))

	get tiles() {
		return this.#tiles
	}

	get grid() {
		return this.#grid
	}
}
