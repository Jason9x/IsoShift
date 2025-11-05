export type CubeData = {
	position: { x: number; y: number; z: number }
	size: number
	colors?: {
		top?: number
		left?: number
		right?: number
	}
}

export type Room = {
	name: string
	description: string
	grid: number[][]
	wallHeight: number
	wallThickness: number
	tileWidth: number
	tileHeight: number
	tileThickness: number
	cubes: CubeData[]
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
		[0, 0, 0, 0, 0, 0, 0],
	],
	wallHeight: 3,
	wallThickness: 1,
	tileWidth: 64,
	tileHeight: 32,
	tileThickness: 6,
	cubes: [
		{ position: { x: 2, y: 0, z: 0 }, size: 32 },
		{ position: { x: 3, y: 0, z: 0 }, size: 32 },
		{ position: { x: 0, y: 2, z: 0 }, size: 16 },
		{ position: { x: 0, y: 6, z: 0 }, size: 24 },
		{ position: { x: 0, y: 5, z: 0 }, size: 24 },
		{ position: { x: 0, y: 4, z: 0 }, size: 24 },
	],
}

export const TEMPLATES = [
	{ name: 'Tiny Room', description: '5x5 grid, compact' },
	{ name: 'Small Room', description: '6x7 grid' },
	{ name: 'Medium Room', description: '8x8 grid, tall walls' },
	{ name: 'Large Room', description: '10x10 grid, extra tall' },
] as const

export const ROOM_TEMPLATES: Omit<Room, 'name' | 'description'>[] = [
	{
		grid: Array.from({ length: 6 }, () =>
			Array.from({ length: 7 }, () => 0)
		),
		wallHeight: 3,
		wallThickness: 1,
		tileWidth: 64,
		tileHeight: 32,
		tileThickness: 6,
		cubes: [],
	},
	{
		grid: Array.from({ length: 8 }, () =>
			Array.from({ length: 8 }, () => 0)
		),
		wallHeight: 4,
		wallThickness: 2,
		tileWidth: 64,
		tileHeight: 32,
		tileThickness: 6,
		cubes: [],
	},
	{
		grid: Array.from({ length: 10 }, () =>
			Array.from({ length: 10 }, () => 0)
		),
		wallHeight: 5,
		wallThickness: 2,
		tileWidth: 64,
		tileHeight: 32,
		tileThickness: 6,
		cubes: [],
	},
	{
		grid: Array.from({ length: 5 }, () =>
			Array.from({ length: 5 }, () => 0)
		),
		wallHeight: 2,
		wallThickness: 1,
		tileWidth: 64,
		tileHeight: 32,
		tileThickness: 6,
		cubes: [],
	},
]
