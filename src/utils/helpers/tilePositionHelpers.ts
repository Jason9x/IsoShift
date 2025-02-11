import { Point } from 'pixi.js'

import container from '@/inversify.config'

import ITileMap from '@/interfaces/modules/ITileMap'

import Point3D from '@/utils/coordinates/Point3D'

export const isValidTilePosition = (position: Point3D) => {
	const { x, y, z } = position

	const position2D = new Point(x, y)

	const tileMap = container.get<ITileMap>('ITileMap')

	if (!isTilePositionInBounds(position, tileMap.grid)) return false

	const tileHeight = tileMap.getGridValue(position2D)

	return tileHeight !== -1 && tileHeight === z
}

const isTilePositionInBounds = (
	position: Point3D,
	grid: number[][]
) => {
	const { x, y } = position

	const maxGridValues = new Point(
		grid.length - 1,
		Math.max(...grid.map(row => row.length)) - 1
	)

	return x >= 0 && y >= 0 && x <= maxGridValues.x && y <= maxGridValues.y
}

export const findClosestValidTilePosition = (
	position: Point3D
) => {
	const grid = container.get<number[][]>('Grid')

	return grid.reduce(
		(
			closest: {
				position: Point3D | null
				distance: number
			},
			row: number[],
			x: number
		) =>
			row.reduce(
				(
					innerClosest: {
						position: Point3D | null
						distance: number
					},
					z: number,
					y: number
				) => {
					if (z < 0) return innerClosest

					const potentialPosition = new Point3D(x, y, z)

					if (potentialPosition.equals(position)) return innerClosest

					const distance = position.distanceTo(potentialPosition)
					const priority =
						potentialPosition.x === position.x &&
						potentialPosition.y === position.y
							? 0
							: distance

					if (priority < innerClosest.distance) {
						return {
							position: potentialPosition,
							distance: priority
						}
					}

					return innerClosest
				},
				closest
			),
		{ position: null, distance: Number.POSITIVE_INFINITY }
	).position
}
