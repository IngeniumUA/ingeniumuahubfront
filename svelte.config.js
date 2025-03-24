import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: 'index.html' // may differ from host to host
		}),
		alias: {
			'$assets': './src/assets',
		},
		/*csp: {
			directives: {
				'connect-src': ['self', 'https://hub.ingeniumua.be', 'https://sso.ingeniumua.be', 'https://api.stripe.com', 'https://maps.googleapis.com', 'cloudflareinsights.com', 'https://localhost', 'capacitor://localhost'],
				'frame-src': ['https://*.js.stripe.com', 'https://js.stripe.com', 'https://hooks.stripe.com', 'https://challenges.cloudflare.com'],
				'script-src': ['self', 'https://*.js.stripe.com', 'https://js.stripe.com', 'https://maps.googleapis.com', 'https://challenges.cloudflare.com', 'static.cloudflareinsights.com', 'https://localhost', 'capacitor://localhost'],
				'style-src': ['self', 'unsafe-inline', 'https://localhost', 'capacitor://localhost'],
				'report-uri': ['/'], //['https://o4507006131437568.ingest.us.sentry.io/api/4507006138777600/security/?sentry_key=50ffd26da050af7ec4e2122b7e5ab77a']
			}
		}*/
	}
};

export default config;
