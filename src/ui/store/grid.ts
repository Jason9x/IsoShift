import { signal, effect } from '@preact/signals'
import { loadFromStorage } from './storage'

const DEFAULT_GRID = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
]

export const grid = signal<number[][]>(loadFromStorage('grid', DEFAULT_GRID))
export const wallHeight = signal<number>(loadFromStorage('wallHeight', 3))
export const wallThickness = signal<number>(loadFromStorage('wallThickness', 1))

effect(() => localStorage.setItem('grid', JSON.stringify(grid.value)))
effect(() =>
	localStorage.setItem('wallHeight', JSON.stringify(wallHeight.value)),
)
effect(() =>
	localStorage.setItem('wallThickness', JSON.stringify(wallThickness.value)),
)

export const resetGrid = () => {
	grid.value = DEFAULT_GRID
	wallHeight.value = 3
	wallThickness.value = 1
}
