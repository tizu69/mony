<script lang="ts">
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Trans } from '$lib/types';
	import { sum } from '$lib/utils';
	import { LucidePlus, LucideTrash2 } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';

	let { trans, dtf }: { trans: Trans; dtf: Intl.DateTimeFormat } = $props();

	let open = $state(false);
	let canDelete = $derived(store.canDeleteTrans(trans));

	$effect(() => {
		if (open) return; // on close
		untrack(() => {
			trans.items = trans.items.filter((i) => i.amount !== 0);
		});
	});
</script>

<button
	class="flex w-full items-center justify-between card text-left"
	onclick={() => (open = !open)}
>
	<div>
		<p class="font-bold">{trans.reason}</p>
		<p class="text-sm text-subtext">{dtf.format(trans.date)}</p>
	</div>
	<div class="text-right">
		<Number small value={trans.amount} />
	</div>
</button>

<Dialog bind:open class="flex flex-col gap-4">
	<div class="flex flex-col items-center gap-2">
		<Number value={trans.amount} />
		<p class="text-center text-2xl font-bold">{trans.reason}</p>
		<p class="text-sm text-subtext">{dtf.format(trans.date)}</p>
	</div>

	{#if trans.items.length !== 0}
		{@const rest = Math.abs(trans.amount) - sum(trans.items)}
		{@const restP = Math.abs(rest / trans.amount) * 100}
		<div class="flex flex-col gap-2">
			{#each trans.items as item}
				<div class="grid grid-cols-[auto_1fr] items-center" transition:slide|global>
					<Number small bind:value={item.amount} writeable />
					<input
						placeholder="Item name / description"
						type="text"
						bind:value={item.name}
						onchange={() => (item.name = item.name.trim())}
						class={['input', item.amount === 0 && 'opacity-50  not-placeholder-shown:line-through']}
					/>
				</div>
			{/each}
			{#if rest !== 0}
				<div class="grid grid-cols-[auto_1fr] items-center" transition:slide|global>
					<Number small value={rest} />
					<p>{rest > 0 ? 'Taxes' : 'Overpayment'} ({Math.round(restP)}%)</p>
				</div>
			{/if}
		</div>
	{/if}

	<div class="flex justify-center gap-2">
		<button
			class="flex items-center gap-1 primary"
			onclick={() => trans.items.push({ name: '', amount: 0 })}
		>
			<LucidePlus />
			Add Item
		</button>
		<ConfirmDialog
			icon={LucideTrash2}
			title={canDelete ? 'Delete this transaction?' : 'Cannot delete transaction'}
			text={canDelete
				? 'This cannot be undone.'
				: 'You would be out of funds if you chose to delete this.'}
			button="Delete"
			waitFor={canDelete ? 3 : -1}
			onconfirm={() => {
				open = false;
				setTimeout(() => {
					store.deleteTrans(trans);
				}, 500);
			}}
			class="danger square"
		>
			<LucideTrash2 />
		</ConfirmDialog>
	</div>
</Dialog>
