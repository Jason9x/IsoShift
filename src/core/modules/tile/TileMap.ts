import { Container, Point } from 'pixi.js'

import Tile from './Tile'

import type { Avatar } from '@/core/modules/avatar'

import { Point3D, type FaceKey } from '@/core/utils'

import type Camera from '@/core/engine/game/Camera'

import {
	TileHoverManager,
	TileEventHandlers,
	CameraTrackingManager
} from './managers'

export default class TileMap extends Container {
	readonly #grid: number[][]
	readonly #tiles: Tile[]
	readonly #hoverManager: TileHoverManager
	readonly #eventHandlers: TileEventHandlers

	constructor(grid: number[][]) {
		super()

		this.#grid = grid
		this.#tiles = []

		this.#hoverManager = new TileHoverManager(
			() => this.emit('hide-blueprint'),
			(position, size) => this.emit('show-blueprint', position, size),
			() => this.emit('enable-cubes'),
			() => this.emit('disable-cubes')
		)

		this.#eventHandlers = new TileEventHandlers(
			(position, size) => this.emit('place-cube', position, size),
			position => this.emit('tile-clicked', position)
		)
	}

	generateTiles(
		thickness: number,
		colors?: {
			surface?: number
			leftBorder?: number
			rightBorder?: number
		}
	): void {
		for (let x = 0; x < this.#grid.length; x++) {
			const row = this.#grid[x]

			for (let y = 0; y < row.length; y++) {
				const z = row[y]

				if (z === -1) continue

				const position = new Point3D(x, y, z)
				const tile = new Tile(
					position,
					this.#grid,
					thickness,
					this,
					colors
				)

				this.#tiles.push(tile)
				this.addChild(tile.container)
				this.#setupTileEvents(tile)
			}
		}
	}

	applyFaceColorToAllTiles = (face: FaceKey, color: number): void =>
		this.#tiles.forEach(tile => tile.applyFaceColor(face, color))

	getGridValue = (position: Point): number =>
		this.#grid[position.x]?.[position.y] ?? -1

	findTileByExactPosition = (position: Point3D): Tile | undefined =>
		this.#tiles.find(tile => tile.position.equals(position))

	findTileByPositionInBounds = (position: Point): Tile | undefined =>
		this.#tiles.find(tile => tile.isPositionWithinBounds(position))

	setupAvatarMovement(avatar: Avatar): this {
		this.on('tile-clicked', position => avatar.moveTo(position))

		return this
	}

	setupCameraHoverTracking(camera: Camera): void {
		const cameraTrackingManager = new CameraTrackingManager(
			camera.viewport,
			(position: Point) => this.#updateHoverFromPointerPosition(position),
			() => this.#hoverManager.clearHover()
		)

		cameraTrackingManager.setup()
	}

	#setupTileEvents = (tile: Tile) =>
		tile.container
			.on('tile:click', (position: Point3D) =>
				this.#eventHandlers.handleTileClick(position)
			)
			.on('tile:hover', (position: Point3D) => {
				const hoveredTile = this.findTileByExactPosition(position)
				if (hoveredTile) this.#hoverManager.setHoveredTile(hoveredTile)
			})
			.on('tile:hoverEnd', () => this.#hoverManager.clearHover())

	#updateHoverFromPointerPosition(pointerPosition: Point): void {
		const tileUnderPointer =
			this.findTileByPositionInBounds(pointerPosition)

		this.#hoverManager.setHoveredTile(tileUnderPointer)
	}

	get grid(): number[][] {
		return this.#grid
	}
}
