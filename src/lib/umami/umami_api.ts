let readyResolve: () => void;
export const umamiReady = new Promise<void>((resolve) => {
	readyResolve = resolve;
});

export class UmamiAPI {
	static loadUmami(id: string) {
		if (!id) return;

		const script = document.createElement('script');
		script.defer = true;
		script.src = 'https://traffic.ingeniumua.be/script.js';
		script.setAttribute('data-website-id', id);
		script.addEventListener('load', () => readyResolve());
		document.head.appendChild(script);
	}

	static async identify(props: Record<string, unknown>) {
		await umamiReady;
		window.umami?.identify(props);
	}
}
