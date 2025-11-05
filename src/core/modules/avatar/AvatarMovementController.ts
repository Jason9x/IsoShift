import Avatar from './Avatar'
import { AVATAR_OFFSETS, AVATAR_SPEED } from './constants'

import { Point3D, cartesianToIsometric } from '@/core/utils'

import Pathfinder from '@/core/engine/pathfinding/Pathfinder'

export class AvatarMovementController {
	readonly #avatar: Avatar

	#targetPosition?: Point3D
	#isMoving: boolean = false
	#onMovementComplete?: () => void

	constructor(avatar: Avatar) {
		this.#avatar = avatar
	}

	initialize(): void {
		this.#targetPosition = new Point3D(0, 0, 0)
	}

	async moveTo(goal: Point3D): Promise<void> {
		const start = this.#avatar.currentTile?.position
		const tileMap = this.#avatar.tileMap
		const cubeLayer = this.#avatar.cubeLayer

		const path = Pathfinder.findPath({
			start,
			goal,
			tileMap,
			cubeLayer,
		})

		if (!path || path.length === 0) return

		for (const position of path) {
			const targetPosition = this.#calculateTargetPosition(position)

			this.#targetPosition?.copyFrom(targetPosition)
			this.#avatar.currentTile =
				this.#avatar.tileMap?.findTileByExactPosition(position)
			this.#isMoving = true
			this.#avatar.cubeLayer?.adjustRenderingOrder(this.#avatar)

			await new Promise<void>(
				resolve => (this.#onMovementComplete = resolve)
			)
		}
	}

	async update(delta: number): Promise<void> {
		if (!this.#isMoving || !this.#targetPosition) return

		const direction = this.#targetPosition
			.subtract(this.#avatar.position)
			.normalize()

		const speed =
			direction.x === 0 || direction.y === 0
				? AVATAR_SPEED * 1.2
				: AVATAR_SPEED

		const remainingDistance = this.#avatar.position.distanceTo(
			this.#targetPosition
		)

		if (remainingDistance <= speed * delta) {
			this.#handleDestinationReached()
			return
		}

		const movementVector = direction?.scale(speed * delta)

		if (!movementVector) return

		const newPosition = this.#avatar.position.add(movementVector)

		this.#avatar.updateAvatarPosition(newPosition)
	}

	#calculateTargetPosition(position: Point3D) {
		const target = cartesianToIsometric(position).add(AVATAR_OFFSETS)
		const tallestCube = this.#avatar.cubeLayer?.findTallestCubeAt(position)

		if (tallestCube) target.z = tallestCube.position.z + tallestCube.size

		return target
	}

	#handleDestinationReached() {
		if (this.#targetPosition)
			this.#avatar.updateAvatarPosition(this.#targetPosition)
		this.#onMovementComplete?.()
		this.#onMovementComplete = undefined
		this.#isMoving = false
	}
}
