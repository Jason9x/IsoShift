import { PolygonGraphics } from '@/shared'
import { Point3D } from '@/utils/coordinates'

export type FaceKey = 'top' | 'left' | 'right'
export type BoxFaces = Map<'top' | 'left' | 'right', PolygonGraphics | null>

export type CubeSettings = {
	position: Point3D
	size: number
}

export type CubeFaceColors = {
	TOP_FACE: number
	LEFT_FACE: number
	RIGHT_FACE: number
}
