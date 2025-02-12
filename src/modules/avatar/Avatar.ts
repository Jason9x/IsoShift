import { inject, injectable } from 'inversify'

import AvatarContainer from './AvatarContainer'

import Tile from '@/modules/tile/Tile'
import Cube from '@/modules/cube/Cube'

import ITileMap from '@/interfaces/modules/ITileMap'
import ICubeMap from '@/interfaces/modules/ICubeMap'

import IPathfinder from '@/interfaces/modules/IPathfinder'
import IAvatar from '@/interfaces/modules/IAvatar'

import PolygonGraphics from '@/shared/PolygonGraphics'

import Point3D from '@/utils/coordinates/Point3D'
import { cartesianToIsometric, isometricToCartesian } from '@/utils/coordinates/coordinateTransformations'

import { findClosestValidTilePosition } from '@/utils/helpers/tilePositionHelpers'

import { AVATAR_DIMENSIONS, AVATAR_OFFSETS, AVATAR_SPEED } from '@/constants/Avatar.constants'

import createColorInput from '@/utils/helpers/colorInputHelper'

import calculateInitialAvatarPosition from '@/utils/calculations/calculateInitialAvatarPosition'

@injectable()
export default class Avatar implements IAvatar {
	readonly #tileMap: ITileMap
	readonly #pathfinder: IPathfinder
	readonly #cubeMap: ICubeMap

	readonly #position: Point3D
	readonly #container: AvatarContainer

	#currentTile: Tile | undefined
	#goalPosition: Point3D | undefined
	#targetPosition: Point3D | undefined
	#isMoving: boolean = false
	#onMovementComplete: (() => void) | undefined

	constructor(
		@inject('ITileMap') tileMap: ITileMap,
		@inject('IPathfinder') pathfinder: IPathfinder,
		@inject('ICubeMap') cubeMap: ICubeMap
	) {
		this.#tileMap = tileMap
		this.#pathfinder = pathfinder
		this.#cubeMap = cubeMap

		this.#position = calculateInitialAvatarPosition()
		this.#container = new AvatarContainer(this.#position)
	}

	initialize() {
		const tilePosition = this.#position.subtract(AVATAR_OFFSETS)

		this.#currentTile = this.#tileMap.findTileByExactPosition(tilePosition)

		let newPosition = this.#getNewPosition(tilePosition)

		const tallestCubeAtTile = this.#cubeMap.findTallestCubeAt(tilePosition)
		const isCubeNarrowerThanAvatar =
			tallestCubeAtTile &&
			tallestCubeAtTile.size < AVATAR_DIMENSIONS.WIDTH

		if (isCubeNarrowerThanAvatar) {
			const adjustedNewPosition =
				this.#getAdjustedNewPosition(tilePosition)

			if (!adjustedNewPosition) return

			newPosition = adjustedNewPosition
		}

		this.#updatePosition(newPosition)

		this.#setupEventListeners()
	}

	async calculatePath(isRecalculating: boolean = false) {
		if (!this.#currentTile || !this.#goalPosition) return

		const path = this.#pathfinder.findPath(
			this.#currentTile.position,
			this.#goalPosition,
			isRecalculating
		)

		if (!path) return

		await this.#moveAlongPath(path)
	}

	async update(delta: number) {
		if (!this.#isMoving || !this.#targetPosition) return

		const remainingDistance = this.#position.distanceTo(
			this.#targetPosition
		)
		const velocityMagnitude = this.#speed * delta

		if (remainingDistance <= velocityMagnitude) {
			this.#handleDestinationReached()
			return
		}

		const velocity = this.#calculateVelocity(delta)

		if (!velocity) return

		const newPosition = this.#position.add(velocity)
		this.#updatePosition(newPosition)
	}

