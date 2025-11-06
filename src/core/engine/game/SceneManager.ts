import { Container, Ticker } from 'pixi.js'
import { effect } from '@preact/signals'

import type Camera from './Camera'

import { TileMap, WallMap, CubeLayer, Avatar } from '@/core/modules'

import { currentRoom, type CubeData } from '@/ui/store/rooms'

type RoomConfig = {
	grid: number[][]
	cubes: CubeData[]
	tileThickness: number
	wallHeight: number
	wallThickness: number
	wallsVisible: boolean
}

export default class SceneManager {
	#avatar?: Avatar
	#layers?: Container[]
	#wallMap?: WallMap

	watchRoomChanges(camera: Camera): this {
		let previousGrid: number[][] | null = null

		const teardown = () => {
			if (!this.#layers || this.#layers.length === 0) return

			camera.viewport?.removeChild(...this.#layers)

			this.#layers = undefined
			this.#avatar = undefined
			this.#wallMap = undefined
		}

		effect(() => {
			const room = currentRoom()

			if (!room) {
				teardown()
				return
			}

			const config: RoomConfig = {
				grid: room.grid,
				cubes: room.cubes,
				tileThickness: room.tileThickness,
				wallHeight: room.wallHeight,
				wallThickness: room.wallThickness,
				wallsVisible: room.wallsVisible
			}

			if (!this.#layers) {
				previousGrid = room.grid
				this.#updateScene(camera, config)
				return
			}

			if (this.#wallMap) this.#wallMap.visible = config.wallsVisible

			if (previousGrid && previousGrid === room.grid) return

			previousGrid = room.grid

			this.#regenerateScene(camera, config)
		})

		return this
	}

	#initializeScene(camera: Camera, config: RoomConfig) {
		const {
			grid,
			cubes,
			tileThickness,
			wallHeight,
			wallThickness,
			wallsVisible
		} = config

		const wallMap = new WallMap(wallHeight, wallThickness, wallsVisible)
		const tileMap = new TileMap(grid)
		const cubeLayer = new CubeLayer(cubes)
		const avatar = new Avatar()

		wallMap.generateFromGrid(grid)

		wallMap.on('deselect-cube', () => {
			tileMap.emit('hide-blueprint')
			tileMap.emit('enable-cubes')
		})

		tileMap.initialize(avatar, tileThickness)
		cubeLayer.initialize(tileMap, camera, avatar)
		avatar.initialize(tileMap, cubeLayer)

		return { avatar, wallMap, layers: [wallMap, tileMap, cubeLayer] }
	}

	#regenerateScene(camera: Camera, config: RoomConfig) {
		this.#layers?.forEach(layer => camera.viewport?.removeChild(layer))

		this.#updateScene(camera, config)
	}

	#updateScene(camera: Camera, config: RoomConfig) {
		const { avatar, wallMap, layers } = this.#initializeScene(
			camera,
			config
		)


		this.#avatar = avatar
		this.#wallMap = wallMap
		this.#layers = layers


		camera.viewport?.addChild(...layers)
	}

	startTicker(): this {
		Ticker.shared.add(ticker => this.#avatar?.update(ticker.deltaTime))
		return this
	}
}
