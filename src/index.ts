import 'reflect-metadata'

import './index.css'
import container from './inversify.config'

import Client from '@/game/Client'

// prettier-ignore
container.get<Client>(Client)
