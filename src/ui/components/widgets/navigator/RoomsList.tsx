import type { JSX } from 'preact'
import { rooms, currentRoomIndex, switchRoom } from '@/ui/store/rooms'

type RoomsListProps = {
	onDeleteAll: () => void
}

const RoomsList = ({ onDeleteAll }: RoomsListProps): JSX.Element | null => {
	if (rooms.value.length === 0) return null

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 space-y-2 overflow-y-auto pr-1">
				{rooms.value.map((room, index) => (
					<div
						key={index}
						className="flex items-center justify-between rounded bg-gray-800/50 p-2.5"
					>
						<div className="flex-1">
							<p className="text-sm font-medium">{room.name}</p>
							<p className="text-xs text-gray-400">
								{room.description}
							</p>
						</div>

						<button
							onClick={() => switchRoom(index)}
							className={`rounded-md px-3 py-1 text-xs font-medium tracking-wide transition-all ${
								currentRoomIndex.value === index
									? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20'
									: 'bg-gray-700/90 hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-700/20'
							}`}
						>
							{currentRoomIndex.value === index
								? 'Active'
								: 'Join'}
						</button>
					</div>
				))}
			</div>

			<button
				onClick={onDeleteAll}
				className="mt-2 w-full shrink-0 rounded-md bg-red-600/90 px-3 py-1.5 text-xs font-medium transition-all hover:bg-red-600"
			>
				Delete All Rooms
			</button>
		</div>
	)
}

export default RoomsList
