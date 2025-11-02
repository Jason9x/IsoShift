export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	const saved = localStorage.getItem(key)

	return saved ? JSON.parse(saved) : defaultValue
}
