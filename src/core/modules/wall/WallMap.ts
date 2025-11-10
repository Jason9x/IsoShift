import { Container } from 'pixi.js'

import { Wall, WallDirection, WallContainer, TileMap } from '@/core/modules'

import { Point3D, type FaceKey } from '@/core/utils'

export default class WallMap extends Container {
	constructor(visible: boolean) {
		super()

		this.visible = visible
	}

	generateFromGrid(
		grid: number[][],
		height: number,
		thickness: number,
		colors?: { top?: number; left?: number; right?: number }
	): WallMap {
		for (let x = 0; x < grid.length; x++) {
			const row = grid[x]

			for (let y = 0; y < row.length; y++) {
				const z = row[y]

				if (z === -1) continue

				const position = new Point3D(x, y, z)
				const directions = this.#calculateWallDirections(x, y)

				for (let i = 0; i < directions.length; i++) {
					const direction = directions[i]
					const wall = new Wall(
						position,
						direction,
						grid,
						height,
						thickness,
						this,
						colors
					)

					this.addWall(wall)
				}
			}
		}

		return this
	}

	addWall(wall: Wall): void {
		this.addChild(wall.container)

		wall.container.on('deselect-cube', () => this.emit('deselect-cube'))
	}

	applyFaceColorToAllWalls = (face: FaceKey, color: number): void => {
		this.children.forEach(child => {
			if (!(child instanceof WallContainer)) return

			const faceGraphics = child.sides[0]?.get(face)
			faceGraphics?.draw(color)
		})
	}

	setupTileMapEvents = (tileMap: TileMap): WallMap =>
		this.on('deselect-cube', () => {
			tileMap.emit('hide-blueprint')
			tileMap.emit('enable-cubes')
		})

	#calculateWallDirections(x: number, y: number): WallDirection[] {
		if (x === 0 && y === 0) return [WallDirection.Left, WallDirection.Right]
		if (x === 0) return [WallDirection.Left]
		if (y === 0) return [WallDirection.Right]

		return []
	}
}
