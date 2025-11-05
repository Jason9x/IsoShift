import { signal, effect } from '@preact/signals'

import { loadFromStorage } from '../storage'
import type { Room } from './types'
import { DEFAULT_ROOM } from './types'

const loadedRooms = loadFromStorage('rooms', [DEFAULT_ROOM])

export const rooms = signal<Room[]>(
	loadedRooms.map(room => ({
		...room,
		cubes: room.cubes || [],
	}))
)

export const currentRoomIndex = signal<number>(
	loadFromStorage('currentRoomIndex', 0)
)

effect(() => localStorage.setItem('rooms', JSON.stringify(rooms.value)))
effect(() =>
	localStorage.setItem(
		'currentRoomIndex',
		JSON.stringify(currentRoomIndex.value)
	)
)

export const currentRoom = (): Room | undefined => {
	if (rooms.value.length === 0) return

	return rooms.value[currentRoomIndex.value]
}

export const updateRoom = (room: Partial<Room>): void => {
	const updated = [...rooms.value]
	const current = currentRoom()

	if (!current) return

	updated[currentRoomIndex.value] = { ...current, ...room }
	rooms.value = updated
}

export const addRoom = (room: Room): Room[] => {
	rooms.value = [...rooms.value, room]
	currentRoomIndex.value = rooms.value.length - 1

	return rooms.value
}

export const deleteRoom = (index: number): void => {
	if (rooms.value.length <= 1) return

	rooms.value = rooms.value.filter((_, i) => i !== index)

	if (currentRoomIndex.value >= rooms.value.length)
		currentRoomIndex.value = rooms.value.length - 1
}

export const switchRoom = (index: number): number =>
	(currentRoomIndex.value = index)

export const deleteAllRooms = (): void => {
	rooms.value = []
	currentRoomIndex.value = 0
}
