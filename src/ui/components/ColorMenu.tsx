import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

import { colorMenuState } from '@/ui/store/colorMenu'
import {
	getCubeColor,
	getAvatarColor,
	getTileColor,
	getWallColor
} from '@/ui/store/colors'

const ColorMenu = (): JSX.Element | null => {
	if (!colorMenuState.value) return null

	const { x, y, type, entityId, faceKey, onColorChange } =
		colorMenuState.value
	const clearMenu = () => (colorMenuState.value = null)
	const menuRef = useRef<HTMLDivElement | null>(null)

	const getCurrentColor = (): number => {
		if (entityId === 'all-walls')
			return getWallColor(faceKey as 'top' | 'left' | 'right') ?? 0xffffff

		switch (type) {
			case 'cube': {
				const [x, y, z] = entityId.split(',').map(Number)

				return (
					getCubeColor(
						{ x, y, z },
						faceKey as 'top' | 'left' | 'right'
					) ?? 0xffffff
				)
			}

			case 'avatar':
				return (
					getAvatarColor(faceKey as 'top' | 'left' | 'right') ??
					0xffffff
				)

			case 'tile':
				return (
					getTileColor(
						faceKey as 'surface' | 'leftBorder' | 'rightBorder'
					) ?? 0xffffff
				)

			default:
				return 0xffffff
		}
	}

	const [currentColor, setCurrentColor] = useState(getCurrentColor())

	useEffect(() => setCurrentColor(getCurrentColor()), [colorMenuState.value])

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

	const handleColorChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const color = parseInt(target.value.replace('#', ''), 16)

		setCurrentColor(color)
		onColorChange(color)
	}

	const colorToHex = (color: number): string =>
		`#${color.toString(16).padStart(6, '0')}`

	const getFaceDisplayName = (): string => {
		if (!faceKey) return 'None'

		const faceNames: Record<string, string> = {
			top: 'Top',
			left: 'Left',
			right: 'Right',
			surface: 'Surface',
			leftBorder: 'Left Border',
			rightBorder: 'Right Border'
		}

		return faceNames[faceKey]
	}

	return (
		<div
			ref={menuRef}
			className="pointer-events-auto fixed z-50 w-48 rounded-lg border border-gray-800/50 bg-gray-950/90 p-3 text-gray-200 shadow-2xl backdrop-blur-md"
			style={{ left: `${x}px`, top: `${y}px` }}
		>
			<h3 className="mb-2 px-1 text-xs font-bold text-gray-400">
				Edit {getFaceDisplayName()} Color
			</h3>

			<div className="space-y-2">
				<label className="block text-xs text-gray-300">
					Color
					<input
						type="color"
						value={colorToHex(currentColor)}
						onInput={handleColorChange}
						className="mt-1 block h-8 w-full cursor-pointer rounded border border-gray-700 bg-gray-800"
					/>
				</label>
			</div>
		</div>
	)
}

export default ColorMenu
