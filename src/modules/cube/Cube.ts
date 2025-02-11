import { FederatedPointerEvent } from 'pixi.js'

import container from '@/inversify.config'


import ITileMap from '@/interfaces/modules/ITileMap'
import IAvatar from '@/interfaces/modules/IAvatar'
import ICubeMap from '@/interfaces/modules/ICubeMap'

import ICamera from '@/interfaces/game/ICamera'

import Tile from '@/modules/tile/Tile'
import CubeContainer from '@/modules/cube/CubeContainer'

import PolygonGraphics from '@/shared/PolygonGraphics'

import Point3D from '@/utils/coordinates/Point3D'

import createColorInput from '@/utils/helpers/colorInputHelper'

import { cartesianToIsometric } from '@/utils/coordinates/coordinateTransformations'
import calculateCubeOffsets from '@/utils/calculations/calculateCubeOffsets'

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

	#setupEventListeners() {
		this.#container.faces.forEach(face =>
			face?.on('rightdown', this.#handleFaceClick.bind(this, face))
		)

		this.#container
			.on('pointerdown', this.#handlePointerDown.bind(this))
			.on('pointerover', this.#handlePointerOver.bind(this))
			.on('pointerout', this.#handlePointerOut.bind(this))
			.on('globalpointermove', this.#handleDragMove.bind(this))
			.on('pointerup', this.#handleDragEnd.bind(this))
			.on('pointerupoutside', this.#handleDragEnd.bind(this))
	}

	#handleFaceClick = (face: PolygonGraphics) =>
		createColorInput(hexColor => face.initialize(hexColor))

	#handlePointerDown(event: FederatedPointerEvent) {
		if (event.button !== 0) return

		this.#container.alpha = 0.5
		this.#isDragging = true

		const camera = container.get<ICamera>('ICamera')
		camera.enabled = false
	}

	#handlePointerOver = (event: FederatedPointerEvent) =>
		this.#currentTile?.container?.emit('pointerover', event)

	#handlePointerOut = (event: FederatedPointerEvent) =>
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
		avatar.adjustRenderingOrder(cubeMap.cubes)

		this.currentTile?.container.emit('pointerover', event)
	}

	#handleDragEnd() {
		this.#container.alpha = 1
		this.#isDragging = false

		const camera = container.get<ICamera>('ICamera')
		camera.enabled = true
	}

	#placeOnTile(tile: Tile) {
		const cubeMap = container.get<ICubeMap>('ICubeMap')
		const tallestCubeAtTile = cubeMap.findTallestCubeAt(tile.position)

		if (
			tallestCubeAtTile === this ||
			(tallestCubeAtTile && this.#isLargerThan(tallestCubeAtTile))
		)
			return

		const cubeOffsets = calculateCubeOffsets(this.#size)
		const newPosition = cartesianToIsometric(tile.position).subtract(
			cubeOffsets
		)

		newPosition.z = tallestCubeAtTile
			? tallestCubeAtTile.position.z + tallestCubeAtTile.size
			: newPosition.z

		this.#updatePosition(newPosition)

		const avatar = container.get<IAvatar>('IAvatar')
		avatar.adjustPositionOnCubeDrag(this)

		this.#currentTile = tile
	}

	#isLargerThan = (cube: Cube) => this.#size > cube.size

	#updatePosition(position: Point3D) {
		this.#position.copyFrom(position)

		this.#container.position.set(position.x, position.y - position.z)
	}

	get position() {
		return this.#position
	}

	get size() {
		return this.#size
	}

	get container() {
		return this.#container
	}

	get currentTile() {
		return this.#currentTile
	}
}
