import { Graphics } from 'pixi.js'

type Sides = {
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
		sides: Sides = {},
	) {
		super()
		this.#points = points
		this.eventMode = 'dynamic'
		this.draw(color)

		if (lineColor && lineWidth) this.#drawLines(lineColor, lineWidth, sides)
	}

	draw(color: number) {
		this.clear()
		this.poly(this.#points)
		this.fill({ color })
	}

	initialize(color: number) {
		this.draw(color)
	}

	#drawLines(lineColor: number, lineWidth: number, sides: Sides) {
		const lineConfig = [
			{ key: 'bottom', enabled: sides.bottom, from: [4, 5], to: [6, 7] },
			{ key: 'right', enabled: sides.right, from: [2, 3], to: [4, 5] },
			{ key: 'top', enabled: sides.top, from: [0, 1], to: [2, 3] },
			{ key: 'left', enabled: sides.left, from: [0, 1], to: [6, 7] },
		]

		lineConfig.forEach(({ key, enabled, from, to }) => {
			if (!enabled) return

			let line = this.#lines.get(key)

			if (!line) {
				line = new Graphics()

				this.#lines.set(key, line)
				this.addChild(line)
			}

			line.clear()
			line.setStrokeStyle({ width: lineWidth, color: lineColor })
			line.moveTo(this.#points[from[0]], this.#points[from[1]])
			line.lineTo(this.#points[to[0]], this.#points[to[1]]).stroke()
		})
	}
}
