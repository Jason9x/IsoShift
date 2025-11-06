import { useState, useEffect } from 'preact/hooks'
import { rooms } from '@/ui/store/rooms'

type Widget = 'navigator' | 'settings' | 'inventory' | 'zoom' | 'layout'

type UseWidgetStateResult = {
	openWidgets: Set<Widget>
	widgetStack: Widget[]
	isOpen: (widget: Widget) => boolean
	getZIndex: (widget: Widget) => number
	bringToFront: (widget: Widget) => void
	toggle: (widget: Widget) => void
	close: (widget: Widget) => void
}

const BASE_Z_INDEX = 10

const useWidgetState = (): UseWidgetStateResult => {
	const [openWidgets, setOpenWidgets] = useState<Set<Widget>>(new Set())
	const [widgetStack, setWidgetStack] = useState<Widget[]>([])
	const hasRooms = rooms.value.length > 0

	const bringToFront = (widget: Widget): void =>
		setWidgetStack(previous => {
			const filtered = previous.filter(
				currentWidget => currentWidget !== widget
			)
			return [...filtered, widget]
		})

	const toggle = (widget: Widget): void => {
		setOpenWidgets(previous => {
			const nextWidgets = new Set(previous)
			const isCurrentlyOpen = nextWidgets.has(widget)

			isCurrentlyOpen
				? nextWidgets.delete(widget)
				: nextWidgets.add(widget)

			isCurrentlyOpen
				? setWidgetStack(previous =>
						previous.filter(
							currentWidget => currentWidget !== widget
						)
					)
				: bringToFront(widget)

			return nextWidgets
		})
	}

	const close = (widget: Widget): void => {
		setOpenWidgets(previous => {
			const nextWidgets = new Set(previous)
			nextWidgets.delete(widget)

			return nextWidgets
		})

		setWidgetStack(previous =>
			previous.filter(currentWidget => currentWidget !== widget)
		)
	}

	const isOpen = (widget: Widget): boolean => openWidgets.has(widget)

	const getZIndex = (widget: Widget): number => {
		const stackIndex = widgetStack.indexOf(widget)

		return stackIndex === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + stackIndex
	}

	useEffect(() => {
		if (!hasRooms) {
			setOpenWidgets(new Set(['navigator']))
			setWidgetStack(['navigator'])
		}
	}, [hasRooms])

	return {
		openWidgets,
		widgetStack,
		isOpen,
		getZIndex,
		bringToFront,
		toggle,
		close
	}
}

export default useWidgetState
