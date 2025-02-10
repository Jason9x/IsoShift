import { Container } from 'pixi.js'

import Wall from '@/modules/wall/Wall'

export default interface IWallMap {
	walls: Wall[]
	container: Container

	addWall(wall: Wall): void
}
