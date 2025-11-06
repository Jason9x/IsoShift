import { Container } from 'pixi.js'

import { Wall, WallDirection } from '@/core/modules/wall'
import { calculateWallDirections, type FaceKey, Point3D } from '@/core/utils'

export default class WallMap extends Container {
	readonly #walls: Wall[]
	readonly #height: number
	readonly #thickness: number

	constructor(height: number, thickness: number, visible: boolean) {
		super()
		this.#walls = []
		this.#height = height
		this.#thickness = thickness
		this.visible = visible
	}

	get height(): number {
		return this.#height
	}

	get thickness(): number {
		return this.#thickness
	}

	generateFromGrid(grid: number[][]): void {
		for (let x = 0; x < grid.length; x++) {
			const row = grid[x]
			for (let y = 0; y < row.length; y++) {
				const z = row[y]
				if (z === -1) continue
				const pos = new Point3D(x, y, z)
				const dirs = calculateWallDirections(x, y)
				for (let i = 0; i < dirs.length; i++) {
					const dir = dirs[i]
					this.addWall(
						new Wall(pos, dir, grid, this.height, this.thickness)
					)
				}
			}
		}
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
