import 'reflect-metadata'

import './index.css'
import container from './inversify.config'

import Client from '@/game/Client'

container.get<Client>(Client)
