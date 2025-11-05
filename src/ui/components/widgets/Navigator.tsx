import { useState } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import useDraggable from '@/ui/hooks/useDraggable'

export const DELETE_ALL_REQUIRES_CONFIRM = true

import {
	rooms,
	currentRoomIndex,
	switchRoom,
	addRoom,
	ROOM_TEMPLATES,
	TEMPLATES,
	type Room,
	deleteAllRooms,
} from '@/ui/store/rooms'

type NavigatorProps = {
	isOpen: boolean
}

const Navigator = ({ isOpen }: NavigatorProps): JSX.Element | null => {
	const hasRooms = rooms.value.length > 0
	const [tab, setTab] = useState<'rooms' | 'create'>(
		hasRooms ? 'rooms' : 'create'
	)

	const { style, handleProps } = useDraggable({ left: 16, top: 64 })

	if (!isOpen) return null

	const handleCreateRoom = (templateIndex: number): void => {
		const template = ROOM_TEMPLATES[templateIndex]
		const newRoom: Room = {
			name: `Room ${rooms.value.length + 1}`,
			description: 'New room',
			...template,
		}

		addRoom(newRoom)

		setTab('rooms')
	}

	const handleDeleteAllRoomsConfirmation = (): void => {
		const proceed =
			!DELETE_ALL_REQUIRES_CONFIRM ||
			confirm(
				'Are you sure you want to delete all rooms? This action cannot be undone.'
			)

		if (proceed) {
			deleteAllRooms()
			setTab('create')
		}
	}

	return (
		<div className="pointer-events-auto" style={style}>
			<div
				{...handleProps}
				className="w-64 cursor-grab rounded-lg border border-gray-800/50 bg-gray-950/85 p-4 text-gray-200 shadow-2xl backdrop-blur-md active:cursor-grabbing"
			>
				<div className="mb-3 flex items-center gap-2">
					{rooms.value.length > 0 && (
						<button
							onClick={() => setTab('rooms')}
							className={`flex-1 rounded px-3 py-1.5 text-sm transition-all ${tab === 'rooms' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
						>
							My Rooms
						</button>
					)}

					<button
						onClick={() => setTab('create')}
						className={`flex-1 rounded px-3 py-1.5 text-sm transition-all ${tab === 'create' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
					>
						Create
					</button>
				</div>

				{tab === 'rooms' && rooms.value.length > 0 && (
					<div className="max-h-64 space-y-2 overflow-y-auto">
						<button
							onClick={handleDeleteAllRoomsConfirmation}
							className="w-full rounded bg-red-600 px-3 py-2 text-sm transition-all hover:bg-red-700"
						>
							Delete All Rooms
						</button>

						{rooms.value.map((room, index) => (
							<div
								key={index}
								className="flex items-center justify-between rounded bg-gray-800/50 p-2"
							>
								<div className="flex-1">
									<p className="text-sm font-medium">
										{room.name}
									</p>
									<p className="text-xs text-gray-400">
										{room.description}
									</p>
								</div>

								<button
									onClick={() => switchRoom(index)}
									className={`rounded px-2 py-1 text-xs transition-all ${currentRoomIndex.value === index ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
								>
									{currentRoomIndex.value === index
										? 'Active'
										: 'Join'}
								</button>
							</div>
						))}
					</div>
				)}

				{tab === 'create' && (
					<div className="space-y-2">
						{TEMPLATES.map((template, index) => (
							<button
								key={index}
								onClick={() => handleCreateRoom(index)}
								className="w-full rounded bg-gray-800 px-3 py-2 text-left text-sm transition-all hover:bg-gray-700"
							>
								<p className="font-medium">{template.name}</p>
								<p className="text-xs text-gray-400">
									{template.description}
								</p>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Navigator
