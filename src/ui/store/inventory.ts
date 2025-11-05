import { signal } from '@preact/signals'

type CubeType = {
	name: string
	size: number
}

export const CUBE_TYPES: CubeType[] = [
	{ name: 'Tiny Cube', size: 8 },
	{ name: 'Small Cube', size: 16 },
	{ name: 'Medium Cube', size: 24 },
	{ name: 'Large Cube', size: 32 },
]

export const selectedCube = signal<CubeType | null>(null)
