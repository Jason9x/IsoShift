import { Container, FederatedPointerEvent, Point } from 'pixi.js'

import { Cube, Tile, TileMap } from '@/core/modules'
import type { Avatar } from '@/core/modules/avatar'
import { Camera } from '@/core/engine/game'

import { Point3D, cartesianToIsometric } from '@/core/utils/coordinates'
import {
	findClosestValidTilePosition,
	isValidTilePosition,
} from '@/core/utils/helpers'
import { calculateCubeOffsets } from '@/core/utils/calculations'
import type { CubeData } from '@/ui/store/rooms'
import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

export default class CubeLayer extends Container {
	#tileMap?: TileMap
	#camera?: Camera
	#avatar?: Avatar

	readonly #cubes: Cube[]
	readonly #cubeData: CubeData[]
	#blueprintCube?: Cube

	constructor(cubeData: CubeData[] = []) {
		super()
		this.#cubes = []
		this.#cubeData = cubeData
	}

	initialize(tileMap: TileMap, camera: Camera, avatar: Avatar): void {
		this.#tileMap = tileMap
		this.#camera = camera
		this.#avatar = avatar

		this.#populateSceneWithCubes()
		this.sortCubesByPosition()
		this.addChild(avatar.container)

		tileMap.on('place-cube', this.#handlePlaceCube)
		tileMap.on('show-blueprint', this.#handleShowBlueprint)
		tileMap.on('hide-blueprint', this.#handleHideBlueprint)
		tileMap.on('disable-cubes', this.#disableCubes)
		tileMap.on('enable-cubes', this.#enableCubes)
	}

	#populateSceneWithCubes = () =>
		this.#cubeData.forEach(({ position, size }) => {
			if (!this.#tileMap) return

			const pos = new Point3D(position.x, position.y, position.z)
			let validPosition = this.#getValidTilePosition(pos)

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
				tallestCubeAtTile
			)

			if (!currentTile) return

			const cube = new Cube(finalPosition, validSize, currentTile)

			this.#addCube(cube)

			// Listen for cube events
			cube.container.on('cube-clicked', this.#handleCubeClick)
			cube.container.on('cube-drag-start', this.#handleCubeDragStart)
			cube.container.on('cube-drag-move', this.#handleCubeDragMove)
			cube.container.on('cube-drag-end', this.#handleCubeDragEnd)
		})

	findTallestCubeAt = (position: Point3D): Cube | null =>
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

	#handleCubeClick = async (cube: Cube, globalPosition: Point) => {
		const { cubeMenuState } = await import('@/ui/store/cubeMenu')
		cubeMenuState.value = {
			x: globalPosition.x,
			y: globalPosition.y,
			onRotate: () => console.log('Rotate cube'),
			onMove: () => {
				this.#camera!.enabled = false
				cube.container.alpha = 0.5
				cube.enableDrag()
			},
			onDelete: () => {
				const index = this.#cubes.indexOf(cube)
				if (index > -1) {
					this.#cubes.splice(index, 1)
					this.removeChild(cube.container)
					cube.container.destroy()
					this.sortCubesByPosition()
					if (this.#avatar) this.adjustRenderingOrder(this.#avatar)
					this.#saveRoomCubes()
				}
			},
		}
	}

	#handleCubeDragStart = (cube: Cube) => {
		if (!this.#camera) return
		this.#camera.enabled = false
		cube.container.alpha = 0.5
	}

	#handleCubeDragMove = async (cube: Cube, globalPosition: Point) => {
		if (!this.#tileMap || !this.#avatar) return

		const mockPointerEvent = {
			pointerId: 0,
			width: 1,
			height: 1,
			isPrimary: true,
			pressure: 0.5,
			button: 0,
			buttons: 0,
			clientX: globalPosition.x,
			clientY: globalPosition.y,
		} as FederatedPointerEvent

		cube.currentTile?.container.emit('pointerout', mockPointerEvent)

		const pointerPosition = this.#tileMap.toLocal(globalPosition)
		const targetTile =
			this.#tileMap.findTileByPositionInBounds(pointerPosition)

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
			cubeOffsets
		)

		newPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: newPosition.z

		cube.placeOnTile(targetTile, newPosition)

		//if (this.#avatar.isMoving) await this.#avatar.moveTo(true)

		this.sortCubesByPosition()
		this.adjustRenderingOrder(this.#avatar)

		cube.currentTile?.container.emit('pointerover', mockPointerEvent)
	}

	#handleCubeDragEnd = () => {
		if (!this.#camera) return
		this.#camera.enabled = true
		this.#saveRoomCubes()
	}

	#handlePlaceCube = async (position: Point3D, size: number) => {
		if (!this.#tileMap) return

		const validSize = this.#getValidSize(size)
		const tilePosition = cartesianToIsometric(position)
		const currentTile = this.#tileMap.findTileByExactPosition(position)

		if (!currentTile) return

		const tallestCubeAtTile = this.findTallestCubeAt(position)
		const cubeOffsets = calculateCubeOffsets(validSize)
		const finalPosition = this.#getFinalCubePosition(
			tilePosition,
			cubeOffsets,
			tallestCubeAtTile
		)

		const cube = new Cube(finalPosition, validSize, currentTile)

		cube.container.on('cube-clicked', this.#handleCubeClick)
		cube.container.on('cube-drag-start', this.#handleCubeDragStart)
		cube.container.on('cube-drag-move', this.#handleCubeDragMove)
		cube.container.on('cube-drag-end', this.#handleCubeDragEnd)

		this.#addCube(cube)
		this.sortCubesByPosition()
		if (this.#avatar) this.adjustRenderingOrder(this.#avatar)

		this.#saveRoomCubes()
	}

	#handleShowBlueprint = (position: Point3D, size: number) => {
		if (!this.#tileMap) return

		this.#handleHideBlueprint()

		const validSize = this.#getValidSize(size)
		const tilePosition = cartesianToIsometric(position)
		const currentTile = this.#tileMap.findTileByExactPosition(position)

		if (!currentTile) return

		const tallestCubeAtTile = this.findTallestCubeAt(position)
		const cubeOffsets = calculateCubeOffsets(validSize)
		const finalPosition = this.#getFinalCubePosition(
			tilePosition,
			cubeOffsets,
			tallestCubeAtTile
		)

		this.#blueprintCube = new Cube(finalPosition, validSize, currentTile)
		this.#blueprintCube.container.alpha = 0.3
		this.#blueprintCube.container.eventMode = 'none'
		this.addChild(this.#blueprintCube.container)
	}

	#handleHideBlueprint = () => {
		if (this.#blueprintCube) {
			this.removeChild(this.#blueprintCube.container)
			this.#blueprintCube.container.destroy()
			this.#blueprintCube = undefined
		}
	}

	#disableCubes = () => {
		this.#cubes.forEach(cube => (cube.container.eventMode = 'none'))
	}

	#enableCubes = () => {
		this.#cubes.forEach(cube => (cube.container.eventMode = 'dynamic'))
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
		tallestCubeAtTile: Cube | null
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

	#saveRoomCubes = async () => {
		const { updateRoom } = await import('@/ui/store/rooms')
		const cubes = this.#cubes.map(cube => ({
			position: {
				x: cube.currentTile!.position.x,
				y: cube.currentTile!.position.y,
				z: cube.currentTile!.position.z,
			},
			size: cube.size,
		}))
		updateRoom({ cubes })
	}

	adjustRenderingOrder(avatar: Avatar): void {
		const sortedEntities = [...this.#cubes, avatar]

		sortedEntities.sort((entityA, entityB) => {
			const posA =
				entityA instanceof Cube
					? entityA.currentTile?.position
					: avatar.currentTile?.position
			const posB =
				entityB instanceof Cube
					? entityB.currentTile?.position
					: avatar.currentTile?.position

			if (!posA || !posB) return 0

			const isometricPositionA = cartesianToIsometric(posA)
			const isometricPositionB = cartesianToIsometric(posB)

			return isometricPositionA.y !== isometricPositionB.y
				? isometricPositionA.y - isometricPositionB.y
				: isometricPositionA.x - isometricPositionB.x
		})

		sortedEntities.forEach(
			(entity, index) => (entity.container.zIndex = index)
		)
		this.sortChildren()
	}

	get cubes(): Cube[] {
		return this.#cubes
	}
}
