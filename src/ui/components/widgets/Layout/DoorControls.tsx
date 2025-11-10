import type { JSX } from 'preact'

type DoorControlsProps = {
	isDoorMode: boolean
	onToggleDoorMode: () => void
	onClearDoor: () => void
	door?: { x: number; y: number; z: number }
}

const DoorControls = ({
	isDoorMode,
	onToggleDoorMode,
	onClearDoor,
	door
}: DoorControlsProps): JSX.Element => (
	<div className="block">
		<span className="mb-1 block text-xs text-gray-400">Door Position</span>

		<div className="flex gap-1">
			<button
				onClick={onToggleDoorMode}
				className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-all ${
					isDoorMode
						? 'bg-blue-600 hover:bg-blue-700'
						: 'bg-gray-800 hover:bg-gray-700'
				}`}
			>
				{isDoorMode ? 'Click Tile' : 'Set Door'}
			</button>

			{door && (
				<button
					onClick={onClearDoor}
					className="rounded bg-red-600/90 px-2 py-1 text-xs font-medium transition-all hover:bg-red-600"
				>
					Clear
				</button>
			)}
		</div>

		<div className="mt-1 h-4 text-xs text-gray-500">
			{door ? `At: (${door.x}, ${door.y}, ${door.z})` : 'No door set'}
		</div>
	</div>
)

export default DoorControls
