<script lang="ts">
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';

	let projects = $derived(store.getProjects());
	let totalIn = $derived(projects.reduce((acc, p) => acc + store.getFunds(p, '+'), 0));
	let totalOut = $derived(projects.reduce((acc, p) => acc + store.getFunds(p, '-'), 0));
	let totalAvail = $derived(totalIn - -totalOut);
	let savingRate = $derived((totalAvail / totalIn) * 100);
	let totalPurch = $derived(store.current.trans.filter((t) => t.amount < 0).length);
	let totalProj = $derived(projects.length);
</script>

{#if totalPurch > 0}
	{#snippet entry(text: string, num: number, kind: 'currency' | 'number' = 'currency')}
		<div class="flex items-baseline">
			<Number small value={num} type={kind} />
			<span class="text-sm text-subtext">{text}</span>
		</div>
	{/snippet}

	<div class="divide-y divide-border card *:not-first:pt-3 *:not-last:pb-3">
		{@render entry('added', totalIn)}
		{@render entry('spent', -totalOut)}
		<div class="grid grid-cols-[1fr_auto] space-x-4 divide-x divide-border">
			{@render entry('left over', totalAvail)}
			{@render entry('saved', Math.round(savingRate !== savingRate ? 0 : savingRate))}
		</div>
		<div class="grid grid-cols-2 space-x-4 divide-x divide-border">
			{@render entry('purchases', totalPurch, 'number')}
			{@render entry('projects', totalProj, 'number')}
		</div>
	</div>
{/if}
