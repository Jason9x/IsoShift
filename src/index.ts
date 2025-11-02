import './index.css'
import { TILE_GRID } from '@/modules/tile/constants'
import { Application } from 'pixi.js'

import { Client, Scene, Camera } from '@/engine/game'
import { TileMap, WallMap, Avatar, CubeMap } from '@/modules'
import { Pathfinder } from '@/engine/pathfinding'

const grid = TILE_GRID

const wallMap = new WallMap()
const camera = new Camera()
const application = new Application()

// Instantiate objects with their dependencies
const tileMap = new TileMap(grid, wallMap)
const cubeMap = new CubeMap()
const pathfinder = new Pathfinder(tileMap, cubeMap)
const avatar = new Avatar(tileMap, cubeMap, grid)

tileMap.setAvatar(avatar)
tileMap.setPathfinder(pathfinder)
cubeMap.setTileMap(tileMap)
cubeMap.setCamera(camera)
cubeMap.setAvatar(avatar)
avatar.setPathfinder(pathfinder)

void (async () => {
	const scene = new Scene(camera, tileMap, wallMap, cubeMap, avatar)
	new Client(application, scene)
})()
