import { Application, Point, Ticker, TextureStyle } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

import type { Camera } from '@/engine/game'
import type { TileMap } from '@/modules/tile'
import type { WallMap } from '@/modules/wall'
import type { CubeMap } from '@/modules/cube'
import type { Avatar } from '@/modules/avatar'

import { Cube } from '@/modules'
import { Point3D, cartesianToIsometric } from '@/utils/coordinates'

export default class Scene {
	readonly #camera: Camera
	readonly #tileMap: TileMap
	readonly #wallMap: WallMap
	readonly #cubeMap: CubeMap
	readonly #avatar: Avatar
	#viewport?: Viewport

	constructor(
		camera: Camera,
		tileMap: TileMap,
		wallMap: WallMap,
		cubeMap: CubeMap,
		avatar: Avatar,
	) {
		this.#camera = camera
		this.#tileMap = tileMap
		this.#wallMap = wallMap
		this.#cubeMap = cubeMap
		this.#avatar = avatar
	}

	centerStage({ screen }: Application) {
		if (!this.#viewport) return
		const centerPosition = new Point(screen.width / 2, screen.height / 2)
		this.#viewport.position.copyFrom(centerPosition)
	}

	initialize(application: Application) {
		TextureStyle.defaultOptions.scaleMode = 'nearest'

		this.#viewport = this.#camera.setupEventListeners(application)
		application.stage.addChild(this.#viewport)

		this.#initializeTileMap()
		this.#initializeMockedCubes()
		this.#initializeAvatar()

		this.#addObjectsToViewport()

		this.centerStage(application)
		this.#startTicker()

		this.#sortEntitiesByPosition()
	}

	#initializeTileMap = () => this.#tileMap.generate()

	#initializeMockedCubes = () => {
		this.#cubeMap.populateSceneWithCubes()
		this.#cubeMap.sortCubesByPosition()
	}

	#initializeAvatar() {
		this.#avatar.initialize()

		this.#cubeMap.addChild(this.#avatar.container)
	}

	#addObjectsToViewport = () => {
		if (!this.#viewport) return
		this.#viewport.addChild(
			this.#wallMap,
			this.#tileMap,
			this.#cubeMap,
		)
	}

	#sortEntitiesByPosition() {
		const sortedEntities = [...this.#cubeMap.cubes, this.#avatar]

		sortedEntities.sort((entityA, entityB) => {
			let positionA: Point3D | undefined
			let positionB: Point3D | undefined

			if (entityA instanceof Cube) {
				positionA = entityA.currentTile?.position
			} else {
				positionA = entityA.currentTile?.position
			}

			if (entityB instanceof Cube) {
				positionB = entityB.currentTile?.position
			} else {
				positionB = entityB.currentTile?.position
			}

			if (!positionA || !positionB) {
				console.warn('Entity position undefined during depth sorting')
				return 0
			}

			const entityAIsometric = cartesianToIsometric(positionA)
			const entityBIsometric = cartesianToIsometric(positionB)

			const verticalComparison = entityAIsometric.y - entityBIsometric.y

			return verticalComparison !== 0
				? verticalComparison
				: entityAIsometric.x - entityBIsometric.x
		})

		sortedEntities.forEach(
			(entity, index) => (entity.container.zIndex = index),
		)
	}

	#startTicker = () => Ticker.shared.add(this.#update, this)

	#update = (ticker: Ticker) => this.#avatar.update(ticker.deltaTime)
}
