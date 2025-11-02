import { Graphics } from 'pixi.js'

export default class PolygonGraphics extends Graphics {
	readonly #points: number[]
	readonly #topLine: Graphics
	readonly #bottomLine: Graphics
	readonly #leftLine: Graphics
	readonly #rightLine: Graphics

	constructor(
		color: number,
		points: number[],
		lineColor?: number,
		lineWidth?: number,
		sides: {
			top?: boolean
			bottom?: boolean
			left?: boolean
			right?: boolean
		} = {},
	) {
		super()

		this.#points = points
		this.#topLine = new Graphics()
		this.#bottomLine = new Graphics()
		this.#leftLine = new Graphics()
		this.#rightLine = new Graphics()
		this.eventMode = 'dynamic'

		this.initialize(color, lineColor, lineWidth, sides)
	}

	initialize(
		color: number,
		lineColor?: number,
		lineWidth?: number,
		sides: {
			top?: boolean
			bottom?: boolean
			left?: boolean
			right?: boolean
		} = {},
	) {
		this.draw(color)

		if (!lineColor || !lineWidth) return

		this.#drawLines(lineColor, lineWidth, sides)
	}

	draw(color: number) {
		this.clear()

		this.poly(this.#points)
		this.fill({ color })
	}

	#drawLines(
		lineColor: number,
		lineWidth: number,
		sides: {
			top?: boolean
			bottom?: boolean
			left?: boolean
			right?: boolean
		},
	) {
		const { top, bottom, left, right } = sides

		if (bottom) {
			this.#bottomLine.clear()
			this.#bottomLine.setStrokeStyle({ width: lineWidth, color: lineColor })
			this.#bottomLine.moveTo(this.#points[4], this.#points[5])
			this.#bottomLine.lineTo(this.#points[6], this.#points[7]).stroke()

			this.addChild(this.#bottomLine)
		}

		if (right) {
			this.#rightLine.clear()
			this.#rightLine.setStrokeStyle({ width: lineWidth, color: lineColor })
			this.#rightLine.moveTo(this.#points[2], this.#points[3])
			this.#rightLine.lineTo(this.#points[4], this.#points[5]).stroke()

			this.addChild(this.#rightLine)
		}

		if (top) {
			this.#topLine.clear()
			this.#topLine.setStrokeStyle({ width: lineWidth, color: lineColor })
			this.#topLine.moveTo(this.#points[0], this.#points[1])
			this.#topLine.lineTo(this.#points[2], this.#points[3]).stroke()

			this.addChild(this.#topLine)
		}

		if (left) {
			this.#leftLine.clear()
			this.#leftLine.setStrokeStyle({ width: lineWidth, color: lineColor })
			this.#leftLine.moveTo(this.#points[0], this.#points[1])
			this.#leftLine.lineTo(this.#points[6], this.#points[7]).stroke()

			this.addChild(this.#leftLine)
		}
	}
}
