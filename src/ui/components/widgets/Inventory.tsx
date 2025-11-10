import { useRef } from 'preact/hooks'
import type { JSX } from 'preact'

import { useDraggable } from '@/ui/hooks'
import { CUBE_TYPES, selectedCube } from '@/ui/store/inventory'

type InventoryProps = {
	isOpen: boolean
	zIndex: number
	onFocus: () => void
}

const Inventory = ({
	isOpen,
	zIndex,
	onFocus
}: InventoryProps): JSX.Element | null => {
	const ref = useRef<HTMLDivElement>(null)
	const { handleProps } = useDraggable({ elementRef: ref })

	if (!isOpen) return null

	return (
		<div
			ref={ref}
			{...handleProps}
			onMouseDown={onFocus}
			style={{ zIndex }}
			className="w-50 pointer-events-auto fixed left-5 top-5 flex cursor-grab flex-col rounded-lg border border-gray-800/50 bg-gray-950/90 p-3 text-gray-200 shadow-2xl backdrop-blur-md active:cursor-grabbing"
		>
			<h2 className="mb-3 text-sm font-bold">Inventory</h2>

			<div className="flex flex-wrap gap-2">
				{CUBE_TYPES.map((cube, index) => (
					<button
						key={index}
						onClick={() =>
							(selectedCube.value =
								selectedCube.value === cube ? null : cube)
						}
						className={`rounded px-3 py-2 text-xs font-medium transition-all ${
							selectedCube.value === cube
								? 'bg-blue-600 text-white'
								: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
