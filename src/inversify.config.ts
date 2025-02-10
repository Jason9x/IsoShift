import { Container } from 'inversify'

import Client from '@/game/Client'
import Scene from '@/game/Scene'
import Camera from '@/game/Camera'

import TileMap from '@/modules/tile/TileMap'
import WallMap from '@/modules/wall/WallMap'
import Avatar from '@/modules/avatar/Avatar'
import CubeMap from '@/modules/cube/CubeMap'
import Pathfinder from '@/pathfinding/Pathfinder'

import IScene from '@/interfaces/game/IScene'
import ICamera from '@/interfaces/game/ICamera'

import ITileMap from '@/interfaces/modules/ITileMap'
import IWallMap from '@/interfaces/modules/IWallMap'
import ICubeMap from '@/interfaces/modules/ICubeMap'
import IAvatar from '@/interfaces/modules/IAvatar'
import IPathfinder from '@/interfaces/modules/IPathfinder'

import { TILE_GRID } from '@/constants/Tile.constants'

const container = new Container()

container.bind<Client>(Client).toSelf().inSingletonScope()
container.bind<ICamera>('ICamera').to(Camera).inSingletonScope()
container.bind<IScene>('IScene').to(Scene).inSingletonScope()

container.bind<ITileMap>('ITileMap').to(TileMap).inSingletonScope()
container.bind<IWallMap>('IWallMap').to(WallMap).inSingletonScope()

container.bind<ICubeMap>('ICubeMap').to(CubeMap).inSingletonScope()
container.bind<IAvatar>('IAvatar').to(Avatar).inSingletonScope()
container.bind<IPathfinder>('IPathfinder').to(Pathfinder).inSingletonScope()

container.bind<number[][]>('Grid').toConstantValue(TILE_GRID)

export default container
