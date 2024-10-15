import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0", // Ensure the server listens on all interfaces
		port: 5173,
		// other configurations...
	},
	plugins: [
		react({
			include: /\.jsx?$/,
		}),
	],
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
});
