import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import preact from '@preact/preset-vite'

export default defineConfig({
	base: '/room-editor/',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	plugins: [preact(), tsconfigPaths()],
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		jsxInject: `import { h, Fragment } from 'preact'`
	},
	build: {
		sourcemap: true,
		outDir: 'dist',
		emptyOutDir: true
	},
	server: {
		port: 8080,
		open: false
	}
})
