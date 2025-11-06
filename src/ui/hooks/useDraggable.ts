import { useRef, useEffect } from 'preact/hooks'
import type { RefObject } from 'preact'

type DragState = {
	startX: number
	startY: number
	elementLeft: number
	elementTop: number
	elementWidth: number
	elementHeight: number
}

type UseDraggableOptions = {
	elementRef: RefObject<HTMLElement>
}

type UseDraggableReturn = {
	handleProps: {
		onPointerDown: (event: PointerEvent) => void
	}
}

export const useDraggable = ({
	elementRef
}: UseDraggableOptions): UseDraggableReturn => {
	const dragState = useRef<DragState | null>(null)

	const getElement = () => elementRef.current ?? undefined

	const clampToViewport = (
		left: number,
		top: number,
		width: number,
		height: number
	) => {
		const maxLeft = Math.max(0, window.innerWidth - width)
		const maxTop = Math.max(0, window.innerHeight - height)

		return {
			left: Math.min(Math.max(0, left), maxLeft),
			top: Math.min(Math.max(0, top), maxTop)
		}
	}

	const setElementPosition = (left: number, top: number) => {
		const element = getElement()

		if (!element) return

		element.style.left = `${left}px`
		element.style.top = `${top}px`
	}

	const onPointerMove = (event: PointerEvent) => {
		if (!dragState.current) return

		const {
			startX,
			startY,
			elementLeft,
			elementTop,
			elementWidth,
			elementHeight
		} = dragState.current

		const deltaX = event.clientX - startX
		const deltaY = event.clientY - startY

		const newLeft = elementLeft + deltaX
		const newTop = elementTop + deltaY

		const clamped = clampToViewport(
			newLeft,
			newTop,
			elementWidth,
			elementHeight
		)

		setElementPosition(clamped.left, clamped.top)
	}

	const onPointerUp = () => {
		dragState.current = null

		document.removeEventListener('pointermove', onPointerMove)
		document.removeEventListener('pointerup', onPointerUp)
	}

	const onPointerDown = (event: PointerEvent) => {
		if (event.button !== 0) return

		const target = event.target as Element | null
		const isInteractive = target?.closest?.(
			'button, [role="button"], a, input, textarea, select'
		)

		if (isInteractive) return

		const element = getElement()

		if (!element) return

		const rect = element.getBoundingClientRect()
		const computedStyle = getComputedStyle(element)

		if (computedStyle.position !== 'fixed') element.style.position = 'fixed'

		element.style.right = 'auto'
		element.style.bottom = 'auto'

		if (!element.style.left && !element.style.top) {
			element.style.left = `${rect.left}px`
			element.style.top = `${rect.top}px`
		}

		dragState.current = {
			startX: event.clientX,
			startY: event.clientY,
			elementLeft: rect.left,
			elementTop: rect.top,
			elementWidth: rect.width,
			elementHeight: rect.height
		}

		document.addEventListener('pointermove', onPointerMove)
		document.addEventListener('pointerup', onPointerUp)

		event.preventDefault()
	}

	useEffect(() => {
		const onResize = () => {
			const element = getElement()

			if (!element) return

			const rect = element.getBoundingClientRect()
			const clamped = clampToViewport(
				rect.left,
				rect.top,
				rect.width,
				rect.height
			)

			if (rect.left !== clamped.left || rect.top !== clamped.top)
				setElementPosition(clamped.left, clamped.top)
		}

		window.addEventListener('resize', onResize)

		return () => window.removeEventListener('resize', onResize)
	})

	return {
		handleProps: { onPointerDown }
	}
}
