import { Point } from 'pixi.js'

import { Point3D } from '@/core/utils/coordinates'
import type TileMap from './TileMap'

export const isValidTilePosition = (
	position: Point3D,
	tileMap: TileMap
): boolean => {
	const { x, y, z } = position
	const { grid } = tileMap

	if (x < 0 || y < 0 || x >= grid.length || y >= grid[x]?.length) return false

	const height = tileMap.getGridValue(new Point(x, y))

	return height !== -1 && height === z
}

export const findClosestValidTilePosition = (
	position: Point3D,
	grid: number[][]
): Point3D | null => {
	let closest: Point3D | null = null
	let minimumDistance = Infinity

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			const z = grid[x][y]

			if (z < 0) continue

			const candidate = new Point3D(x, y, z)

			if (candidate.equals(position)) continue

			const isSameColumn =
				candidate.x === position.x && candidate.y === position.y
			const distance = isSameColumn ? 0 : position.distanceTo(candidate)

			if (distance < minimumDistance) {
				closest = candidate
				minimumDistance = distance
			}
		}
	}

	return closest
}
