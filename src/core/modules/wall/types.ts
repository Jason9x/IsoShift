import { PolygonGraphics } from '@/core/utils'

export type FaceKey = 'top' | 'left' | 'right'
export type BoxFaces = Map<'top' | 'left' | 'right', PolygonGraphics | null>

export type WallDimensions = {
	height: number
	thickness: number
}

export type WallStyle = {
	fillColor: number
	borderColor?: number
	borderWidth?: number
}

export type WallStyles = {
	surface: WallStyle
	border: WallStyle
	borderTop: WallStyle
}

export type WallSideStyles = {
	left: WallStyles
	right: WallStyles
}
