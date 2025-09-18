<script lang="ts">
  import MemberCard from '$lib/components/account/member-card.svelte';
  import AccountDetails from '$lib/components/account/account-details.svelte';

  let { data } = $props();
</script>

<MemberCard imageString={ data.cardImageUrl } />
<AccountDetails response={ data.account } />