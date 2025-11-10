import type { Room } from '@/ui/store/rooms/types'
import { MIN_VALUE } from './constants'

export const clamp = (value: number, min: number, max?: number): number => {
	const clamped = Math.max(min, value)
	return max !== undefined ? Math.min(max, clamped) : clamped
}

export const createGridFromRoom = (roomData: Room): number[][] =>
	roomData.grid && roomData.grid.length > 0
		? roomData.grid.map(row => [...row])
		: [[0]]

export const parseInputValue = (
	input: HTMLInputElement | null,
	current: number,
	max?: number
): number => {
	if (!input?.value) return clamp(current, MIN_VALUE, max)
	const parsed = +input.value
	return isNaN(parsed)
		? clamp(current, MIN_VALUE, max)
		: clamp(parsed, MIN_VALUE, max)
}

export const updateGridCell = (
	grid: number[][],
	x: number,
	y: number,
	updater: (current: number) => number
): number[][] => {
	const current = grid[x]?.[y]
	if (typeof current !== 'number') return grid

	const newGrid = grid.map(row => [...row])
	newGrid[x][y] = updater(current)
	return newGrid
}
