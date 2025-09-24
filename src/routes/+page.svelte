<script lang="ts">
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4">
		<Number value={store.getWalletFunds()} writeable />
	</div>

	<button onclick={() => store.addWalletFund(Math.random() * 10, '')}>Add 10 EUR</button>
</main>
