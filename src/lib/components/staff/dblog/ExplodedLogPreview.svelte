<script lang="ts">
	import type { DBLogExplodedI } from '$lib/models/dblog';
	import { makePretty, prettyDateTime } from '$lib/utilities/style-utilities';

	let { targetObject = $bindable(), explodedDBLogs = $bindable() }: { targetObject, explodedDBLogs: DBLogExplodedI[] } = $props();
</script>

<style>
    article {
        @apply flex flex-col gap-4 p-4 pl-0 relative;

        /* Vertical line */
        &::before {
            content: "";
            @apply absolute left-4 border-2 bg-ingenium-grey-300 w-px;
            top: 1rem;
            bottom: 1rem;
            z-index: -1;
        }

        .tijdlijn-container {
            @apply max-w-72 p-2 bg-white border-2 border-ingenium-grey-300 rounded-lg text-ingenium-grey-600;
            p {
                @apply text-ingenium-grey-600;
            }

            span {
                @apply font-bold text-blue-900 opacity-90;
            }
        }
    }
</style>

<article class="tijdlijn-section">
	{#each explodedDBLogs as statusOrUserLog}
		<div class="tijdlijn-container">
			<h4>{prettyDateTime(statusOrUserLog.created_timestamp)} <span>Edit</span></h4>
			<p>{makePretty(statusOrUserLog.column_name)}: <span>{statusOrUserLog.value_new !== null ? makePretty(statusOrUserLog.value_new): statusOrUserLog.value_new}</span></p>
			<p>Edit by: <span>{statusOrUserLog.dblog_metadata["user"] ?? "unknown"}</span></p>
		</div>
	{/each}

	<!-- Onderste container, aanmaken van checkout-->
	<div class="tijdlijn-container">
		<h4>{prettyDateTime(targetObject.created_timestamp)} <span>Created</span></h4>
	</div>
</article>
