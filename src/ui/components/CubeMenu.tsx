import type { JSX } from 'preact/jsx-runtime'
import { cubeMenuState } from '../store/cubeMenu'

const CubeMenu = (): JSX.Element | null => {
	if (!cubeMenuState.value) return null

	const { x, y, onRotate, onMove, onDelete } = cubeMenuState.value
	const clearMenu = () => (cubeMenuState.value = null)

	const handleAction = (action: () => void) => {
		action()
		clearMenu()
	}

	return (
		<>
			<div
				className="pointer-events-auto fixed inset-0 z-40"
				onClick={clearMenu}
			/>

			<div
				className="pointer-events-auto fixed z-50 rounded-lg border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md"
				style={{ left: `${x}px`, top: `${y}px` }}
			>
				<button
					onClick={() => handleAction(onRotate)}
					className="block w-full px-4 py-2 text-left text-sm text-gray-200 transition-all hover:bg-gray-800"
				>
					🔄 Rotate
				</button>

				<button
					onClick={() => handleAction(onMove)}
					className="block w-full px-4 py-2 text-left text-sm text-gray-200 transition-all hover:bg-gray-800"
				>
					✋ Move
				</button>

				<button
					onClick={() => handleAction(onDelete)}
					className="block w-full px-4 py-2 text-left text-sm text-red-400 transition-all hover:bg-gray-800"
				>
					🗑️ Delete
				</button>
			</div>
		</>
	)
}

export default CubeMenu
