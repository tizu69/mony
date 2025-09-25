<script lang="ts">
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Project } from '$lib/types';
	import { LucideTriangleAlert } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import fundWarnings from './fundWarnings';

	let p: { children?: Snippet; class?: string; project: Project } = $props();

	let isFirstTrans = $derived(store.getTrans(p.project).length === 0);

	let isExpense = $state(false);
	let reason = $state('');
	let amount = $state(0);
	function reset() {
		isExpense = !isFirstTrans;
		reason = isFirstTrans ? 'Initial funds' : '';
		amount = 0;
	}
	reset();

	let open = $state(false);
	let button = $derived(isExpense ? 'Buy' : 'Add funds');
	function createTrans() {
		store.addTrans(p.project, isExpense ? -amount : amount, reason);
		confirmOpen = false;
		open = false;
	}

	let funds = $derived(store.getFunds(p.project));
	let fundsAfter = $derived(funds + (isExpense ? -amount : amount));

	let confirmOpen = $state(false);
	let confirmData = $derived(fundWarnings(isExpense, amount, funds, fundsAfter, isFirstTrans));
</script>

<Dialog
	triggerClass={p.class}
	bind:open
	trigger={p.children}
	class="space-y-2 px-4"
	onclose={() => reset()}
>
	{#if !isFirstTrans}
		<div class="grid grid-cols-2">
			<button class={['button', isExpense && 'accent']} onclick={() => (isExpense = true)}>
				Expense
			</button>
			<button class={['button', !isExpense && 'accent']} onclick={() => (isExpense = false)}>
				Add funds
			</button>
		</div>
	{/if}

	<div class="flex justify-center">
		<Number bind:value={amount} writeable autofocus />
	</div>

	{#if !isFirstTrans}
		<input
			type="text"
			bind:value={reason}
			class="button w-full layer"
			placeholder={isExpense ? 'What are you buying?' : 'Why are you adding funds?'}
		/>
	{/if}

	<button
		class="button w-full not-disabled:accent disabled:layer disabled:opacity-50"
		disabled={!reason || !amount}
		onclick={() => {
			if (!confirmData) createTrans();
			else confirmOpen = true;
		}}
	>
		{button}
	</button>
	{#if confirmData}
		<ConfirmDialog
			{...confirmData}
			bind:open={confirmOpen}
			icon={LucideTriangleAlert}
			{button}
			onconfirm={() => createTrans()}
		/>
	{/if}
</Dialog>
