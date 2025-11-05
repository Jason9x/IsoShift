import { useState, useEffect } from 'preact/hooks'
import { rooms } from '@/ui/store/rooms'

type Widget = 'navigator' | 'settings' | 'inventory' | 'zoom' | 'layout'

type UseWidgetStateResult = {
	openWidget: Widget | null
	toggle: (widget: Widget) => void
	close: () => void
}

const useWidgetState = (): UseWidgetStateResult => {
	const [openWidget, setOpenWidget] = useState<Widget | null>(null)
	const hasRooms = rooms.value.length > 0

	const toggle = (widget: Widget): void => {
		const isLocked = widget === 'navigator' && !hasRooms
		const shouldOpen = openWidget !== widget
		const nextWidget = isLocked || shouldOpen ? widget : null

		setOpenWidget(nextWidget)
	}

	const close = (): void => setOpenWidget(null)

	useEffect(() => {
		const shouldShowNavigator = !hasRooms && openWidget !== 'navigator'
		const nextWidget = shouldShowNavigator ? 'navigator' : openWidget

		setOpenWidget(nextWidget)
	}, [hasRooms, openWidget])

	return {
		openWidget,
		toggle,
		close,
	}
}

export default useWidgetState
