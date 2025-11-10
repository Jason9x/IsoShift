import Heap from 'heap-js'

import PathNode from './PathNode'

import { TileMap, CubeLayer, isValidTilePosition } from '@/core/modules'

import { Point3D } from '@/core/utils'

import {
	calculateGCost,
	getNeighborPositions,
	isObstacle,
	isPathObstructed,
	reconstructPath,
	updateNodeHeight
} from './PathfindingHelpers'

type PathfindingContext = {
	tileMap?: TileMap
	cubeLayer?: CubeLayer
}

export type RequiredPathfindingContext = {
	tileMap: TileMap
	cubeLayer: CubeLayer
}

type ProcessNeighborNodeParams = {
	context: RequiredPathfindingContext
	neighborNode: PathNode
	currentNode: PathNode
	openList: Heap<PathNode>
	openMap: Map<string, PathNode>
	closedSet: Set<string>
	goal: Point3D
}

export default class Pathfinder {
	static findPath({
		start,
		goal,
		tileMap,
		cubeLayer
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

		const openList = new Heap<PathNode>((a, b) =>
			a.fCost === b.fCost ? b.gCost - a.gCost : a.fCost - b.fCost
		)
		const openMap = new Map<string, PathNode>()
		const closedSet = new Set<string>()

		const startNode = new PathNode(start)
		startNode.fCost = start.distanceTo(goal)

		let closestNode = startNode

		openList.add(startNode)

		const startKey = this.#getPositionKey(start)
		openMap.set(startKey, startNode)

		while (!openList.isEmpty()) {
			const currentNode = openList.pop()

			if (!currentNode) continue

			const currentKey = this.#getPositionKey(currentNode.position)

			if (closedSet.has(currentKey)) continue

			// Skip outdated heap entries (a newer/better node for this position exists).
			const mapped = openMap.get(currentKey)

			if (mapped && mapped !== currentNode) continue

			updateNodeHeight(currentNode, context)

			closedSet.add(currentKey)
			openMap.delete(currentKey)

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
					openMap,
					closedSet,
					goal
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
		openMap,
		closedSet,
		goal
	}: ProcessNeighborNodeParams): void {
		updateNodeHeight(neighborNode, context)

		const neighborKey = this.#getPositionKey(neighborNode.position)
		if (closedSet.has(neighborKey)) return

		if (
			isObstacle(context, neighborNode, currentNode) ||
			isPathObstructed(context, neighborNode, currentNode)
		)
			return

		const gCost = calculateGCost(currentNode, neighborNode)
		const hCost = neighborNode.position.distanceTo(goal)
		const fCost = gCost + hCost

		const existingNode = openMap.get(neighborKey)

		if (existingNode && fCost >= existingNode.fCost) return

		neighborNode.gCost = gCost
		neighborNode.fCost = fCost
		neighborNode.parent = currentNode

		openMap.set(neighborKey, neighborNode)
		openList.push(neighborNode)
	}

	static #getPositionKey = (position: Point3D): string =>
		`${position.x},${position.y},${position.z}`
}
