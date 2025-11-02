import { signal, effect } from '@preact/signals'
import { loadFromStorage } from './storage'

export const currentRoom = signal(loadFromStorage('room', 'Lobby'))

effect(() => localStorage.setItem('room', JSON.stringify(currentRoom.value)))

export const updateRoomName = (name: string) => (currentRoom.value = name)
