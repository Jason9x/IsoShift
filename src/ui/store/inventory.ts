import { signal, effect } from '@preact/signals'
import { loadFromStorage } from './storage'

export const inventory = signal<string[]>(loadFromStorage('inventory', []))

effect(() => localStorage.setItem('inventory', JSON.stringify(inventory.value)))

export const addToInventory = (item: string) =>
	(inventory.value = [...inventory.value, item])
