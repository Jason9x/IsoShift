import { useEffect, useRef } from 'preact/hooks'
import { currentRoom } from '@/ui/store/rooms'
import type { Room } from '@/ui/store/rooms/types'
import { createGridFromRoom } from './utils'

type SyncSetters = {
	setDraftGrid: (grid: number[][]) => void
	setDraftWallHeight: (value: number) => void
	setDraftWallThickness: (value: number) => void
	setDraftTileThickness: (value: number) => void
	setDraftDoor: (door?: { x: number; y: number; z: number }) => void
}

export const useRoomSync = (
	setters: SyncSetters
): {
	syncFromRoom: (room: Room) => void
} => {
	const room = currentRoom()
	const lastSyncedRoomName = useRef<string | undefined>(room?.name)

	const syncFromRoom = (room: Room): void => {
		setters.setDraftGrid(createGridFromRoom(room))
		setters.setDraftWallHeight(room.wallHeight ?? 3)
		setters.setDraftWallThickness(room.wallThickness ?? 1)
		setters.setDraftTileThickness(room.tileThickness ?? 1)
		setters.setDraftDoor(room.door)
	}

	useEffect(() => {
		if (!room || lastSyncedRoomName.current === room.name) return

		lastSyncedRoomName.current = room.name
		syncFromRoom(room)
	}, [room?.name])

	return { syncFromRoom }
}
