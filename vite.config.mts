import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
	plugins: [react({ tsDecorators: true })],
	root: path.join(__dirname, "src/client"),
	publicDir: path.join(__dirname, "public"),
	server: {
		host: true,
		port: 5757,
	},
	optimizeDeps: {
		exclude: ["@tldraw/assets"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}));
