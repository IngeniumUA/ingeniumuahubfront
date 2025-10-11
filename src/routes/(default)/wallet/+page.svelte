<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getAuthorizationHeaders } from '$lib/auth/auth';
	import { failedToast } from '$lib/components/toast/defined_toast';
	import { onMount } from 'svelte';

	let data: { platform: string, query: {transaction_uuid: string}} = $props()
	let httpLoading = $state(false);
	async function downloadAppleWallet() {
		if (httpLoading) return;
		try {
			httpLoading = true;

			const res = await fetch(
				`${PUBLIC_API_URL}/account/wallet/apple?transaction_uuid=${data.query.transaction_uuid}`,
				{
					method: 'GET',
					headers: getAuthorizationHeaders(null),
				}
			);

			if (!res.ok) {
				throw new Error('Download failed');
			}

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			// Extract filename from header or fallback
			const contentDisposition = res.headers.get('Content-Disposition');
			a.download = contentDisposition
				? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
				: 'wallet.pkpass';

			document.body.appendChild(a);
			a.click();
			a.remove();

			window.URL.revokeObjectURL(url);

		} catch (err) {
			failedToast(err instanceof Error ? err.message : ('Error validity'));
		} finally {
			httpLoading = false;
		}
	}
	onMount(() => {
		if (data.platform === 'apple') {
			downloadAppleWallet();
		}
	});
</script>