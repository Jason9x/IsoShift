import { Container } from 'pixi.js'
import type { Point3D } from '@/core/utils/coordinates'

import type {
	TileMap,
	CubeCollection,
	CubeEventHandlers,
	CubeManager,
	BlueprintManager
} from '@/core/modules'

export class TileMapEventHandlers {
	readonly #collection: CubeCollection
	readonly #eventHandlers: CubeEventHandlers
	readonly #manager: CubeManager
	readonly #blueprintManager: BlueprintManager
	readonly #container: Container
	readonly #onFinalizeOperation: () => void
	readonly #onSortCubes: () => void

	#tileMap?: TileMap

	constructor(
		collection: CubeCollection,
		eventHandlers: CubeEventHandlers,
		manager: CubeManager,
		blueprintManager: BlueprintManager,
		container: Container,
		onFinalizeOperation: () => void,
		onSortCubes: () => void
	) {
		this.#collection = collection
		this.#eventHandlers = eventHandlers
		this.#manager = manager
		this.#blueprintManager = blueprintManager
		this.#container = container
		this.#onFinalizeOperation = onFinalizeOperation
		this.#onSortCubes = onSortCubes
	}

	setup(tileMap: TileMap): void {
		this.#tileMap = tileMap

		tileMap.on('place-cube', this.#handlePlaceCube.bind(this))
		tileMap.on('show-blueprint', this.#handleShowBlueprint.bind(this))
		tileMap.on('hide-blueprint', this.#handleHideBlueprint.bind(this))
		tileMap.on('disable-cubes', this.#handleDisableCubes.bind(this))
		tileMap.on('enable-cubes', this.#handleEnableCubes.bind(this))
	}

	#handlePlaceCube = (position: Point3D, size: number): void => {
		const tile = this.#tileMap?.findTileByExactPosition(position)

		if (!tile) return

		if (!this.#eventHandlers.canPlaceCubeAtTile(tile, size)) return

		const cube = this.#manager.createCubeAtPosition(position, size)

		if (!cube) return

		this.#eventHandlers.setup(cube)
		this.#collection.add(cube, this.#container)
		this.#onFinalizeOperation()
	}

	#handleShowBlueprint = (position: Point3D, size?: number): void => {
		if (size === undefined) {
			this.#blueprintManager.hide(this.#container)
			this.#onSortCubes()
			return
		}

		if (!this.#tileMap) {
			this.#blueprintManager.hide(this.#container)
			this.#onSortCubes()
			return
		}

		const tile = this.#tileMap.findTileByExactPosition(position)

		if (!tile) {
			this.#blueprintManager.hide(this.#container)
			this.#onSortCubes()
			return
		}

		if (!this.#eventHandlers.canPlaceCubeAtTile(tile, size)) {
			this.#blueprintManager.hide(this.#container)
			this.#onSortCubes()
			return
		}

		const cube = this.#manager.createCubeAtPosition(position, size)

		if (!cube) {
			this.#blueprintManager.hide(this.#container)
			this.#onSortCubes()
			return
		}

		this.#blueprintManager.show(cube, this.#container)
		this.#onSortCubes()
	}

	#handleHideBlueprint = (): void => {
		this.#blueprintManager.hide(this.#container)
		this.#onSortCubes()
	}

	#handleDisableCubes = (): void => this.#collection.setEventMode('none')

	#handleEnableCubes = (): void => this.#collection.setEventMode('dynamic')
}
