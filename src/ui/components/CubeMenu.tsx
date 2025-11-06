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
				className="pointer-events-auto fixed z-50 rounded-lg border border-gray-800/50 bg-gray-950/90 shadow-2xl backdrop-blur-md"
				style={{ left: `${x}px`, top: `${y}px` }}
			>
				<button
					onClick={() => handleAction(onRotate)}
					className="block w-full px-3 py-1 text-left text-xs font-medium text-gray-200 transition-all hover:bg-gray-800"
				>
					🔄 Rotate
				</button>

				<button
					onClick={() => handleAction(onMove)}
					className="block w-full px-3 py-1 text-left text-xs font-medium text-gray-200 transition-all hover:bg-gray-800"
				>
					✋ Move
				</button>

				<button
					onClick={() => handleAction(onDelete)}
					className="block w-full px-3 py-1 text-left text-xs font-medium text-red-600 transition-all hover:bg-gray-800 hover:text-red-700"
				>
					🗑️ Delete
				</button>
			</div>
		</>
	)
}

export default CubeMenu
