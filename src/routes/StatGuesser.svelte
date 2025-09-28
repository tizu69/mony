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

<div class="space-y-4 px-4">
	<div>
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Total added</p>
			<Number small value={totalIn} />
		</div>
	</div>
	<div>
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Total spent</p>
			<Number small value={-totalOut} />
		</div>
	</div>
	<div class="grid grid-cols-[1fr_auto] space-x-4">
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Left over</p>
			<Number small value={totalAvail} />
		</div>
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Saved</p>
			<Number
				small
				value={Math.round(savingRate !== savingRate ? 0 : savingRate)}
				type="number"
				suffix="%"
			/>
		</div>
	</div>
	<div class="grid grid-cols-2 space-x-4">
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Purchases</p>
			<Number small value={totalPurch} type="number" />
		</div>
		<div class="flex flex-col rounded-lg bg-layer p-4">
			<p class="text-sm text-subtext">Projects</p>
			<Number small value={totalProj} type="number" />
		</div>
	</div>
</div>
