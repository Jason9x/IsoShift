import type { Room } from '@/ui/store/rooms'

import type { RoomConfig } from './SceneInitializer'

export const createRoomConfig = (room: Room): RoomConfig => ({
	grid: room.grid,
	cubes: room.cubes,
	tileThickness: room.tileThickness,
	wallHeight: room.wallHeight,
	wallThickness: room.wallThickness,
	wallsVisible: room.wallsVisible,
	door: room.door,
	tileColors: room.tileColors,
	wallColors: room.wallColors,
	avatarColors: room.avatarColors
})

export const createRoomKey = (config: RoomConfig): string =>
	JSON.stringify({
		grid: config.grid,
		tileThickness: config.tileThickness,
		wallHeight: config.wallHeight,
		wallThickness: config.wallThickness,
		wallsVisible: config.wallsVisible,
		door: config.door
	})
