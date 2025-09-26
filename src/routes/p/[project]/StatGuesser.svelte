<script lang="ts">
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();

	let scope = $state(24);
	let available = $derived(store.getFunds(project));
	let fundsUsed = $derived(store.getFundsUsedInTime(project, scope));
	let daysLeft = $derived(Math.floor((scope * (available / fundsUsed)) / 24));
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="flex flex-col rounded-lg bg-layer p-4">
		<p class="text-sm text-subtext">
			Spent in
			<select
				bind:value={scope}
				class="appearance-none bg-transparent text-accent underline focus:outline-none"
			>
				<option value={0.25}>15m</option>
				<option value={1}>1h</option>
				<option value={24}>24h</option>
				<option value={24 * 7}>7d</option>
				<option value={24 * 30}>30d</option>
			</select>
		</p>
		<Number small value={fundsUsed} />
	</div>
	<div class="flex flex-col rounded-lg bg-layer p-4">
		<p class="text-sm text-subtext">Est. days left</p>
		<Number small value={daysLeft !== daysLeft ? Infinity : daysLeft} type="number" />
	</div>
</div>
