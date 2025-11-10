import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import { cubeMenuState } from '@/ui/store/cubeMenu'

const CubeMenu = (): JSX.Element | null => {
	if (!cubeMenuState.value) return null

	const { x, y, onRotate, onMove, onDelete } = cubeMenuState.value
	const clearMenu = () => (cubeMenuState.value = null)
	const menuRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!menuRef.current) return

			const target = event.target as Node | null

			if (target && menuRef.current.contains(target)) return

			clearMenu()
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') clearMenu()
		}

		document.addEventListener('pointerdown', handlePointerDown, true)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown, true)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const handleAction = (action: () => void) => {
		action()
		clearMenu()
	}

	return (
		<div
			ref={menuRef}
			className="pointer-events-auto fixed z-50 w-40 rounded-lg border border-gray-800/50 bg-gray-950/90 p-2 text-gray-200 shadow-2xl backdrop-blur-md"
			style={{ left: `${x}px`, top: `${y}px` }}
		>
			<h3 className="mb-2 px-1 text-xs font-bold text-gray-400">
				Cube Actions
			</h3>

			<div className="space-y-1">
				<button
					onClick={() => handleAction(onRotate)}
					className="flex w-full items-center gap-2 rounded-md bg-gray-800 px-2 py-1.5 text-left text-xs font-medium text-gray-300 transition-all hover:bg-gray-700"
				>
					<svg
						className="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Rotate
				</button>

				<button
					onClick={() => handleAction(onMove)}
					className="flex w-full items-center gap-2 rounded-md bg-gray-800 px-2 py-1.5 text-left text-xs font-medium text-gray-300 transition-all hover:bg-gray-700"
				>
					<svg
						className="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						/>
					</svg>
					Move
				</button>

				<div className="my-1.5 border-t border-gray-800/50" />

				<button
					onClick={() => handleAction(onDelete)}
					className="flex w-full items-center gap-2 rounded-md bg-red-600/90 px-2 py-1.5 text-left text-xs font-medium text-white transition-all hover:bg-red-600"
				>
					<svg
						className="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
					Delete
				</button>
			</div>
		</div>
	)
}

export default CubeMenu
