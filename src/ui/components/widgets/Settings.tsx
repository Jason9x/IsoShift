import { useRef } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'

import { useDraggable, useRoomSettings } from '@/ui/hooks'

type SettingsProps = {
	isOpen: boolean
	zIndex: number
	onFocus: () => void
}

const Settings = ({
	isOpen,
	zIndex,
	onFocus
}: SettingsProps): JSX.Element | null => {
	const ref = useRef<HTMLDivElement>(null)

	const { handleProps } = useDraggable({
		elementRef: ref
	})

	const {
		roomName,
		setRoomName,
		roomDescription,
		setRoomDescription,
		wallsVisible,
		toggleWalls,
		save,
		deleteWithConfirm
	} = useRoomSettings()

	if (!isOpen) return null

	return (
		<div
			ref={ref}
			{...handleProps}
			onMouseDown={onFocus}
			style={{ zIndex }}
			className="pointer-events-auto fixed left-5 top-5 w-56 cursor-grab rounded-lg border border-gray-800/50 bg-gray-950/90 p-3 text-gray-200 shadow-2xl backdrop-blur-md active:cursor-grabbing"
		>
			<h2 className="mb-4 text-sm font-bold">Room Settings</h2>

			<label className="mb-3 block">
				<span className="mb-1.5 block text-xs text-gray-400">Name</span>

				<input
					type="text"
					value={roomName}
					onInput={event =>
						setRoomName((event.target as HTMLInputElement).value)
					}
					className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 focus:border-gray-600 focus:outline-none"
				/>
			</label>

			<label className="mb-3 block">
				<span className="mb-1.5 block text-xs text-gray-400">
					Description
				</span>

				<input
					type="text"
					value={roomDescription}
					onInput={event =>
						setRoomDescription(
							(event.target as HTMLInputElement).value
						)
					}
					className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 focus:border-gray-600 focus:outline-none"
				/>
			</label>

			<label className="mb-4 block">
				<span className="mb-1.5 block text-xs text-gray-400">
					Show Walls
				</span>

				<div className="flex cursor-pointer items-center gap-2 rounded border border-gray-700 bg-gray-900 px-2 py-1 transition-all hover:border-gray-600">
					<div
						onClick={toggleWalls}
						className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-all ${
							wallsVisible
								? 'border-blue-600 bg-blue-600'
								: 'border-gray-600 bg-gray-800 hover:border-gray-500'
						}`}
					>
						{wallsVisible && (
							<svg
								className="h-3 w-3 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={3}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</div>

					<span
						onClick={toggleWalls}
						className="text-xs text-gray-200"
					>
						{wallsVisible ? 'Visible' : 'Hidden'}
					</span>
				</div>
			</label>

			<button
				onClick={save}
				className="mb-2 w-full rounded-md bg-blue-600/90 px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
			>
				Save Changes
			</button>

			<button
				onClick={deleteWithConfirm}
				className="w-full rounded-md bg-red-600/90 px-3 py-1.5 text-xs font-medium transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/20"
			>
				Delete Room
			</button>
		</div>
	)
}

export default Settings
