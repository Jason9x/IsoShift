import Camera from '../Camera'

import { TileMap, WallMap, CubeLayer, Avatar } from '@/core/modules'
import { Point3D } from '@/core/utils/coordinates'

import type { CubeData, TileColors, AvatarColors } from '@/ui/store/rooms'

export type RoomConfig = {
	grid: number[][]
	cubes: CubeData[]
	tileThickness: number
	wallHeight: number
	wallThickness: number
	wallsVisible: boolean
	door?: { x: number; y: number; z: number }
	tileColors?: TileColors
	wallColors?: { top?: number; left?: number; right?: number }
	avatarColors?: AvatarColors
}

export type Scene = {
	avatar: Avatar
	wallMap: WallMap
	layers: [WallMap, TileMap, CubeLayer]
}

export const createScene = (config: RoomConfig, camera: Camera): Scene => {
	const {
		grid,
		cubes,
		tileThickness,
		wallHeight,
		wallThickness,
		wallsVisible,
		door,
		tileColors,
		wallColors,
		avatarColors
	} = config

	const wallMap = new WallMap(wallsVisible)
	const tileMap = new TileMap(grid)
	const cubeLayer = new CubeLayer(cubes)
	const avatar = new Avatar(avatarColors)

	tileMap.generateTiles(tileThickness, tileColors)
	wallMap.generateFromGrid(grid, wallHeight, wallThickness, wallColors)

	const doorPosition = door ? new Point3D(door.x, door.y, door.z) : undefined

	avatar.initialize(tileMap, cubeLayer, doorPosition)
	cubeLayer.initialize(tileMap, camera, avatar)

	return { avatar, wallMap, layers: [wallMap, tileMap, cubeLayer] }
}
