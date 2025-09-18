import { toast } from '@zerodevx/svelte-toast'

export const successToast = (message: string) =>
	toast.push(message, {
		theme: {
			'--toastColor': 'mintcream',
			'--toastBackground': 'rgba(72,187,120,0.9)',
			'--toastBarBackground': '#2F855A'
		}
	});

export const failedToast = (message: string) =>
	toast.push(message, {
		theme: {
			'--toastColor': 'mistyrose',
			'--toastBackground': 'rgba(229, 62, 62, 0.9)', // red-600
			'--toastBarBackground': '#C53030' // red-700
		}
	});
