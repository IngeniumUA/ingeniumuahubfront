import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	server: {
		port: 4200,
		proxy: {
			'/api': {
				target: 'https://hub.dev.ingeniumua.be',
				changeOrigin: true,
				secure: false,
			}
		}
	},
});
