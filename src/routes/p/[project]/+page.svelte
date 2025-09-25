<script lang="ts">
	import { goto } from '$app/navigation';
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

	<button
		class="button text-xs text-subtext underline"
		onclick={() => {
			if (!confirm('Are you sure you want to delete this project? This action cannot be undone.'))
				return;
			store.deleteProject(project);
			goto(`/`);
		}}
	>
		Delete Project
	</button>
</main>
