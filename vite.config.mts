import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { enhancedImages } from "@sveltejs/enhanced-img";

export default defineConfig({
	plugins: [
		sentrySvelteKit(),
		enhancedImages(),
		sveltekit(),
	],
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
	preview: {
		port: 4200,
	}
});
