import Heap from 'heap-js'

import PathNode from './PathNode'

import type { TileMap, CubeLayer } from '@/core/modules'

import { Point3D, isValidTilePosition } from '@/core/utils'

import {
	calculateGCost,
	getNeighborPositions,
	isObstacle,
	isPathObstructed,
	reconstructPath,
	updateNodeHeight,
} from './PathfindingHelpers'

type PathfindingContext = {
	tileMap?: TileMap
	cubeLayer?: CubeLayer
}

export type RequiredPathfindingContext = {
	tileMap: TileMap
	cubeLayer: CubeLayer
}

export default class Pathfinder {
	static findPath({
		start,
		goal,
		tileMap,
		cubeLayer,
	}: {
		start?: Point3D
		goal: Point3D
	} & PathfindingContext): Point3D[] | null {
		if (!start || !tileMap || !cubeLayer) return null

		const context: RequiredPathfindingContext = { tileMap, cubeLayer }

		const isValidInput =
			isValidTilePosition(start, tileMap) &&
			isValidTilePosition(goal, tileMap) &&
			!start.equals(goal)

		if (!isValidInput) return null

		const [openList, closedList] = [
			new Heap<PathNode>((a, b) => a.fCost - b.fCost),
			new Set<PathNode>(),
		]

		const startNode = new PathNode(start)
		startNode.fCost = start.distanceTo(goal)

		let closestNode = startNode

		openList.add(startNode)

		while (!openList.isEmpty()) {
			const currentNode = openList.pop()

			if (!currentNode) continue

			const isCurrentNodeInClosedList = [...closedList].some(node =>
				node.position.equals(currentNode.position)
			)

			if (isCurrentNodeInClosedList) continue

			updateNodeHeight(currentNode, context)

			closedList.add(currentNode)

			if (currentNode.fCost < closestNode.fCost) closestNode = currentNode

			if (currentNode.position.equals(goal))
				return reconstructPath(currentNode)

			const neighborPositions = getNeighborPositions(
				context,
				currentNode.position
			)

			const neighborPathNodes = neighborPositions.map(
				position => new PathNode(position)
			)

			neighborPathNodes.forEach(neighborPathNode =>
				this.#processNeighborNode({
					context,
					neighborNode: neighborPathNode,
					currentNode: currentNode,
					openList,
					goal,
				})
			)
		}

		return reconstructPath(closestNode)
	}

	static #processNeighborNode({
		context,
		neighborNode,
		currentNode,
		openList,
		goal,
	}: {
		context: RequiredPathfindingContext
		neighborNode: PathNode
		currentNode: PathNode
		openList: Heap<PathNode>
		goal: Point3D
	}): void {
		updateNodeHeight(neighborNode, context)

		if (
			isObstacle(context, neighborNode, currentNode) ||
			isPathObstructed(context, neighborNode, currentNode)
		)
			return

		const gCost = calculateGCost(currentNode, neighborNode)
		const hCost = neighborNode.position.distanceTo(goal)
		const fCost = gCost + hCost

		const existingNode = openList
			.toArray()
			.find(node => node.position.equals(neighborNode.position))

		if (existingNode && fCost >= existingNode.fCost) return

		neighborNode.gCost = gCost
		neighborNode.fCost = fCost
		neighborNode.parent = currentNode

		openList.push(neighborNode)
	}
}
