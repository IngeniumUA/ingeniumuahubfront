<script lang="ts">
	import type { AccessPolicyI } from '$lib/models/item/availabilityCompositionI';

	let { formState = $bindable() }: { formState: AccessPolicyI | null } = $props();

	interface AccessKeyI {
		access_key: string;
	}

	function parseForAccessKey(): AccessKeyI {
		if (formState === null) {
			return {
				access_key: ""
			}
		}
		return formState.access_policy_config as AccessKeyI
	}

	let accessKey = $state(parseForAccessKey().access_key)

	$effect(() => {
		formState = {
			access_policy_config: {
				access_key: accessKey
			}
		}
	})
</script>

<form class="ingenium-form" onsubmit={(e) => { e.preventDefault(); }}>
	<p class="font-bold">Whitelist</p>
	<fieldset>
		<div class="form-field">
			<label for="available_from">Available From</label>
			<input id="available_from" type="text" required bind:value={accessKey}/>
			<p>Access Key</p>
		</div>
	</fieldset>
</form>