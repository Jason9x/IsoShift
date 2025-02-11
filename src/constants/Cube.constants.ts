import { CubeSettings, CubeFaceColors } from '@/types/Cube.types'

import Point3D from '@/utils/coordinates/Point3D'

export const CUBE_FACE_COLORS: CubeFaceColors = {
	TOP_FACE: 0xff5733, // Orange
	LEFT_FACE: 0x3399ff, // Blue
	RIGHT_FACE: 0xffd700, // Yellow
}

export const CUBE_SETTINGS: CubeSettings[] = [
	{ position: new Point3D(2, 0, 0), size: 32 },
	{ position: new Point3D(3, 0, 0), size: 32 },
	{ position: new Point3D(4, 0, 0), size: 16 },
	{ position: new Point3D(4, 6, 0), size: 24 },
	{ position: new Point3D(4, 5, 0), size: 24 },
	{ position: new Point3D(6, 0, 4), size: 24 },
]
