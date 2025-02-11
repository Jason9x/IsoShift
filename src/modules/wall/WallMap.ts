import { injectable } from 'inversify'

import { Container } from 'pixi.js'

import Wall from '@/modules/wall/Wall'

import IWallMap from '@/interfaces/modules/IWallMap'

@injectable()
export default class WallMap implements IWallMap {
	readonly #walls: Wall[]
	readonly #container: Container

	constructor() {
		this.#walls = []
		this.#container = new Container()
	}

	addWall(wall: Wall) {
		this.#walls.push(wall)
		this.#container.addChild(wall.container)
	}

	get walls() {
		return this.#walls
	}

	get container() {
		return this.#container
	}
}
