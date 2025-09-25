<script lang="ts">
	import { goto } from '$app/navigation';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';

	const { data } = $props();
	const project = $derived(data.project);

	let dtf = $derived(
		new Intl.DateTimeFormat(store.current.locale, {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			year: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4">
		<Number value={store.getFunds(project)} />
	</div>

	<button onclick={() => store.addTrans(project, Math.round(Math.random() * 10), 'foo')}>
		Add EUR
	</button>
	<button onclick={() => store.addTrans(project, -Math.round(Math.random() * 10), 'bar')}>
		Sub EUR
	</button>

	<div class="space-y-1">
		{#each store.getTrans(project).toReversed() as trans (trans.id)}
			<div class="layer button flex items-center justify-between" animate:flip in:slide>
				<div>
					<p>{trans.reason}</p>
					<p class="text-subtext">
						{dtf.format(new Date(trans.date))}
					</p>
				</div>
				<div>
					<Number small value={trans.amount} />
				</div>
			</div>
		{/each}
	</div>

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
