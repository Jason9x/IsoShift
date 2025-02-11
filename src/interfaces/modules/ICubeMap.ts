import { Container } from 'pixi.js'

import Cube from '@/modules/cube/Cube'

import Point3D from '@/utils/coordinates/Point3D'

interface ICubeMap {
	cubes: Cube[]

	populateSceneWithCubes(): void

	findTallestCubeAt(position: Point3D): Cube | null

	sortCubesByPosition(): void

	container: Container
}

export default ICubeMap
