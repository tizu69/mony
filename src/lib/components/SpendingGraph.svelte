<script lang="ts">
	import { sum } from '$lib/utils';
	import Number from './Number.svelte';

	let { data }: { data: { day: Date; amount: number }[] } = $props();

	let maxAmount = $derived(Math.max(...data.map((d) => d.amount), 0));
	let totalAmount = $derived(sum(data));

	let gridLines = $derived.by(() => {
		if (maxAmount === 0) return [];
		const step = maxAmount > 30000 ? 10000 : 1000;
		const lines = [];
		for (let i = step; i < maxAmount; i += step) lines.push(i);
		return lines;
	});
</script>

<div class="text-primary relative h-24 w-full">
	{#if totalAmount > 0}
		<svg class="h-full w-full">
			{#each data as bar, i}
				{@const height = (bar.amount / maxAmount) * 100}
				{@const width = 100 / data.length}
				<rect class="fill-current opacity-50" x="{i * width}%" y="{100 - height}%" {width} {height}>
					<title>
						<Number value={bar.amount} />
						on
						{bar.day.toLocaleDateString(undefined, {
							weekday: 'long',
							day: 'numeric',
							month: 'numeric'
						})}
					</title>
				</rect>
			{/each}

			{#each gridLines as lineAmount}
				{@const y = 100 - (lineAmount / maxAmount) * 100}
				<line x1="0" y1="{y}%" x2="100%" y2="{y}%" class="stroke-subtext" stroke-width="0.5" />
			{/each}
		</svg>
		{#each gridLines as lineAmount}
			<div
				class="absolute left-0 -translate-y-1/2 bg-back0 px-1 text-xs text-subtext"
				style="top: {100 - (lineAmount / maxAmount) * 100}%"
			>
				{lineAmount / 100}
			</div>
		{/each}
	{/if}
</div>
