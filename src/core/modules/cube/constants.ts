import type { CubeFaceColors, CubeSettings } from '@/core/modules/cube/types'
import { Point3D } from '@/core/utils/coordinates'

export const CUBE_FACE_COLORS: CubeFaceColors = {
	topFace: 0xff5733, // Orange
	leftFace: 0x3399ff, // Blue
	rightFace: 0xffd700, // Yellow
}

export const CUBE_SETTINGS: CubeSettings[] = [
	{ position: new Point3D(2, 0, 0), size: 32 },
	{ position: new Point3D(3, 0, 0), size: 32 },
	{ position: new Point3D(0, 2, 0), size: 16 },
	{ position: new Point3D(0, 6, 0), size: 24 },
	{ position: new Point3D(0, 5, 0), size: 24 },
	{ position: new Point3D(0, 4, 0), size: 24 },
]
