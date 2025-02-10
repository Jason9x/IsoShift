import Point3D from '@/utils/coordinates/Point3D'

export default interface IPathfinder {
	findPath(
		startPosition: Point3D,
		goalPosition: Point3D,
		isRecalculating: boolean,
	): Point3D[] | null
}
