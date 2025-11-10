import { effect } from '@preact/signals'

import type Camera from '../Camera'

import { createRoomConfig, createRoomKey } from './SceneConfig'
import { createScene, type RoomConfig } from './SceneInitializer'

import { currentRoom } from '@/ui/store/rooms'

export default class SceneManager {
	watchRoomChanges(camera: Camera): this {
		let previousKey: string | null = null

		effect(() => {
			const room = currentRoom()

			if (!room) {
				camera.viewport.removeChildren()
				return
			}

			const config = createRoomConfig(room)
			const key = createRoomKey(config)

			if (previousKey === key) return

			previousKey = key
			this.#updateScene(camera, config)
		})

		return this
	}

	#updateScene(camera: Camera, config: RoomConfig): void {
		if (camera.viewport.children.length > 0)
			camera.viewport.removeChildren()

		const scene = createScene(config, camera)
		const [wallMap, tileMap] = scene.layers

		tileMap
			.setupAvatarMovement(scene.avatar)
			.setupCameraHoverTracking(camera)
		wallMap.setupTileMapEvents(tileMap)

		camera.viewport?.addChild(...scene.layers)
	}
}
