<script lang="ts">
	import { store } from '$lib/monystore';
	import NumberFlow from '@number-flow/svelte';
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4">
		<NumberFlow
			class="text-5xl font-bold"
			value={store.getWalletFunds()}
			locales={store.current.locale}
			format={{ style: 'currency', currency: store.current.currency }}
		/>
	</div>

	<button onclick={() => store.addWalletFund(Math.random() * 10, '')}>Add 10 EUR</button>
</main>
