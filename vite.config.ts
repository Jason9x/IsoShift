import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	plugins: [tsconfigPaths()],
	build: {
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true,
	},
	server: {
		port: 8080,
		open: false,
	},
})
