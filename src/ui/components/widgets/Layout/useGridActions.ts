import { updateGridCell } from './utils'

type UseGridActionsReturn = {
	handleExpand: (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		direction: 'right' | 'bottom'
	) => void
	handleShrink: (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		direction: 'right' | 'bottom'
	) => void
	handleTileClick: (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		setDoor: (door: { x: number; y: number; z: number }) => void,
		setIsDoorMode: (value: boolean) => void,
		isDoorMode: boolean,
		x: number,
		y: number
	) => void
	handleTileRightClick: (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		x: number,
		y: number
	) => void
}

export const useGridActions = (): UseGridActionsReturn => {
	const handleExpand = (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		direction: 'right' | 'bottom'
	): void => {
		if (grid.length === 0) {
			setGrid([[0]])
			return
		}

		const newGrid =
			direction === 'right'
				? grid.map(row => [...row, 0])
				: [...grid, Array(grid[0].length).fill(0)]

		setGrid(newGrid)
	}

	const handleShrink = (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		direction: 'right' | 'bottom'
	): void => {
		if (grid.length === 0) return

		const canShrink =
			direction === 'right' ? grid[0].length > 1 : grid.length > 1
		if (!canShrink) return

		const newGrid =
			direction === 'right'
				? grid.map(row => row.slice(0, -1))
				: grid.slice(0, -1)

		setGrid(newGrid)
	}

	const placeDoor = (
		grid: number[][],
		setDoor: (door: { x: number; y: number; z: number }) => void,
		setIsDoorMode: (value: boolean) => void,
		x: number,
		y: number
	): void => {
		const height = grid[x]?.[y]
		if (height < 0) return

		setDoor({ x, y, z: height })
		setIsDoorMode(false)
	}

	const incrementTile = (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		x: number,
		y: number
	): void =>
		setGrid(
			updateGridCell(grid, x, y, current =>
				current === -1 ? 0 : current + 1
			)
		)

	const handleTileClick = (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		setDoor: (door: { x: number; y: number; z: number }) => void,
		setIsDoorMode: (value: boolean) => void,
		isDoorMode: boolean,
		x: number,
		y: number
	): void => {
		if (isDoorMode) return placeDoor(grid, setDoor, setIsDoorMode, x, y)

		incrementTile(grid, setGrid, x, y)
	}

	const handleTileRightClick = (
		grid: number[][],
		setGrid: (grid: number[][]) => void,
		x: number,
		y: number
	): void =>
		setGrid(
			updateGridCell(grid, x, y, current =>
				current <= 0 ? -1 : current - 1
			)
		)

	return {
		handleExpand,
		handleShrink,
		handleTileClick,
		handleTileRightClick
	}
}
