import { useEffect, useState } from 'preact/hooks'
import type { JSX } from 'preact'

import { currentRoom, updateRoom } from '@/ui/store/rooms'

export type UseLayoutEditorReturn = {
	grid?: number[][]
	wallHeight?: number
	wallThickness?: number
	tileThickness?: number
	door?: { x: number; y: number; z: number }

	selectingDoor: boolean
	toggleSelectingDoor: () => void

	handleTileClick: (
		x: number,
		y: number,
		e?: JSX.TargetedMouseEvent<HTMLButtonElement>
	) => void
	handleTileRightClick: (e: MouseEvent, x: number, y: number) => void

	expand: (dir: 'right' | 'bottom') => void
	shrink: (dir: 'right' | 'bottom') => void

	setWallHeight: (n?: number) => void
	setWallThickness: (n?: number) => void
	setTileThickness: (n?: number) => void

	reset: () => void
	save: () => void
}

const useLayoutEditor = (): UseLayoutEditorReturn => {
	const room = currentRoom()

	const [grid, setGrid] = useState(room?.grid)
	const [wallHeight, setWallHeight] = useState(room?.wallHeight)
	const [wallThickness, setWallThickness] = useState(room?.wallThickness)
	const [tileThickness, setTileThickness] = useState(room?.tileThickness)
	const [door, setDoor] = useState(room?.door)

	const [selectingDoor, setSelectingDoor] = useState(false)

	useEffect(() => {
		if (!room) return
		setGrid(room.grid)
		setWallHeight(room.wallHeight)
		setWallThickness(room.wallThickness)
		setTileThickness(room.tileThickness)
		setDoor(room.door)
	}, [room])

	const handleTileClick = (x: number, y: number) => {
		if (!grid) return

		if (selectingDoor) {
			const h = grid[x]?.[y] ?? 0
			setDoor({ x, y, z: Math.max(0, h) })
			setSelectingDoor(false)
			return
		}

		const current = grid[x]?.[y]
		const newGrid = grid.map(row => [...row])

		if (typeof current !== 'number') return

		newGrid[x][y] = current === -1 ? 0 : current + 1
		setGrid(newGrid)
	}

	const handleTileRightClick = (event: MouseEvent, x: number, y: number) => {
		event.preventDefault()
		if (!grid) return

		const current = grid[x][y]
		const newGrid = grid.map(row => [...row])

		newGrid[x][y] = current <= 0 ? -1 : current - 1
		setGrid(newGrid)
	}

	const expand = (dir: 'right' | 'bottom') => {
		if (!grid || grid.length === 0) return
		if (dir === 'right') setGrid(grid.map(row => [...row, 0]))
		else setGrid([...grid, Array(grid[0].length).fill(0)])
	}

	const shrink = (dir: 'right' | 'bottom') => {
		if (!grid) return
		if (dir === 'right' && grid[0].length > 1)
			setGrid(grid.map(row => row.slice(0, -1)))
		else if (dir === 'bottom' && grid.length > 1) setGrid(grid.slice(0, -1))
	}

	const reset = () => {
		setGrid(room?.grid)
		setWallHeight(room?.wallHeight)
		setWallThickness(room?.wallThickness)
		setTileThickness(room?.tileThickness)
		setDoor(room?.door)
		setSelectingDoor(false)
	}

	const save = () => {
		updateRoom({
			grid,
			wallHeight,
			wallThickness,
			tileThickness,
			door
		})
	}

	return {
		grid,
		wallHeight,
		wallThickness,
		tileThickness,
		door,

		selectingDoor,
		toggleSelectingDoor: () => setSelectingDoor(v => !v),

		handleTileClick,
		handleTileRightClick,

		expand,
		shrink,

		setWallHeight,
		setWallThickness,
		setTileThickness,

		reset,
		save
	}
}

export default useLayoutEditor
