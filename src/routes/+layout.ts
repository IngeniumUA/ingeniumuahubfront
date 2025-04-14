import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ route }) => {
	return {
		footerEnabled: !route.id?.includes('/scanners/')
	};
};