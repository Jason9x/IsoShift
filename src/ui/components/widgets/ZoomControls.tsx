import { useRef } from 'preact/hooks'
import type { JSX } from 'preact'

import { useDraggable } from '@/ui/hooks'
import { zoom, updateZoom } from '@/ui/store/zoom'

type ZoomControlsProps = {
	isOpen: boolean
	zIndex: number
	onFocus: () => void
}

const ZoomControls = ({
	isOpen,
	zIndex,
	onFocus
}: ZoomControlsProps): JSX.Element | null => {
	const ref = useRef<HTMLDivElement>(null)
	const { handleProps } = useDraggable({ elementRef: ref })

	const handleZoomIn = (): void => {
		const newZoom = Math.min(zoom.value + 0.1, 2.0)
		updateZoom(newZoom)
	}

	const handleZoomOut = (): void => {
		const newZoom = Math.max(zoom.value - 0.1, 0.5)
		updateZoom(newZoom)
	}

	if (!isOpen) return null

	return (
		<div
			ref={ref}
			{...handleProps}
			onMouseDown={onFocus}
			style={{ zIndex }}
			className="pointer-events-auto absolute bottom-4 right-4 flex cursor-grab gap-1.5 rounded-lg border border-gray-800/50 bg-gray-950/90 px-2 py-1 shadow-2xl backdrop-blur-md active:cursor-grabbing"
		>
			<button
				onClick={handleZoomOut}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
			>
				−
			</button>

			<div className="flex items-center px-2 text-sm text-gray-200">
				{Math.round(zoom.value * 100)}%
			</div>

			<button
				onClick={handleZoomIn}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
			>
				+
			</button>
		</div>
	)
}

export default ZoomControls
