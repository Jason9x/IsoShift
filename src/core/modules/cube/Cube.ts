import { FederatedPointerEvent, Point } from 'pixi.js'

import { Tile, CubeContainer } from '@/core/modules'
import { Point3D, createColorInput } from '@/core/utils'

export enum DragState {
	Idle = 'idle',
	Enabled = 'enabled',
	Dragging = 'dragging'
}

export class Cube {
	readonly #position: Point3D
	readonly #size: number
	readonly #container: CubeContainer

	#currentTile: Tile | undefined
	#dragState = DragState.Idle
	#flipped: boolean

	constructor(
		position: Point3D,
		size: number,
		currentTile: Tile,
		flipped: boolean = false
	) {
		this.#position = position
		this.#size = size
		this.#flipped = flipped
		this.#currentTile = currentTile
		this.#container = new CubeContainer(position, size)

		this.#applyFlip()
		this.#setupEventListeners()
	}

	setDragState = (state: DragState): DragState => (this.#dragState = state)

	beginDrag = (): void => {
		if (this.#dragState !== DragState.Enabled) return

		this.#dragState = DragState.Dragging
		this.#container.emit('cube-drag-start', this)
	}

	placeOnTile(tile: Tile, newPosition: Point3D): void {
		this.#updatePosition(newPosition)
		this.#currentTile = tile
	}

	flip(): void {
		this.#flipped = !this.#flipped
		this.#applyFlip()
	}

	#setupEventListeners(): void {
		this.#container.faces.forEach(face =>
			face?.on('rightdown', () =>
				createColorInput(hexColor => face.draw(hexColor))
			)
		)

		this.#container
			.on('pointerdown', this.#handlePointerDown.bind(this))
			.on('pointerover', this.#handlePointerOver.bind(this))
			.on('pointerout', this.#handlePointerOut.bind(this))
			.on('globalpointermove', this.#handleDragMove.bind(this))
			.on('pointerup', this.#handleDragEnd.bind(this))
			.on('pointerupoutside', this.#handleDragEnd.bind(this))
	}

	async #handlePointerDown(event: FederatedPointerEvent) {
		if (event.button !== 0) return

		const { selectedCube } = await import('@/ui/store/inventory')

		if (selectedCube.value) return

		if (this.#dragState === DragState.Dragging) return

		if (this.#dragState === DragState.Enabled) {
			this.beginDrag()
			return
		}

		this.#container.emit('cube-clicked', this, event.global)
	}

	#handlePointerOver = (event: FederatedPointerEvent) =>
		this.#forwardPointerEvent('pointerover', event.global)

	#handlePointerOut = (event: FederatedPointerEvent) =>
		this.#forwardPointerEvent('pointerout', event.global)

	#forwardPointerEvent = (
		type: 'pointerover' | 'pointerout',
		position: Point
	): void => {
		const mockEvent = {
			global: position,
			x: position.x,
			y: position.y,
			globalX: position.x,
			globalY: position.y
		} as FederatedPointerEvent

		this.#currentTile?.container.emit(type, mockEvent)
	}

	#handleDragMove(event: FederatedPointerEvent) {
		if (this.#dragState !== DragState.Dragging) return

		this.#container.emit('cube-drag-move', this, event.global)
	}

	#handleDragEnd() {
		if (this.#dragState !== DragState.Dragging) return

		this.#container.emit('cube-drag-end', this)
	}

	#updatePosition(position: Point3D): void {
		this.#position.copyFrom(position)
		this.#container.position.set(
			position.x + this.#size,
			position.y - position.z
		)
	}

	#applyFlip = () => (this.#container.scale.x = this.#flipped ? -1 : 1)

	get position(): Point3D {
		return this.#position
	}

	get size(): number {
		return this.#size
	}

	get container(): CubeContainer {
		return this.#container
	}

	get currentTile(): Tile | undefined {
		return this.#currentTile
	}

	get dragState(): DragState {
		return this.#dragState
	}

	get flipped(): boolean {
		return this.#flipped
	}
}
