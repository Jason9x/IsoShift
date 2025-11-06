import { Graphics } from 'pixi.js'

export type Sides = {
	top?: boolean
	bottom?: boolean
	left?: boolean
	right?: boolean
}

export default class PolygonGraphics extends Graphics {
	readonly #points: number[]
	readonly #lines = new Map<string, Graphics>()

	constructor(
		color: number,
		points: number[],
		lineColor?: number,
		lineWidth?: number,
		sides: Sides = {}
	) {
		super()
		this.#points = points
		this.eventMode = 'dynamic'
		this.draw(color)

		if (lineColor && lineWidth) this.#drawLines(lineColor, lineWidth, sides)
	}

	draw(color: number): void {
		this.clear()
		this.poly(this.#points)
		this.fill({ color })
	}

	#drawLines(lineColor: number, lineWidth: number, sides: Sides) {
		const lineConfig = [
			{
				side: 'bottom',
				enabled: sides.bottom,
				startIndices: [4, 5],
				endIndices: [6, 7]
			},
			{
				side: 'right',
				enabled: sides.right,
				startIndices: [2, 3],
				endIndices: [4, 5]
			},
			{
				side: 'top',
				enabled: sides.top,
				startIndices: [0, 1],
				endIndices: [2, 3]
			},
			{
				side: 'left',
				enabled: sides.left,
				startIndices: [0, 1],
				endIndices: [6, 7]
			}
		]

		lineConfig.forEach(({ side, enabled, startIndices, endIndices }) => {
			if (!enabled) return

			let line = this.#lines.get(side)

			if (!line) {
				line = new Graphics()

				this.#lines.set(side, line)
				this.addChild(line)
			}

			line.clear()
			line.setStrokeStyle({ width: lineWidth, color: lineColor })
			line.moveTo(
				this.#points[startIndices[0]],
				this.#points[startIndices[1]]
			)
			line.lineTo(
				this.#points[endIndices[0]],
				this.#points[endIndices[1]]
			).stroke()
		})
	}
}
