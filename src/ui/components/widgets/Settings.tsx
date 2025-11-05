import { useState } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'

import {
	currentRoom,
	updateRoom,
	deleteRoom,
	currentRoomIndex,
	rooms,
} from '@/ui/store/rooms'

type SettingsProps = {
	isOpen: boolean
	onClose: () => void
}

const Settings = ({ isOpen, onClose }: SettingsProps): JSX.Element => {
	const room = currentRoom()
	const [roomName, setRoomName] = useState(room?.name)
	const [roomDescription, setRoomDescription] = useState(room?.description)

	const handleSave = () => {
		updateRoom({ name: roomName, description: roomDescription })
		onClose()
	}

	const handleDelete = () => {
		if (rooms.value.length === 1) {
			alert('Cannot delete the last room')
			return
		}

		if (confirm(`Delete "${room?.name}"?`)) {
			deleteRoom(currentRoomIndex.value)
			onClose()
		}
	}

	return (
		<>
			{isOpen && (
				<div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div className="w-72 rounded-lg border border-gray-800/50 bg-gray-950/85 p-4 shadow-2xl backdrop-blur-md">
						<h2 className="mb-3 text-lg font-bold text-gray-200">
							Settings
						</h2>

						<label className="mb-3 block">
							<span className="text-sm text-gray-200">
								Room Name
							</span>

							<input
								type="text"
								value={roomName}
								onInput={event =>
									setRoomName(
										(event.target as HTMLInputElement).value
									)
								}
								className="mt-1 block w-full rounded border border-gray-700 bg-gray-900/50 px-2 py-1.5 text-sm text-gray-200 focus:border-gray-600 focus:outline-none"
							/>
						</label>

						<label className="mb-3 block">
							<span className="text-sm text-gray-200">
								Description
							</span>

							<input
								type="text"
								value={roomDescription}
								onInput={e =>
									setRoomDescription(
										(e.target as HTMLInputElement).value
									)
								}
								className="mt-1 block w-full rounded border border-gray-700 bg-gray-900/50 px-2 py-1.5 text-sm text-gray-200 focus:border-gray-600 focus:outline-none"
							/>
						</label>

						<button
							onClick={handleDelete}
							className="mb-3 w-full rounded bg-red-900/50 px-3 py-1.5 text-sm text-gray-200 transition-all hover:bg-red-800/50"
						>
							Delete Room
						</button>

						<div className="flex gap-2">
							<button
								onClick={handleSave}
								className="flex-1 rounded bg-gray-700 px-3 py-1.5 text-sm text-gray-200 transition-all hover:bg-gray-600"
							>
								Save
							</button>
							<button
								onClick={onClose}
								className="flex-1 rounded bg-gray-800 px-3 py-1.5 text-sm text-gray-200 transition-all hover:bg-gray-700"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Settings
