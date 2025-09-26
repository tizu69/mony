<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Number from '$lib/components/Number.svelte';
	import { store } from '$lib/monystore';
	import { LucidePlus, LucideWallet } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Transaction from './Transaction.svelte';
	import AddTransaction from './AddTransaction.svelte';
	import StatGuesser from './StatGuesser.svelte';

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
	<title>{project.name} &bull; mony</title>
</svelte:head>

<main>
	<div class="flex items-center justify-center p-4 pt-0">
		<Number value={store.getFunds(project)} />
	</div>

	<StatGuesser {project} />

	<div class="mt-4 grid grid-cols-1 gap-1 md:grid-cols-2">
		{#each store.getTrans(project).toReversed() as trans (trans.id)}
			<div animate:flip transition:slide>
				<Transaction {trans} {dtf} />
			</div>
		{/each}
	</div>
	<AddTransaction class="button fixed right-6 bottom-6 z-10 !rounded-2xl accent !py-4" {project}>
		<LucidePlus />
	</AddTransaction>

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
		class="my-2 py-4 text-xs text-subtext underline "
	>
		Delete Project
	</ConfirmDialog>
</main>
