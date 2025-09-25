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
	class="button flex w-full items-center justify-between layer text-left"
	onclick={() => (open = !open)}
>
	<div>
		<p>{trans.reason}</p>
		<p class="text-sm text-subtext">
			{dtf.format(trans.date)}
		</p>
	</div>
	<div>
		<Number small value={trans.amount} />
	</div>
</button>

<Dialog bind:open class="px-4">
	<div class="flex justify-center">
		<Number value={trans.amount} />
	</div>

	<p class="text-center text-2xl">{trans.reason}</p>
	<p class="mt-4 text-subtext">
		Added {dtf.format(trans.date)}.
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
			class="underline"
		>
			Undo
		</ConfirmDialog>
	</p>
</Dialog>
