import { FederatedPointerEvent } from 'pixi.js'

import Tile from '@/modules/tile/Tile'

import CubeContainer from '@/modules/cube/CubeContainer'

import PolygonGraphics from '@/shared/PolygonGraphics'

import Point3D from '@/utils/coordinates/Point3D'

import createColorInput from '@/utils/helpers/colorInputHelper'

import ITileMap from '@/interfaces/modules/ITileMap'

import container from '@/inversify.config'
import IAvatar from '@/interfaces/modules/IAvatar'
import ICamera from '@/interfaces/game/ICamera'
import ICubeMap from '@/interfaces/modules/ICubeMap'

export default class Cube {
	readonly #position: Point3D
	readonly #size: number

	#currentTile: Tile | undefined

	readonly #container: CubeContainer

	#isDragging: boolean = false

	constructor(position: Point3D, size: number, currentTile: Tile) {
		this.#position = position
		this.#size = size
		this.#currentTile = currentTile
		this.#container = new CubeContainer(this.#position, this.#size)

		this.#setupEventListeners()
	}

	#setupEventListeners(): void {
		this.#container.faces.forEach(face =>
			face?.on('rightdown', this.#handleFaceClick.bind(this, face)),
		)

		this.#container
			.on('pointerdown', this.#handlePointerDown.bind(this))
			.on('pointerover', this.#handlePointerOver.bind(this))
			.on('pointerout', this.#handlePointerOut.bind(this))
			.on('globalpointermove', this.#handleDragMove.bind(this))
			.on('pointerup', this.#handleDragEnd.bind(this))
			.on('pointerupoutside', this.#handleDragEnd.bind(this))
	}

	#handleFaceClick = (face: PolygonGraphics): void =>
		createColorInput(hexColor => face.initialize(hexColor))

	#handlePointerDown(event: FederatedPointerEvent): void {
		if (event.button !== 0) return

		this.#container.alpha = 0.5
		this.#isDragging = true

		const camera = container.get<ICamera>('ICamera')
		camera.enabled = false
	}

	#handlePointerOver = (event: FederatedPointerEvent): boolean | undefined =>
		this.#currentTile?.container?.emit('pointerover', event)

	#handlePointerOut = (event: FederatedPointerEvent): boolean | undefined =>
		this.#currentTile?.container?.emit('pointerout', event)

	async #handleDragMove(event: FederatedPointerEvent) {
		if (!this.#isDragging) return

		const tileMap = container.get<ITileMap>('ITileMap')
		const avatar = container.get<IAvatar>('IAvatar')

		this.#currentTile?.container.emit('pointerout', event)
		const pointerPosition = tileMap.container.toLocal(event)

		const targetTile = tileMap.findTileByPositionInBounds(pointerPosition)

		if (
			!targetTile ||
			targetTile === this.#currentTile ||
			targetTile === avatar.currentTile
		)
			return

		this.#placeOnTile(targetTile)

		if (avatar.isMoving) await avatar.calculatePath(true)

		const cubeMap = container.get<ICubeMap>('ICubeMap')

		cubeMap.sortCubesByPosition()
		cubeMap.adjustCubeRenderingOrder()

		this.currentTile?.container.emit('pointerover', event)
	}

	#handleDragEnd(): void {
		this.#container.alpha = 1
		this.#isDragging = false

		const camera = container.get<ICamera>('ICamera')
		camera.enabled = true
	}

	#placeOnTile(tile: Tile): void {
		const cubeMap = container.get<ICubeMap>('ICubeMap')

		const tallestCubeAtTile = cubeMap.findTallestCubeAt(tile.position)

		if (
			tallestCubeAtTile === this ||
			(tallestCubeAtTile && this.#isLargerThan(tallestCubeAtTile))
		)
			return

		// const offsets = calculateFurnitureOffsets(this.#size)
		// const newPosition = tile.position.subtract(offsets)

		// newPosition.z = tallestCubeAtTile
		// 	? tallestCubeAtTile.position.z + tallestCubeAtTile.size
		// 	: newPosition.z

		// this.#updatePosition(newPosition)

		// this.#avatar.adjustPositionOnCubeDrag(this)

		this.#currentTile = tile
	}

	#isLargerThan = (cube: Cube): boolean => this.#size > cube.size

	#updatePosition(position: Point3D): void {
		this.#position.copyFrom(position)

		this.#container.position.set(position.x, position.y - position.z)
	}

	get position(): Point3D {
		return this.#position
	}

	get size(): number {
		return this.#size
	}

	get graphics(): CubeContainer {
		return this.#container
	}

	get currentTile(): Tile | undefined {
		return this.#currentTile
	}
}
