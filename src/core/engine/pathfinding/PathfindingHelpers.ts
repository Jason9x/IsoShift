import { Point } from 'pixi.js'

import PathNode from './PathNode'
import type { RequiredPathfindingContext } from './Pathfinder'

import type { Cube } from '@/core/modules'

import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'
import { AVATAR_DIMENSIONS } from '@/core/modules/avatar/constants'

import { isValidTilePosition, Point3D } from '@/core/utils'

const DIAGONAL_COST = Math.sqrt(2)
const HORIZONTAL_VERTICAL_COST = 1.0

export const updateNodeHeight = (
	node: PathNode,
	context: RequiredPathfindingContext
): void => {
	const tallestCubeAtNode = context.cubeLayer.findTallestCubeAt(node.position)

	node.height = tallestCubeAtNode
		? tallestCubeAtNode.position.z + tallestCubeAtNode.size
		: node.position.z + TILE_DIMENSIONS.thickness
}

export const reconstructPath = (goal: PathNode): Point3D[] => {
	const path: Point3D[] = []
	let node: PathNode | null = goal

	while (node) {
		path.push(node.position)
		node = node.parent
	}

	return path.reverse()
}

export const getNeighborPositions = (
	context: RequiredPathfindingContext,
	position: Point3D
): Point3D[] => {
	const offsets = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, -1],
		[1, 1],
		[-1, 1],
		[1, -1],
	]

	return offsets
		.map(([deltaX, deltaY]) => {
			const x = position.x + deltaX
			const y = position.y + deltaY
			const z = context.tileMap.getGridValue(new Point(x, y))

			return new Point3D(x, y, z)
		})
		.filter((position: Point3D) =>
			isValidTilePosition(position, context.tileMap)
		)
}

export const isDiagonalMove = (
	node: PathNode,
	currentNode: PathNode
): boolean =>
	Math.abs(node.position.x - currentNode.position.x) === 1 &&
	Math.abs(node.position.y - currentNode.position.y) === 1

export const calculateGCost = (
	currentNode: PathNode,
	neighborNode: PathNode
): number => {
	const deltaX = Math.abs(neighborNode.position.x - currentNode.position.x)
	const deltaY = Math.abs(neighborNode.position.y - currentNode.position.y)

	const cost =
		deltaX === 1 && deltaY === 1 ? DIAGONAL_COST : HORIZONTAL_VERTICAL_COST

	return currentNode.gCost + cost
}

export const isObstacle = (
	context: RequiredPathfindingContext,
	neighborNode: PathNode,
	currentNode: PathNode
): boolean => {
	const cube = context.cubeLayer.findTallestCubeAt(neighborNode.position)
	const isNarrow = cube && cube.size < AVATAR_DIMENSIONS.WIDTH
	const maxHeight = currentNode.height + AVATAR_DIMENSIONS.HEIGHT / 1.5
	const isTooHigh = neighborNode.height > maxHeight

	return isNarrow || isTooHigh
}

export const isPathObstructed = (
	context: RequiredPathfindingContext,
	node: PathNode,
	currentNode: PathNode
): boolean | Cube | null => {
	if (!isDiagonalMove(node, currentNode)) return false

	const direction = new Point(
		node.position.x - currentNode.position.x,
		node.position.y - currentNode.position.y
	)

	const checkPosition = (x: number, y: number) => {
		const position = new Point(x, y)
		const z = context.tileMap.getGridValue(position)
		const position3D = new Point3D(x, y, z)

		const tile = context.tileMap.findTileByExactPosition(position3D)
		const cube = context.cubeLayer.findTallestCubeAt(position3D)

		return !tile || cube
	}

	return (
		checkPosition(node.position.x, node.position.y - direction.y) &&
		checkPosition(node.position.x - direction.x, node.position.y)
	)
}
