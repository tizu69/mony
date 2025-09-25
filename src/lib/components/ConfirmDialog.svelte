<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';

	let p: {
		title: string;
		text: string;
		button: string;
		icon: ConstructorOfATypedSvelteComponent;
		onconfirm: () => void;
		waitFor?: number;

		children?: Snippet;
		class?: string;
	} = $props();

	let open = $state(false);

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
	<p.icon class="mx-auto mt-2 size-8" />
	<h2 class="mt-4 text-center text-xl font-bold">{p.title}</h2>
	<p class="text-center text-sm text-subtext">{p.text}</p>
	<button
		disabled={!!buttonSecs}
		class={['button mt-4 w-full', !buttonSecs ? 'accent' : 'layer opacity-75']}
		onclick={() => {
			open = false;
			p.onconfirm();
		}}
	>
		{p.button}
		{#if buttonSecs > 0}({buttonSecs}){/if}
	</button>
</Dialog>
