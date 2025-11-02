import { Point } from 'pixi.js'

import Heap from 'heap-js'

import { Node } from '@/core/engine/pathfinding'
import type { TileMap } from '@/core/modules/tile'
import type { CubeLayer } from '@/core/modules/cube'

import {
	Point3D,
	cartesianToIsometric,
	isometricToCartesian,
} from '@/core/utils/coordinates'
import { isValidTilePosition } from '@/core/utils/helpers'

import { AVATAR_DIMENSIONS } from '@/core/modules/avatar/constants'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

export default class Pathfinder {
	readonly #tileMap: TileMap
	readonly #cubeLayer: CubeLayer

	readonly #DIAGONAL_COST = Math.sqrt(2)
	readonly #HORIZONTAL_VERTICAL_COST = 1.0

	constructor(tileMap: TileMap, cubeLayer: CubeLayer) {
		this.#tileMap = tileMap
		this.#cubeLayer = cubeLayer
	}

	findPath(
		startPosition: Point3D,
		goalPosition: Point3D,
		isRecalculating: boolean,
	) {
		if (!this.#validateInput(startPosition, goalPosition)) return null

		const [openList, closedList] = [
			this.#initializeOpenList(),
			new Set<Node>(),
		]

		let startNode = this.#createStartNode(startPosition, goalPosition)
		let closestNode = startNode

		openList.add(startNode)

		while (!openList.isEmpty()) {
			const currentNode = openList.pop()

			if (!currentNode || this.#isInClosedList(currentNode, closedList))
				continue

			this.#updateNodeHeight(currentNode)

			closedList.add(currentNode)

			if (currentNode.fCost < closestNode.fCost) closestNode = currentNode

			if (currentNode.position.equals(goalPosition))
				return this.#reconstructPath(currentNode)

			this.#getNeighborNodes(currentNode).forEach(neighborNode =>
				this.#processNeighborNode(
					neighborNode,
					currentNode,
					openList,
					goalPosition,
				),
			)
		}

		return isRecalculating ? this.#reconstructPath(closestNode) : null
	}

	#validateInput = (startPosition: Point3D, goalPosition: Point3D) =>
		isValidTilePosition(startPosition, this.#tileMap) &&
		isValidTilePosition(goalPosition, this.#tileMap) &&
		!startPosition.equals(goalPosition)

	#initializeOpenList = () => new Heap<Node>((a, b) => a.fCost - b.fCost)

	#createStartNode(startPosition: Point3D, goalPosition: Point3D) {
		const node = new Node(startPosition)
		node.fCost = startPosition.distanceTo(goalPosition)
		return node
	}

	#isInClosedList = (node: Node, closedList: Set<Node>) =>
		[...closedList].some(n => n.position.equals(node.position))

	#updateNodeHeight(node: Node) {
		const tallestCubeAtNode = this.#cubeLayer.findTallestCubeAt(
			node.position,
		)

		node.height = tallestCubeAtNode
			? tallestCubeAtNode.position.z + tallestCubeAtNode.size
			: node.position.z + TILE_DIMENSIONS.thickness
	}

	#reconstructPath(goalNode: Node) {
		const path: Point3D[] = []
		let node: Node | null = goalNode
		while (node) {
			path.push(node.position)
			node = node.parent
		}
		return path.reverse()
	}

	#getNeighborNodes = (node: Node) =>
		this.#getNeighborPositions(node.position).map(pos => new Node(pos))

	#getNeighborPositions(position: Point3D) {
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
			.map(([dx, dy]) => {
				const x = position.x + dx
				const y = position.y + dy
				const z = this.#tileMap.getGridValue(new Point(x, y))
				return new Point3D(x, y, z)
			})
			.filter(pos => isValidTilePosition(pos, this.#tileMap))
	}

	#processNeighborNode(
		neighborNode: Node,
		currentNode: Node,
		openList: Heap<Node>,
		goalPosition: Point3D,
	) {
		this.#updateNodeHeight(neighborNode)

		if (
			this.#isObstacle(neighborNode, currentNode) ||
			this.#isPathObstructed(neighborNode, currentNode)
		)
			return

		const gCost = this.#calculateGCost(currentNode, neighborNode)
		const hCost = neighborNode.position.distanceTo(goalPosition)
		const fCost = gCost + hCost

		const existingNode = this.#findExistingNode(neighborNode, openList)

		if (existingNode && fCost >= existingNode.fCost) return

		this.#updateNeighborNode(neighborNode, gCost, fCost, currentNode)

		if (existingNode) return

		openList.push(neighborNode)
	}

	#isObstacle(neighborNode: Node, currentNode: Node) {
		const cube = this.#cubeLayer.findTallestCubeAt(neighborNode.position)
		const isNarrow = cube && cube.size < AVATAR_DIMENSIONS.WIDTH
		const maxHeight = currentNode.height + AVATAR_DIMENSIONS.HEIGHT / 1.5
		const isTooHigh = neighborNode.height > maxHeight

		return isNarrow || isTooHigh
	}

	#isPathObstructed(node: Node, currentNode: Node) {
		if (!this.#isDiagonalMove(node, currentNode)) return false

		const dir = new Point(
			node.position.x - currentNode.position.x,
			node.position.y - currentNode.position.y,
		)

		const checkPosition = (x: number, y: number) => {
			const z = this.#tileMap.getGridValue(new Point(x, y))
			const pos = cartesianToIsometric(new Point3D(x, y, z))
			const tile = this.#tileMap.findTileByExactPosition(
				isometricToCartesian(pos),
			)
			const cube = this.#cubeLayer.findTallestCubeAt(
				isometricToCartesian(pos),
			)

			return !tile || cube
		}

		return (
			checkPosition(node.position.x, node.position.y - dir.y) &&
			checkPosition(node.position.x - dir.x, node.position.y)
		)
	}

	#isDiagonalMove = (node: Node, currentNode: Node) =>
		Math.abs(node.position.x - currentNode.position.x) === 1 &&
		Math.abs(node.position.y - currentNode.position.y) === 1

	#findExistingNode = (neighborNode: Node, openList: Heap<Node>) =>
		openList
			.toArray()
			.find(node => node.position.equals(neighborNode.position))

	#calculateGCost(currentNode: Node, neighborNode: Node) {
		const dx = Math.abs(neighborNode.position.x - currentNode.position.x)
		const dy = Math.abs(neighborNode.position.y - currentNode.position.y)
		const cost =
			dx === 1 && dy === 1
				? this.#DIAGONAL_COST
				: this.#HORIZONTAL_VERTICAL_COST

		return currentNode.gCost + cost
	}

	#updateNeighborNode(
		node: Node,
		gCost: number,
		fCost: number,
		parent: Node,
	) {
		node.gCost = gCost
		node.fCost = fCost
		node.parent = parent
	}
}
