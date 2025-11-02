import { Application } from 'pixi.js'

import { Client, Camera } from '@/core/engine/game'
import { TileMap, WallMap, Avatar, CubeLayer } from '@/core/modules'
import { Pathfinder } from '@/core/engine/pathfinding'
import { TILE_GRID } from '@/core/modules/tile/constants'

export default class ClientFactory {
	static create(application: Application) {
		const camera = new Camera()
		const wallMap = new WallMap()
		const tileMap = new TileMap(TILE_GRID)
		const cubeLayer = new CubeLayer()
		const avatar = new Avatar(tileMap, cubeLayer)
		const pathfinder = new Pathfinder(tileMap, cubeLayer)

		tileMap.initialize(wallMap, avatar, pathfinder)
		cubeLayer.initialize(tileMap, camera, avatar)
		avatar.initialize(pathfinder)

		return new Client(application, camera, avatar, [
			wallMap,
			tileMap,
			cubeLayer,
		])
	}
}
