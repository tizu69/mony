<script lang="ts">
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();

	let available = $derived(store.getFunds(project));
	let dailyRate = $derived(store.getWeightedFundsUsed(project));
	let daysLeft = $derived(available / dailyRate);
</script>

{#if dailyRate > 0}
	<div class="grid grid-cols-2 gap-4 divide-x divide-border card">
		<div>
			<p class="text-sm text-subtext">Avg. spent per day</p>
			<Number small value={dailyRate} />
		</div>
		<div>
			<p class="text-sm text-subtext">Est. days left</p>
			<Number small value={daysLeft !== daysLeft ? Infinity : Math.floor(daysLeft)} type="number" />
		</div>
	</div>
{:else}
	<div class="card">
		<p class="text-sm text-subtext">Not enough data to estimate spending habits.</p>
	</div>
{/if}
