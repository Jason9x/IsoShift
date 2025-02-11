import { inject, injectable } from 'inversify'

import { Container, Point } from 'pixi.js'

import Tile from '@/modules/tile/Tile'

import ITileMap from '@/interfaces/modules/ITileMap'

import Point3D from '@/utils/coordinates/Point3D'

import calculateWallDirections from '@/utils/calculations/calculateWallDirections'
import IWallMap from '@/interfaces/modules/IWallMap'
import Wall from '../wall/Wall'

@injectable()
export default class TileMap implements ITileMap {
	readonly #grid: number[][]
	readonly #wallMap: IWallMap
	readonly #tiles: Tile[]
	readonly #container: Container

	constructor(
		@inject('Grid') grid: number[][],
		@inject('IWallMap') wallMap: IWallMap,
	) {
		this.#grid = grid
		this.#wallMap = wallMap
		this.#tiles = []
		this.#container = new Container()
	}

	generate(): void {
		this.#grid.forEach((row, x) =>
			row.forEach((z, y) => {
				if (z === -1) return

				const position = new Point3D(x, y, z)
				const tile = new Tile(position)

				this.#tiles.push(tile)
				this.#container.addChild(tile.container)

				const wallDirections = calculateWallDirections(x, y)

				wallDirections.forEach(direction => {
					const wall = new Wall(position, direction)

					this.#wallMap.addWall(wall)
				})
			}),
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

	get container() {
		return this.#container
	}

	get grid() {
		return this.#grid
	}
}
