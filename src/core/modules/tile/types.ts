import { PolygonGraphics } from '@/core/utils'

export type FaceKey = 'top' | 'left' | 'right'
export type BoxFaces = Map<'top' | 'left' | 'right', PolygonGraphics | null>

export type TileDimensions = {
	width: number
	height: number
	thickness: number
}

export type TileStyle = {
	fillColor: number
	borderColor?: number
	borderWidth?: number
}

export type TileStyles = {
	surface: TileStyle
	leftBorder: TileStyle
	rightBorder: TileStyle
}
