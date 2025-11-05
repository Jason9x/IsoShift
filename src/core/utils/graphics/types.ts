import type PolygonGraphics from './PolygonGraphics'
export type { Sides } from './PolygonGraphics'

export type FaceKey = 'top' | 'left' | 'right'
export type BoxFaces = Map<FaceKey, PolygonGraphics | null>
