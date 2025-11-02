import { PolygonGraphics, Point3D } from '@/core/utils'

export type BoxFaces = Map<'top' | 'left' | 'right', PolygonGraphics | null>

export type CubeSettings = {
	position: Point3D
	size: number
}

export type CubeFaceColors = {
	topFace: number
	leftFace: number
	rightFace: number
}
