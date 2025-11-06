import { useState, useRef, useEffect } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'

import { useDraggable } from '@/ui/hooks'

import {
	rooms,
	addRoom,
	ROOM_TEMPLATES,
	type Room,
	deleteAllRooms
} from '@/ui/store/rooms'

import RoomsList from './RoomsList'
import CreateList from './CreateList'

type NavigatorProps = {
	isOpen: boolean
	zIndex: number
	onFocus: () => void
}

type TabKey = 'rooms' | 'create'

const Navigator = ({
	isOpen,
	zIndex,
	onFocus
}: NavigatorProps): JSX.Element | null => {
	const hasRooms = rooms.value.length > 0
	const [tab, setTab] = useState<TabKey>(hasRooms ? 'rooms' : 'create')

	useEffect(() => {
		if (!rooms.value.length) setTab('create')
	}, [rooms.value.length])

	const ref = useRef<HTMLDivElement>(null)

	const { handleProps } = useDraggable({
		elementRef: ref
	})

	if (!isOpen) return null

	const handleCreateRoom = (templateIndex: number): void => {
		const template = ROOM_TEMPLATES[templateIndex]
		const newRoom: Room = {
			...template,
			name: `${template.name} ${rooms.value.length + 1}`
		}

		addRoom(newRoom)
		setTab('rooms')
	}

	const handleDeleteAllRoomsConfirmation = (): void => {
		const confirmed = confirm(
			'Are you sure you want to delete all rooms? This action cannot be undone.'
		)

		if (confirmed) {
			deleteAllRooms()
			setTab('create')
		}
	}

	return (
		<div
			ref={ref}
			{...handleProps}
			onMouseDown={onFocus}
			style={{ zIndex }}
			className="pointer-events-auto fixed left-5 top-5 w-64 cursor-grab rounded-lg border border-gray-800/50 bg-gray-950/90 p-4 text-gray-200 shadow-2xl backdrop-blur-md active:cursor-grabbing"
		>
			<div className="mb-3 flex items-center gap-2">
				{hasRooms && (
					<button
						onClick={() => setTab('rooms')}
						className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-all ${tab === 'rooms' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
					>
						My Rooms
					</button>
				)}

				<button
					onClick={() => setTab('create')}
					className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-all ${tab === 'create' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
				>
					Create
				</button>
			</div>

			<div className="h-64">
				{tab === 'rooms' && hasRooms && (
					<RoomsList onDeleteAll={handleDeleteAllRoomsConfirmation} />
				)}

				{tab === 'create' && (
					<div className="flex h-full items-center overflow-y-auto pr-1">
						<CreateList onCreate={handleCreateRoom} />
					</div>
				)}
			</div>
		</div>
	)
}

export default Navigator
