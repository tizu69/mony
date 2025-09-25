<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import { LucideWallet } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Transaction from './Transaction.svelte';

	const { data } = $props();
	const project = $derived(data.project);

	let dtf = $derived(
		new Intl.DateTimeFormat(store.current.locale, {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			year: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4">
		<Number value={store.getFunds(project)} />
	</div>

	<button onclick={() => store.addTrans(project, Math.round(Math.random() * 10), 'foo')}>
		Add EUR
	</button>
	<button onclick={() => store.addTrans(project, -Math.round(Math.random() * 10), 'bar')}>
		Sub EUR
	</button>

	<div class="space-y-1">
		{#each store.getTrans(project).toReversed() as trans (trans.id)}
			<div animate:flip transition:slide>
				<Transaction {trans} {dtf} />
			</div>
		{/each}
	</div>

	<ConfirmDialog
		icon={LucideWallet}
		title="Delete {project.name}? 🥺"
		text="This cannot be undone. All the funds & expenses you added will be gone. Are you sure?"
		button="Delete"
		waitFor={10}
		onconfirm={() => {
			setTimeout(() => {
				store.deleteProject(project);
				goto(`/`);
			}, 500);
		}}
		class="button text-xs text-subtext underline"
	>
		Delete Project
	</ConfirmDialog>
</main>
