import { Container } from 'pixi.js'

import { TileMap, Cube, Avatar } from '@/core/modules'

import { recalculateAvatarPosition } from '@/core/modules/avatar/helpers'

import { Camera } from '@/core/engine/game'

import type { Point3D } from '@/core/utils/coordinates'

import type { CubeData } from '@/ui/store/rooms'

import {
	CubeCollection,
	CubeManager,
	CubeEventHandlers,
	TileMapEventHandlers,
	BlueprintManager,
	saveCubes,
	populateCubes
} from './layer'

import { sortByPosition } from './layer/helpers/utils'

export default class CubeLayer extends Container {
	readonly #data: CubeData[]
	readonly #collection: CubeCollection
	readonly #eventHandlers: CubeEventHandlers
	readonly #blueprintManager: BlueprintManager

	#avatar?: Avatar
	#cubeManager?: CubeManager
	#tileMapEventHandlers?: TileMapEventHandlers

	constructor(data: CubeData[] = []) {
		super()

		this.#data = data

		const cubes: Cube[] = []

		this.#collection = new CubeCollection(cubes)
		this.#blueprintManager = new BlueprintManager()
		this.#eventHandlers = new CubeEventHandlers(
			this.#collection,
			this,
			this.#finalizeOperation.bind(this)
		)
	}

	initialize(tileMap: TileMap, camera: Camera, avatar: Avatar): void {
		this.#avatar = avatar

		this.#cubeManager = new CubeManager(
			tileMap,
			this.#collection.findTallestAt.bind(this.#collection)
		)

		this.#eventHandlers.initialize(camera, avatar, tileMap)

		this.#tileMapEventHandlers = new TileMapEventHandlers(
			this.#collection,
			this.#eventHandlers,
			this.#cubeManager,
			this.#blueprintManager,
			this,
			this.#finalizeOperation.bind(this),
			this.adjustRenderingOrder.bind(this)
		)

		populateCubes(
			this.#data,
			this.#cubeManager,
			this.#eventHandlers,
			this.#collection,
			this
		)

		this.addChild(avatar.container)
		this.adjustRenderingOrder()

		this.#tileMapEventHandlers.setup(tileMap)

		recalculateAvatarPosition(avatar, this, tileMap, avatar =>
			this.adjustRenderingOrder(avatar)
		)
	}

	adjustRenderingOrder = (avatar?: Avatar): void => {
		const avatarToUse = avatar ?? this.#avatar
		const blueprint = this.#blueprintManager.cube

		const entities: (Cube | Avatar)[] = [
			...this.#collection.all,
			...(avatarToUse ? [avatarToUse] : []),
			...(blueprint ? [blueprint] : [])
		]

		entities
			.sort(sortByPosition)
			.forEach((entity, index) => (entity.container.zIndex = index))

		this.sortChildren()
	}

	findTallestCubeAt = (position: Point3D): Cube | null =>
		this.#collection.findTallestAt(position)

	#finalizeOperation(): void {
		if (!this.#avatar) return

		this.adjustRenderingOrder()
		saveCubes(this.#collection.all)
	}
}