	adjustPositionOnCubeDrag = (cube: Cube) => {
		if (!this.#currentTile || cube.currentTile !== this.#currentTile) return

		const newPosition = cartesianToIsometric(this.#currentTile.position).add(AVATAR_OFFSETS)

		const tallestCubeAtTile = this.#cubeMap.findTallestCubeAt(
			this.#currentTile.position
		)

		if (tallestCubeAtTile && cube !== tallestCubeAtTile)
			newPosition.z = tallestCubeAtTile.position.z + tallestCubeAtTile.size

		this.#updatePosition(newPosition)
	}

	adjustRenderingOrder(cubes: Cube[]) {
		const sortedEntities = [...cubes, this]

		sortedEntities.sort((entityA, entityB) => {
			const entityAIsometric = this.#getEntityIsometricPosition(entityA)
			const entityBIsometric = this.#getEntityIsometricPosition(entityB)

			const verticalComparison = entityAIsometric.y - entityBIsometric.y

			return verticalComparison !== 0
				? verticalComparison
				: entityAIsometric.x - entityBIsometric.x
		})

		sortedEntities.forEach(
			(entity, index) => (entity.container.zIndex = index)
		)

		this.#cubeMap.container.sortChildren()
	}

	#getEntityIsometricPosition(entity: Cube | Avatar) {
		const position =
			entity instanceof Cube
				? entity.currentTile?.position
				: this.#currentTile?.position

		if (!position) {
			const errorSubject =
				entity instanceof Cube
					? 'Cube tile position'
					: 'Avatar position'

			throw Error(`${errorSubject} undefined during depth sorting`)
		}

		return cartesianToIsometric(position)
	}

	#getNewPosition(position: Point3D) {
		const newPosition = position.add(AVATAR_OFFSETS)
		const tallestCube = this.#cubeMap.findTallestCubeAt(position)

		if (tallestCube)
			newPosition.z = tallestCube.position.z + tallestCube.size

		return newPosition
	}

	#getAdjustedNewPosition(position: Point3D) {
		const adjustedTilePosition = this.#getAdjustedTilePosition(position)

		if (!adjustedTilePosition) return

		this.#currentTile =
			this.#tileMap.findTileByExactPosition(adjustedTilePosition)

		return this.#getNewPosition(adjustedTilePosition)
	}

	#getAdjustedTilePosition(position: Point3D) {
		if (!this.#currentTile) return

		const validTilePosition = findClosestValidTilePosition(
			isometricToCartesian(position)
		)

		if (!validTilePosition) return

		return cartesianToIsometric(validTilePosition)
	}

	#updatePosition(position: Point3D) {
		this.#position.copyFrom(position)

		this.#container.position.set(position.x, position.y - position.z)
	}

	#setupEventListeners = () =>
		this.#container.faces.forEach(face =>
			face?.on('rightdown', this.#handleFaceClick.bind(this, face))
		)

	#handleFaceClick = (face: PolygonGraphics) =>
		createColorInput(hexColor => face.draw(hexColor))

	#moveAlongPath = async (path: Point3D[]) => {
		for (const position of path) await this.#moveTo(position)
	}

	async #moveTo(position: Point3D) {
		const tilePosition = position.clone()

		this.#currentTile = this.#tileMap.findTileByExactPosition(tilePosition)
		this.#targetPosition =
			cartesianToIsometric(tilePosition).add(AVATAR_OFFSETS)

		const tallestCubeAtTile = this.#cubeMap.findTallestCubeAt(tilePosition)

		this.#targetPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: this.#targetPosition.z

		this.#isMoving = true
		this.adjustRenderingOrder(this.#cubeMap.cubes)

		await new Promise<void>(resolve => (this.#onMovementComplete = resolve))
	}

	#handleDestinationReached() {
		if (!this.#targetPosition || !this.#onMovementComplete) return

		this.#updatePosition(this.#targetPosition)
		this.#onMovementComplete()
		this.#stopMovement()
	}

	#calculateVelocity(delta: number) {
		if (!this.#direction) return

		return this.#direction.scale(this.#speed * delta)
	}

	#stopMovement() {
		this.#targetPosition = undefined
		this.#onMovementComplete = undefined
		this.#isMoving = false
	}

	get #speed() {
		return this.#direction?.x === 0 || this.#direction?.y === 0
			? AVATAR_SPEED * 1.2
			: AVATAR_SPEED
	}

	get #direction(): Point3D | undefined {
		return this.#targetPosition?.subtract(this.#position).normalize()
	}

	get container() {
		return this.#container
	}

	get position() {
		return this.#position
	}

	get currentTile(): Tile | undefined {
		return this.#currentTile
	}

	set currentTile(value: Tile | undefined) {
		this.#currentTile = value
	}

	set goalPosition(value: Point3D) {
		this.#goalPosition = value
	}

	get isMoving(): boolean {
		return this.#isMoving
	}
}
