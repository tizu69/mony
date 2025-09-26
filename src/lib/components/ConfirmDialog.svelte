<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';

	let {
		open = $bindable(false),
		...p
	}: {
		title: string;
		text: string;
		button: string;
		icon: ConstructorOfATypedSvelteComponent;
		onconfirm?: () => void;
		waitFor?: number;

		open?: boolean;
		children?: Snippet;
		class?: string;
	} = $props();

	let buttonSecs = $state(0);
	let buttonSecsTimer = $state<number>();
	$effect(() => {
		clearTimeout(untrack(() => buttonSecsTimer));
		if (open) {
			buttonSecs = p.waitFor ?? 0;
			buttonSecsTimer = setInterval(() => {
				if (untrack(() => buttonSecs) > 0) buttonSecs--;
			}, 1000);
		}
	});
</script>

<Dialog class="px-4" bind:open trigger={p.children} triggerClass={p.class}>
	<p.icon class="mx-auto mt-2 size-10" />
	<h2 class="mt-6 text-center text-2xl font-bold">{p.title}</h2>
	<p class="mt-2 text-center text-sm text-subtext">{p.text}</p>
	<button
		disabled={!!buttonSecs}
		class={[
			'mt-6 w-full button transition-colors',
			!buttonSecs ? 'accent hover:bg-accent/75' : 'cursor-not-allowed layer opacity-50'
		]}
		onclick={() => {
			open = false;
			p.onconfirm?.();
		}}
	>
		{p.button}
		{#if buttonSecs > 0}({buttonSecs}){/if}
	</button>
</Dialog>
