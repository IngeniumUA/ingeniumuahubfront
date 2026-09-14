import type { Action } from 'svelte/action';

type TrackParams = {
	name: string;
	data?: Record<string, unknown>;
};

export const track: Action<HTMLElement, TrackParams> = (node, params) => {
	function handleClick() {
		if (typeof window === 'undefined' || !window.umami) return;
		window.umami.track(params.name, params.data);
	}

	node.addEventListener('click', handleClick);

	return {
		update(newParams) {
			params = newParams;
		},
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
};