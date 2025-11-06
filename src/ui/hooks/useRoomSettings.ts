import { useState, useEffect } from 'preact/hooks'
import {
	currentRoom,
	updateRoom,
	deleteRoom,
	currentRoomIndex
} from '@/ui/store/rooms'

export type UseRoomSettingsReturn = {
	roomName: string
	setRoomName: (value: string) => void
	roomDescription: string
	setRoomDescription: (value: string) => void
	wallsVisible: boolean
	toggleWalls: () => void
	save: () => void
	deleteWithConfirm: () => void
}

const useRoomSettings = (): UseRoomSettingsReturn => {
	const room = currentRoom()

	const [roomName, setRoomName] = useState(room?.name ?? '')
	const [roomDescription, setRoomDescription] = useState(
		room?.description ?? ''
	)
	const [wallsVisible, setWallsVisible] = useState(room?.wallsVisible ?? true)

	useEffect(() => {
		if (room) {
			setRoomName(room.name)
			setRoomDescription(room.description)
			setWallsVisible(room.wallsVisible)
		}
	}, [room])

	const save = () => {
		updateRoom({
			name: roomName,
			description: roomDescription,
			wallsVisible
		})
	}

	const toggleWalls = () => {
		const newValue = !wallsVisible
		setWallsVisible(newValue)
		updateRoom({ wallsVisible: newValue })
	}

	const deleteWithConfirm = () => {
		const confirmed = confirm(
			`Are you sure you want to delete "${room?.name ?? 'this room'}"? This action cannot be undone.`
		)

		if (confirmed) deleteRoom(currentRoomIndex.value)
	}

	return {
		roomName,
		setRoomName,
		roomDescription,
		setRoomDescription,
		wallsVisible,
		toggleWalls,
		save,
		deleteWithConfirm
	}
}

export default useRoomSettings
