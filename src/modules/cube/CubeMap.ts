import { Container, FederatedPointerEvent, Point } from 'pixi.js'

import { Cube, Tile, TileMap, Avatar } from '@/modules'
import { Camera } from '@/engine/game'

import { Point3D, cartesianToIsometric } from '@/utils/coordinates'
import { findClosestValidTilePosition, isValidTilePosition } from '@/utils/helpers'
import { calculateCubeOffsets } from '@/utils/calculations'
import { CUBE_SETTINGS } from '@/modules/cube/constants'
import { TILE_DIMENSIONS } from '@/modules/tile/constants'

export default class CubeMap extends Container {
	#tileMap?: TileMap
	#camera?: Camera
	#avatar?: Avatar

	readonly #cubes: Cube[]

	constructor() {
		super()
		this.#cubes = []
	}

	setTileMap(tileMap: TileMap) {
		this.#tileMap = tileMap
	}

	setCamera(camera: Camera) {
		this.#camera = camera
	}

	setAvatar(avatar: Avatar) {
		this.#avatar = avatar
	}

	populateSceneWithCubes = () =>
		CUBE_SETTINGS.forEach(({ position, size }) => {
			if (!this.#tileMap) return

			let validPosition = this.#getValidTilePosition(position)

			if (!validPosition) return

			const validSize = this.#getValidSize(size)
			let tilePosition = cartesianToIsometric(validPosition)

			let currentTile =
				this.#tileMap.findTileByExactPosition(validPosition)

			if (!currentTile) return

			let tallestCubeAtTile = this.findTallestCubeAt(currentTile.position)
			const isCubeNarrower =
				tallestCubeAtTile && tallestCubeAtTile.size < validSize

			if (isCubeNarrower) {
				const data = this.#getClosestValidTileData(validPosition)

				if (!data) return
				;({ tilePosition, currentTile, tallestCubeAtTile } = data)
			}

			const cubeOffsets = calculateCubeOffsets(size)
			const finalPosition = this.#getFinalCubePosition(
				tilePosition,
				cubeOffsets,
				tallestCubeAtTile,
			)

			if (!currentTile) return

			const cube = new Cube(
				finalPosition,
				validSize,
				currentTile,
			)

			this.#addCube(cube)

			// Listen for cube events
			cube.container.on('cube-drag-start', this.#handleCubeDragStart)
			cube.container.on('cube-drag-move', this.#handleCubeDragMove)
			cube.container.on('cube-drag-end', this.#handleCubeDragEnd)
		})

	findTallestCubeAt = (position: Point3D) =>
		this.#cubes.reduce((currentTallest: Cube | null, cube: Cube) => {
			const isAtPosition = cube.currentTile?.position.equals(position)
			const isTaller =
				cube.position.z > (currentTallest?.position.z ?? -Infinity)

			return isAtPosition && isTaller ? cube : currentTallest
		}, null)

	sortCubesByPosition(): void {
		this.#cubes.sort(this.#sortCubesByPosition)
		this.#cubes.forEach((cube, index) => (cube.container.zIndex = index))

		this.sortChildren()
	}

	#handleCubeDragStart = () => {
		if (!this.#camera) return
		this.#camera.enabled = false
	}

	#handleCubeDragMove = async (cube: Cube, globalPosition: Point) => {
		if (!this.#tileMap || !this.#avatar) return

		const mockPointerEvent= {
            pointerId: 0,
            width: 1,
            height: 1,
            isPrimary: true,
            pressure: 0.5,
            button: 0,
            buttons: 0,
            clientX: globalPosition.x,
            clientY: globalPosition.y,
        } as FederatedPointerEvent;

		cube.currentTile?.container.emit('pointerout', mockPointerEvent)
		
		const pointerPosition = this.#tileMap.toLocal(globalPosition)
		const targetTile = this.#tileMap.findTileByPositionInBounds(pointerPosition)

		if (
			!targetTile ||
			targetTile === cube.currentTile ||
			targetTile === this.#avatar.currentTile
		)
			return

		const tallestCubeAtTile = this.findTallestCubeAt(targetTile.position)

		if (
			tallestCubeAtTile === cube ||
			(tallestCubeAtTile && cube.size > tallestCubeAtTile.size)
		)
			return

		const cubeOffsets = calculateCubeOffsets(cube.size)
		const newPosition = cartesianToIsometric(targetTile.position).subtract(
			cubeOffsets,
		)

		newPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: newPosition.z

		cube.placeOnTile(targetTile, newPosition)

		if (this.#avatar.isMoving) await this.#avatar.calculatePath(true)

		this.sortCubesByPosition()
		this.#avatar.adjustRenderingOrder(this.#cubes)

		cube.currentTile?.container.emit('pointerover', mockPointerEvent)
	}

	#handleCubeDragEnd = () => {
		if (!this.#camera) return
		this.#camera.enabled = true
	}

	#getValidTilePosition = (position: Point3D): Point3D | null =>
		this.#tileMap && isValidTilePosition(position, this.#tileMap)
			? position
			: this.#tileMap
			? findClosestValidTilePosition(position, this.#tileMap.grid)
			: null

	#getValidSize = (size: number): number =>
		Math.max(8, Math.min(size, TILE_DIMENSIONS.height))

	#getClosestValidTileData(position: Point3D):
		| {
				validPosition: Point3D
				tilePosition: Point3D
				currentTile: Tile | undefined
				tallestCubeAtTile: Cube | null
		  }
		| undefined {
		const validPosition = this.#tileMap
			? findClosestValidTilePosition(position, this.#tileMap.grid)
			: null

		if (!validPosition || !this.#tileMap) return

		const tilePosition = cartesianToIsometric(validPosition)
		const currentTile = this.#tileMap.findTileByExactPosition(tilePosition)
		const tallestCubeAtTile = this.findTallestCubeAt(tilePosition)

		return { validPosition, tilePosition, currentTile, tallestCubeAtTile }
	}

	#getFinalCubePosition(
		tilePosition: Point3D,
		offsets: Point,
		tallestCubeAtTile: Cube | null,
	) {
		const finalPosition = tilePosition.subtract(offsets)

		finalPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: finalPosition.z

		return finalPosition
	}

	#addCube(cube: Cube) {
		this.#cubes.push(cube)
		this.addChild(cube.container)
	}

	#sortCubesByPosition = (cubeA: Cube, cubeB: Cube) => {
		const { currentTile: currentTileA, position: positionA } = cubeA
		const { currentTile: currentTileB, position: positionB } = cubeB

		if (!currentTileA || !currentTileB) return 0

		const { position: tilePositionA } = currentTileA
		const { position: tilePositionB } = currentTileB

		const { z: zCoordinateA } = positionA
		const { z: zCoordinateB } = positionB

		if (zCoordinateA !== zCoordinateB) return zCoordinateA - zCoordinateB

		if (tilePositionA.y !== tilePositionB.y)
			return tilePositionA.y - tilePositionB.y

		return tilePositionA.x - tilePositionB.x
	}

	get cubes() {
		return this.#cubes
	}
}

