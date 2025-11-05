import { Container, Ticker } from 'pixi.js'
import { effect } from '@preact/signals'

import type Camera from './Camera'

import { TileMap, WallMap, CubeLayer, Avatar } from '@/core/modules'

import { currentRoom, type CubeData } from '@/ui/store/rooms'

export default class SceneManager {
	#avatar?: Avatar
	#layers?: Container[]

	watchRoomChanges(camera: Camera): this {
		let previousGrid: number[][] | null = null

		const teardown = () => {
			if (!this.#layers || this.#layers.length === 0) return

			camera.viewport?.removeChild(...this.#layers)

			this.#layers = undefined
			this.#avatar = undefined
		}

		effect(() => {
			const room = currentRoom()

			if (!room) {
				teardown()
				return
			}

			if (!this.#layers) {
				previousGrid = room.grid
				this.#updateScene(camera, room.grid, room.cubes)
				return
			}

			if (previousGrid && previousGrid === room.grid) return

			previousGrid = room.grid
			this.#regenerateScene(camera, room.grid, room.cubes)
		})

		return this
	}

	#initializeScene(camera: Camera, grid: number[][], cubes: CubeData[]) {
		const wallMap = new WallMap()
		const tileMap = new TileMap(grid)
		const cubeLayer = new CubeLayer(cubes)
		const avatar = new Avatar()

		tileMap.initialize(wallMap, avatar)
		cubeLayer.initialize(tileMap, camera, avatar)
		avatar.initialize(tileMap, cubeLayer)

		return { avatar, layers: [wallMap, tileMap, cubeLayer] }
	}

	#regenerateScene(camera: Camera, grid: number[][], cubes: CubeData[]) {
		this.#layers?.forEach(layer => camera.viewport?.removeChild(layer))

		this.#updateScene(camera, grid, cubes)
	}

	#updateScene(camera: Camera, grid: number[][], cubes: CubeData[]) {
		const { avatar, layers } = this.#initializeScene(camera, grid, cubes)

		this.#avatar = avatar
		this.#layers = layers

		camera.viewport?.addChild(...layers)
	}

	startTicker(): this {
		Ticker.shared.add(ticker => this.#avatar?.update(ticker.deltaTime))
		return this
	}
}
