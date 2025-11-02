import { currentRoom } from '../../store/room'

const Navigator = ({ isOpen }: { isOpen: boolean }) => (
	<>
		{isOpen && (
			<div className="pointer-events-auto absolute left-4 top-16 rounded-lg border border-gray-800/50 bg-gray-950/85 px-4 py-3 text-gray-200 shadow-2xl backdrop-blur-md">
				<h3 className="text-sm font-bold">Room</h3>
				<p className="text-lg">{currentRoom.value}</p>
			</div>
		)}
	</>
)

export default Navigator
