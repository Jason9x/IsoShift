import { signal } from '@preact/signals'

type CubeMenuState = {
	x: number
	y: number
	onRotate: () => void
	onMove: () => void
	onDelete: () => void
} | null

export const cubeMenuState = signal<CubeMenuState>(null)
