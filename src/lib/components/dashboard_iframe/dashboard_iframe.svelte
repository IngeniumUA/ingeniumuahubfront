<script lang="ts">
	export let token: string;
	export let path: string = "";
	let iframeEl: HTMLIFrameElement;

	// todo these options https://docs.streamlit.io/deploy/streamlit-community-cloud/share-your-app/embed-your-app#embed-options
	const baseUrl: string = "https://dashboard.ingeniumua.be";
	$: iframeSrc = `${baseUrl}/${path}`;

	function sendToken() {
		if (iframeEl.contentWindow === null) {return}
		iframeEl.contentWindow.postMessage(
			{ type: "auth", token },
			baseUrl
		);
	}

	function onLoad() {
		sendToken();
	}
</script>

<div style="width: 100%; height: 100%; position: relative;">
	<iframe
		bind:this={iframeEl}
		src={iframeSrc}
		title="Ingenium Dashboard"
		width="100%"
		height="800"
		style="border:none;"
		on:load={onLoad}
	></iframe>
</div>
