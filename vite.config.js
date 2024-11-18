import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: '../backend/public',
		emptyOutDir: true,
		target: 'es2022',
		rollupOptions: {
			external: ['./src/services/credentials.js']
		  }
	},
})
