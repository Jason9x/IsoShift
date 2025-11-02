import { FederatedPointerEvent, Point } from 'pixi.js'

import { Tile, CubeContainer } from '@/core/modules'
import { PolygonGraphics, Point3D, createColorInput } from '@/core/utils'

export default class Cube {
	readonly #position: Point3D
	readonly #size: number
	readonly #container: CubeContainer

	#currentTile: Tile | undefined
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

	#handleFaceClick = (face: PolygonGraphics) =>
		createColorInput(hexColor => face.initialize(hexColor))

	#handlePointerDown(event: FederatedPointerEvent) {
		if (event.button !== 0) return

		this.#container.alpha = 0.5
		this.#isDragging = true

		this.#container.emit('cube-drag-start', this)
	}

	#handlePointerOver = (event: FederatedPointerEvent) =>
		this.#currentTile?.container?.emit(
			'pointerover',
			this.#createSyntheticPointerEvent(event.global, 'pointerover'),
		)

	#handlePointerOut = (event: FederatedPointerEvent) =>
		this.#currentTile?.container?.emit(
			'pointerout',
			this.#createSyntheticPointerEvent(event.global, 'pointerout'),
		)

	#handleDragMove(event: FederatedPointerEvent) {
		if (!this.#isDragging) return

		this.#container.emit('cube-drag-move', this, event.global)
	}
	#handleDragEnd() {
		this.#container.alpha = 1
		this.#isDragging = false

		this.#container.emit('cube-drag-end', this)
	}

	placeOnTile(tile: Tile, newPosition: Point3D) {
		this.#updatePosition(newPosition)
		this.#currentTile = tile
	}

	#updatePosition(position: Point3D) {
		this.#position.copyFrom(position)

		this.#container.position.set(position.x, position.y - position.z)
	}

	/**
	 * Creates a synthetic FederatedPointerEvent object for internal use.
	 * This helps satisfy TypeScript's strict type checking for PixiJS events
	 * when simulating pointer interactions.
	 * @param position The global position of the pointer.
	 * @param type The type of the event (e.g., 'pointerout', 'pointerover').
	 * @returns A new FederatedPointerEvent object.
	 */
	#createSyntheticPointerEvent = (
		position: Point,
		type: string,
	): FederatedPointerEvent => {
		return {
			// PointerEvent properties
			pointerId: 0,
			width: 1,
			height: 1,
			isPrimary: true,
			pointerType: 'mouse',
			pressure: 0.5,
			tangentialPressure: 0,
			tiltX: 0,
			tiltY: 0,
			twist: 0,
			altitudeAngle: Math.PI / 2, // 90 degrees
			azimuthAngle: 0,

			// MouseEvent properties
			button: 0, // Left button
			buttons: 1, // Left button pressed (for drag context)
			clientX: position.x,
			clientY: position.y,
			pageX: position.x,
			pageY: position.y,
			screenX: position.x,
			screenY: position.y,
			altKey: false,
			ctrlKey: false,
			metaKey: false,
			shiftKey: false,

			// UIEvent properties
			detail: 0,
			view: window, // Dummy window object

			// Event properties
			bubbles: true,
			cancelable: true,
			composed: true,
			currentTarget: null,
			defaultPrevented: false,
			eventPhase: 0,
			isTrusted: false, // Not a real browser event
			returnValue: true,
			srcElement: null,
			target: null, // Will be set by Pixi's event system
			timeStamp: performance.now(),
			type: type,

			// Pixi-specific properties
			global: position, // The global Point
			x: position.x,
			y: position.y,
			globalX: position.x,
			globalY: position.y,
			data: {
				global: position,
				originalEvent: null,
				target: null,
			},

			// Methods, often present on the prototype but sometimes expected directly for strict typing
			getCoalescedEvents: () => [],
			getPredictedEvents: () => [],
			stopPropagation: () => {},
			stopImmediatePropagation: () => {},
			preventDefault: () => {},
			movementX: 0,
			movementY: 0,
			offsetX: 0,
			offsetY: 0,
			screen: {
				width: window.screen.width,
				height: window.screen.height,
			} as Screen, // Cast to Screen
			region: '',
			relatedTarget: null,
			which: 0,
			char: '',
			charCode: 0,
			key: '',
			keyCode: 0,
			locale: '',
			location: 0,
			repeat: false,
			sourceCapabilities: null,
			DOM_KEY_LOCATION_STANDARD: 0,
			DOM_KEY_LOCATION_LEFT: 1,
			DOM_KEY_LOCATION_RIGHT: 2,
			DOM_KEY_LOCATION_NUMPAD: 3,
			getModifierState: () => false,
			initKeyboardEvent: () => {},
			initMouseEvent: () => {},

			// Client and movement properties, often expected in FederatedPointerEvent
			client: position, // Assuming client is the same as global for simplicity
			movement: new Point(0, 0), // No movement relative to previous event for a synthetic one
		} as unknown as FederatedPointerEvent // Cast to unknown first, then to FederatedPointerEvent
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
