import { Application, BaseTexture, Point, SCALE_MODES, settings, Ticker } from 'pixi.js'

import { inject, injectable } from 'inversify'

import ICamera from '@/interfaces/game/ICamera'
import IScene from '@/interfaces/game/IScene'

import ITileMap from '@/interfaces/modules/ITileMap'
import IWallMap from '@/interfaces/modules/IWallMap'

import ICubeMap from '@/interfaces/modules/ICubeMap'
import IAvatar from '@/interfaces/modules/IAvatar'

@injectable()
export default class Scene implements IScene {
	readonly #camera: ICamera
	readonly #tileMap: ITileMap
	readonly #wallMap: IWallMap
	readonly #cubeMap: ICubeMap
	readonly #avatar: IAvatar

	constructor(
		@inject('ICamera') camera: ICamera,
		@inject('ITileMap') tileMap: ITileMap,
		@inject('IWallMap') wallMap: IWallMap,
		@inject('ICubeMap') cubeMap: ICubeMap,
		@inject('IAvatar') avatar: IAvatar
	) {
		this.#camera = camera
		this.#tileMap = tileMap
		this.#wallMap = wallMap
		this.#cubeMap = cubeMap
		this.#avatar = avatar
	}

	centerStage({ screen, stage }: Application) {
		const centerPosition = new Point(screen.width / 2, screen.height / 2)

		stage.position.copyFrom(centerPosition)
	}

	initialize(application: Application) {
		BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
		settings.ROUND_PIXELS = true

		this.#camera.setupEventListeners(application)

		this.#initializeTileMap()
		this.#initializeMockedCubes()
		this.#initializeAvatar()

		this.#addObjectsToStage(application)

		this.centerStage(application)
		this.#startTicker()
	}

	#initializeTileMap = () => this.#tileMap.generate()

	#initializeMockedCubes = () => {
		this.#cubeMap.populateSceneWithCubes()
		this.#cubeMap.sortCubesByPosition()
	}

	#initializeAvatar() {
		this.#avatar.initialize()
		this.#avatar.adjustRenderingOrder(this.#cubeMap.cubes)

		this.#cubeMap.container.addChild(this.#avatar.container)
	}

	#addObjectsToStage = ({ stage }: Application) =>
		stage.addChild(
			this.#wallMap.container,
			this.#tileMap.container,
			this.#cubeMap.container
		)

	#startTicker = () => Ticker.shared.add(this.#update.bind(this))

	#update = (delta: number) => this.#avatar.update(delta)
}
