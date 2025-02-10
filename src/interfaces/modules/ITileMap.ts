import { Container, Point } from 'pixi.js'

import Tile from '@/modules/tile/Tile'
import Point3D from '@/utils/coordinates/Point3D'

export default interface ITileMap {
	tiles: Tile[]
	container: Container
	grid: number[][]

	generate(): void
	getGridValue(position: Point): number
	findTileByExactPosition(position: Point3D): Tile | undefined
	findTileByPositionInBounds(position: Point): Tile | undefined
}
