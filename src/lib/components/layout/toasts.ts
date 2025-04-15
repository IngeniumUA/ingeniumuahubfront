import { toast } from '@zerodevx/svelte-toast';

export const notificationToast = (m: any) =>
	toast.push(m, {
		duration: 9000000,
		theme: {
			'--toastBackground': 'white',
			'--toastColor': 'black'
		}
	});
