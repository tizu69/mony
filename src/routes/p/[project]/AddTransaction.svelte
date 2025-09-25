<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import type { Project } from '$lib/types';
	import type { Snippet } from 'svelte';

	let p: { children?: Snippet; class?: string; project: Project } = $props();
	let isExpense = $state(store.getTrans(p.project).length > 0);
</script>

<Dialog triggerClass={p.class} trigger={p.children} class="px-4">
	<div class="grid grid-cols-2">
		<button class={['button', isExpense && 'accent']} onclick={() => (isExpense = true)}>
			Expense
		</button>
		<button class={['button', !isExpense && 'accent']} onclick={() => (isExpense = false)}>
			Add funds
		</button>
	</div>

	<Number value={12} writeable />
</Dialog>
