export type CubeData = {
	position: { x: number; y: number; z: number }
	size: number
	flipped?: boolean
	colors?: {
		top?: number
		left?: number
		right?: number
	}
}

export type TileColors = {
	surface?: number
	leftBorder?: number
	rightBorder?: number
}

export type AvatarColors = {
	top?: number
	left?: number
	right?: number
}

export type Room = {
	name: string
	description: string
	grid: number[][]
	wallHeight: number
	wallThickness: number
	tileThickness: number
	wallsVisible: boolean
	cubes: CubeData[]
	door?: { x: number; y: number; z: number }
	tileColors?: TileColors
	wallColors?: { top?: number; left?: number; right?: number }
	avatarColors?: AvatarColors
}

export const DEFAULT_ROOM: Room = {
	name: 'Lobby',
	description: 'Main entrance',
	grid: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	],
	wallHeight: 3,
	wallThickness: 1,
	tileThickness: 6,
	wallsVisible: true,
	door: { x: 0, y: 0, z: 0 },
	cubes: [
		{ position: { x: 2, y: 0, z: 0 }, size: 32 },
		{ position: { x: 3, y: 0, z: 0 }, size: 32 },
		{ position: { x: 0, y: 2, z: 0 }, size: 16 },
		{ position: { x: 0, y: 6, z: 0 }, size: 24 },
		{ position: { x: 0, y: 5, z: 0 }, size: 24 },
		{ position: { x: 0, y: 4, z: 0 }, size: 24 }
	]
}

export const ROOM_TEMPLATES: Room[] = [
	{
		name: 'Tiny Room',
		description: '5×5 compact space',
		grid: Array.from({ length: 5 }, () =>
			Array.from({ length: 5 }, () => 0)
		),
		wallHeight: 3,
		wallThickness: 3,
		tileThickness: 3,
		wallsVisible: true,
		door: { x: 0, y: 0, z: 0 },
		cubes: []
	},
	{
		name: 'Small Room',
		description: '6×7 cozy area',
		grid: Array.from({ length: 6 }, () =>
			Array.from({ length: 7 }, () => 0)
		),
		wallHeight: 3,
		wallThickness: 4,
		tileThickness: 4,
		wallsVisible: true,
		door: { x: 0, y: 0, z: 0 },
		cubes: []
	},
	{
		name: 'Medium Room',
		description: '8×8 with tall walls',
		grid: Array.from({ length: 8 }, () =>
			Array.from({ length: 8 }, () => 0)
		),
		wallHeight: 6,
		wallThickness: 5,
		tileThickness: 5,
		wallsVisible: true,
		door: { x: 0, y: 0, z: 0 },
		cubes: []
	},
	{
		name: 'Large Room',
		description: '10×10 spacious hall',
		grid: Array.from({ length: 10 }, () =>
			Array.from({ length: 10 }, () => 0)
		),
		wallHeight: 8,
		wallThickness: 6,
		tileThickness: 6,
		wallsVisible: true,
		door: { x: 0, y: 0, z: 0 },
		cubes: []
	}
]
