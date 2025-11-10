import Avatar from './Avatar'

import {
	calculateTargetPosition,
	calculateSpeed
} from './helpers/movementHelpers'

import { Pathfinder } from '@/core/engine'
import { Point3D } from '@/core/utils'

export class AvatarMovementController {
	readonly #avatar: Avatar

	#targetPosition?: Point3D
	#targetTilePosition?: Point3D
	#onMovementComplete?: () => void
	#movementToken = 0

	constructor(avatar: Avatar) {
		this.#avatar = avatar
	}

	async moveTo(goal: Point3D): Promise<void> {
		const startPosition =
			this.#targetTilePosition ?? this.#avatar.currentTile?.position

		if (!startPosition) return

		const path = Pathfinder.findPath({
			start: startPosition,
			goal,
			tileMap: this.#avatar.tileMap,
			cubeLayer: this.#avatar.cubeLayer
		})

		if (!path?.length) return

		if (path[0]?.equals(startPosition)) path.shift()

		this.#cancelCurrentMovement()

		const movementToken = ++this.#movementToken

		for (const position of path) {
			if (movementToken !== this.#movementToken) break

			await this.#moveToPosition(position, movementToken)

			if (movementToken !== this.#movementToken) return
		}
	}

	async update(delta: number): Promise<void> {
		if (!this.#targetPosition) return

		const { position } = this.#avatar
		const distance = position.distanceTo(this.#targetPosition)
		const speed = calculateSpeed(
			this.#avatar,
			this.#targetPosition,
			this.#targetPosition.z < position.z
		)

		const isWithinReach = distance <= speed * delta

		if (isWithinReach) {
			this.#handleDestinationReached()
			return
		}

		const movement = this.#targetPosition
			.subtract(position)
			.normalize()
			.scale(speed * delta)

		if (movement) this.#avatar.updatePosition(position.add(movement))
	}

	#moveToPosition(position: Point3D, movementToken: number): Promise<void> {
		this.#targetPosition = calculateTargetPosition(this.#avatar, position)
		this.#targetTilePosition = position
		this.#avatar.cubeLayer?.adjustRenderingOrder(this.#avatar)

		return new Promise<void>(
			resolve =>
				(this.#onMovementComplete = () => {
					if (movementToken !== this.#movementToken) {
						resolve()
						return
					}

					resolve()
				})
		)
	}

	#handleDestinationReached(): void {
		if (!this.#targetPosition) return

		this.#avatar.updatePosition(this.#targetPosition)
		this.#updateCurrentTile()
		this.#cleanup()
	}

	#updateCurrentTile(): void {
		if (!this.#targetTilePosition) return

		const tile = this.#avatar.tileMap?.findTileByExactPosition(
			this.#targetTilePosition
		)

		if (tile) this.#avatar.currentTile = tile
	}

	#cleanup(): void {
		this.#targetTilePosition = undefined
		this.#targetPosition = undefined

		this.#avatar.cubeLayer?.adjustRenderingOrder(this.#avatar)

		this.#onMovementComplete?.()
		this.#onMovementComplete = undefined
	}

	#cancelCurrentMovement(): void {
		this.#targetTilePosition = undefined
		this.#targetPosition = undefined

		if (!this.#onMovementComplete) return

		const resolve = this.#onMovementComplete
		this.#onMovementComplete = undefined
		resolve()
	}
}
