<script lang="ts">
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';

	const { data } = $props();
	const project = $derived(data.project);
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4">
		<Number value={store.getFunds(project)} />
	</div>

	<button onclick={() => store.addFund(project, Math.round(Math.random() * 10), '')}>
		Add 10 EUR
	</button>
</main>
