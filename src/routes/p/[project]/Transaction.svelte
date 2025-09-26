<script lang="ts">
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Trans } from '$lib/types';
	import { LucideTrash2 } from 'lucide-svelte';

	let { trans, dtf }: { trans: Trans; dtf: Intl.DateTimeFormat } = $props();

	let open = $state(false);
	let canDelete = $derived(store.canDeleteTrans(trans));
</script>

<button
	class="flex w-full items-center justify-between rounded-lg bg-layer p-4 text-left transition-colors hover:bg-layer/50"
	onclick={() => (open = !open)}
>
	<div>
		<p class="font-bold">{trans.reason}</p>
		<p class="text-sm text-subtext">
			{dtf.format(trans.date)}
		</p>
	</div>
	<div class="text-right">
		<Number small value={trans.amount} />
	</div>
</button>

<Dialog bind:open class="flex flex-col gap-4 px-4">
	<div class="flex flex-col items-center gap-2">
		<Number value={trans.amount} />
		<p class="text-center text-2xl font-bold">{trans.reason}</p>
		<p class="text-sm text-subtext">
			{dtf.format(trans.date)}
		</p>
	</div>

	<div class="flex justify-center">
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
			class="flex flex-col items-center gap-2 button layer pt-3 text-xs"
		>
			<LucideTrash2 />
			Delete
		</ConfirmDialog>
	</div>
</Dialog>
