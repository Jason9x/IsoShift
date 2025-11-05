import { type CSSProperties } from 'preact'
import {
	useState,
	useRef,
	useCallback,
	useEffect,
} from 'preact/hooks'

type Position = {
	left: number
	top: number
}

type DragState = {
	startPointerX: number
	startPointerY: number
	startLeft: number
	startTop: number
}

type UseDraggableOptions = Partial<Position>

type DragHandleProperties = {
	onPointerDown: (event: PointerEvent) => void
}

type UseDraggableReturn = {
	style: CSSProperties
	handleProps: DragHandleProperties
}

export const useDraggable = (
	initialOptions?: UseDraggableOptions,
): UseDraggableReturn => {
	const initialPosition: Position = {
		left: initialOptions?.left ?? 16,
		top: initialOptions?.top ?? 16,
	}

	const [position, setPosition] = useState<Position>(initialPosition)
	const currentDragState = useRef<DragState | null>(null)

	const handlePointerMove = useCallback((event: PointerEvent) => {
		if (!currentDragState.current) return

		const deltaX = event.clientX - currentDragState.current.startPointerX
		const deltaY = event.clientY - currentDragState.current.startPointerY

		setPosition({
			left: Math.max(0, currentDragState.current.startLeft + deltaX),
			top: Math.max(0, currentDragState.current.startTop + deltaY),
		})
	}, [])

	const handlePointerUp = useCallback(() => {
		if (!currentDragState.current) return
		
		currentDragState.current = null
		document.removeEventListener('pointermove', handlePointerMove)
		document.removeEventListener('pointerup', handlePointerUp)
	}, [handlePointerMove])

	useEffect(() => {
		return () => {
			document.removeEventListener('pointermove', handlePointerMove)
			document.removeEventListener('pointerup', handlePointerUp)
		}
	}, [handlePointerMove, handlePointerUp])

	const handlePointerDown = useCallback(
		(event: PointerEvent) => {
			if (event.button !== 0) return

			const target = event.target as Element | null
			const isInteractive = target?.closest?.(
				'button, [role="button"], a, input, textarea, select',
			)
			
			if (isInteractive) return

			currentDragState.current = {
				startPointerX: event.clientX,
				startPointerY: event.clientY,
				startLeft: position.left,
				startTop: position.top,
			}

			document.addEventListener('pointermove', handlePointerMove)
			document.addEventListener('pointerup', handlePointerUp)

			event.preventDefault()
		},
		[position, handlePointerMove, handlePointerUp],
	)

	const style: CSSProperties = {
		position: 'absolute',
		left: `${position.left}px`,
		top: `${position.top}px`,
		touchAction: 'none',
		userSelect: 'none',
	}

	return {
		style,
		handleProps: { onPointerDown: handlePointerDown }
	}
}

export default useDraggable