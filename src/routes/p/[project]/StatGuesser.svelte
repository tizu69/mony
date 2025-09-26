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

<div class="grid grid-cols-[auto_auto] gap-1">
	<div class="flex items-end rounded layer p-2 pb-1">
		<Number small value={fundsUsed} />
		<p class="pb-1">/</p>
		<select bind:value={scope} class="pb-1">
			<option value={0.25}>15m</option>
			<option value={1}>1h</option>
			<option value={24}>24h</option>
			<option value={7}>7d</option>
			<option value={30}>30d</option>
		</select>
	</div>
	<div class="flex items-end rounded layer p-2 pb-1">
		<Number small value={Number.isNaN(daysLeft) ? Infinity : daysLeft} type="number" />
		<p class="pb-1">days</p>
	</div>
</div>
