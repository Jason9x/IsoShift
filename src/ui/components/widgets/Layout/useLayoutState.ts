import { useState } from 'preact/hooks'
import { currentRoom, updateRoom } from '@/ui/store/rooms'
import { useRoomSync } from './useRoomSync'
import { useGridActions } from './useGridActions'
import { parseInputValue, createGridFromRoom } from './utils'
import { MAX_THICKNESS } from './constants'

type UseLayoutStateReturn = {
	draftGrid: number[][]
	draftWallHeight: number
	draftWallThickness: number
	draftTileThickness: number
	draftDoor?: { x: number; y: number; z: number }
	isDoorMode: boolean
	setDraftWallHeight: (value: number) => void
	setDraftWallThickness: (value: number) => void
	setDraftTileThickness: (value: number) => void
	setDraftDoor: (door?: { x: number; y: number; z: number }) => void
	setIsDoorMode: (value: boolean) => void
	handleSave: (
		wallHeightRef: HTMLInputElement | null,
		wallThicknessRef: HTMLInputElement | null,
		tileThicknessRef: HTMLInputElement | null
	) => void
	handleReset: () => void
	handleExpand: (direction: 'right' | 'bottom') => void
	handleShrink: (direction: 'right' | 'bottom') => void
	handleTileClick: (x: number, y: number) => void
	handleTileRightClick: (x: number, y: number) => void
}

export const useLayoutState = (): UseLayoutStateReturn => {
	const room = currentRoom()

	const [draftGrid, setDraftGrid] = useState<number[][]>(() =>
		room ? createGridFromRoom(room) : [[0]]
	)
	const [draftWallHeight, setDraftWallHeight] = useState(
		room?.wallHeight ?? 3
	)
	const [draftWallThickness, setDraftWallThickness] = useState(
		room?.wallThickness ?? 1
	)
	const [draftTileThickness, setDraftTileThickness] = useState(
		room?.tileThickness ?? 1
	)
	const [draftDoor, setDraftDoor] = useState(room?.door)
	const [isDoorMode, setIsDoorMode] = useState(false)

	const { syncFromRoom } = useRoomSync({
		setDraftGrid,
		setDraftWallHeight,
		setDraftWallThickness,
		setDraftTileThickness,
		setDraftDoor
	})

	const {
		handleExpand: expandGrid,
		handleShrink: shrinkGrid,
		handleTileClick: clickTile,
		handleTileRightClick: rightClickTile
	} = useGridActions()

	const handleSave = (
		wallHeightRef: HTMLInputElement | null,
		wallThicknessRef: HTMLInputElement | null,
		tileThicknessRef: HTMLInputElement | null
	): void => {
		const wallHeight = parseInputValue(wallHeightRef, draftWallHeight)
		const wallThickness = parseInputValue(
			wallThicknessRef,
			draftWallThickness,
			MAX_THICKNESS
		)
		const tileThickness = parseInputValue(
			tileThicknessRef,
			draftTileThickness,
			MAX_THICKNESS
		)

		setDraftWallHeight(wallHeight)
		setDraftWallThickness(wallThickness)
		setDraftTileThickness(tileThickness)

		updateRoom({
			grid: draftGrid,
			wallHeight,
			wallThickness,
			tileThickness,
			door: draftDoor
		})
	}

	const handleReset = (): void => {
		if (!room) return

		syncFromRoom(room)
		setIsDoorMode(false)
	}

	const handleExpand = (direction: 'right' | 'bottom'): void =>
		expandGrid(draftGrid, setDraftGrid, direction)

	const handleShrink = (direction: 'right' | 'bottom'): void =>
		shrinkGrid(draftGrid, setDraftGrid, direction)

	const handleTileClick = (x: number, y: number): void =>
		clickTile(
			draftGrid,
			setDraftGrid,
			setDraftDoor,
			setIsDoorMode,
			isDoorMode,
			x,
			y
		)

	const handleTileRightClick = (x: number, y: number): void =>
		rightClickTile(draftGrid, setDraftGrid, x, y)

	return {
		draftGrid,
		draftWallHeight,
		draftWallThickness,
		draftTileThickness,
		draftDoor,
		isDoorMode,
		setDraftWallHeight,
		setDraftWallThickness,
		setDraftTileThickness,
		setDraftDoor,
		setIsDoorMode,
		handleSave,
		handleReset,
		handleExpand,
		handleShrink,
		handleTileClick,
		handleTileRightClick
	}
}
