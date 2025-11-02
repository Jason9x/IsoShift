import { Point } from 'pixi.js'

export interface ITileMap {
	grid: number[][]
	getGridValue(position: Point): number
}
