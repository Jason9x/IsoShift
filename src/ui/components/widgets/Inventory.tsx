import { useState, useRef } from 'preact/hooks'
import { CUBE_TYPES, selectedCube } from '../../store/inventory'
import type { JSX } from 'preact/jsx-runtime'

const Inventory = ({ isOpen }: { isOpen: boolean }): JSX.Element | null => {
	const [position, setPosition] = useState({ x: 16, y: 16 })
	const [isDragging, setIsDragging] = useState(false)
	const dragRef = useRef({ startX: 0, startY: 0 })

	const handleMouseDown = (e: MouseEvent) => {
		if ((e.target as HTMLElement).tagName === 'BUTTON') return
		setIsDragging(true)
		dragRef.current = {
			startX: e.clientX - position.x,
			startY: e.clientY - position.y,
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging) return
		setPosition({
			x: e.clientX - dragRef.current.startX,
			y: e.clientY - dragRef.current.startY,
		})
	}

	const handleMouseUp = () => setIsDragging(false)

	if (!isOpen) return null

	return (
		<div
			className="pointer-events-auto fixed rounded-lg border border-gray-700/50 bg-gray-900/90 shadow-2xl backdrop-blur-md"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: isDragging ? 'grabbing' : 'grab',
			}}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		>
			<div className="flex gap-1 p-1.5">
				{CUBE_TYPES.map((cube, i) => (
					<button
						key={i}
						onClick={() =>
							(selectedCube.value =
								selectedCube.value === cube ? null : cube)
						}
						className={`rounded px-2 py-1.5 text-xs font-medium transition-all ${
							selectedCube.value === cube
								? 'bg-blue-500 text-white shadow-lg'
								: 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
						}`}
						title={cube.name}
					>
						{cube.size}
					</button>
				))}
			</div>
		</div>
	)
}

export default Inventory
