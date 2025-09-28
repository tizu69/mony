<script lang="ts">
	import { store } from '$lib/monystore';
	import { interpolate } from '$lib/utils';
	import { LucideX } from 'lucide-svelte';
	import { tick, type Snippet } from 'svelte';
	import { cubicOut, expoOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	let {
		children,
		open = $bindable(false),
		onclose,
		class: className = '',
		dismissible = true,
		trigger,
		triggerClass = ''
	}: {
		children: Snippet;
		open?: boolean;
		onclose?: () => void;
		class?: string;
		dismissible?: boolean;
		trigger?: Snippet;
		triggerClass?: string;
	} = $props();
	let visible = $state(open);

	let dialog: HTMLDialogElement | null = $state(null);
	let dialogDiv: HTMLDivElement | null = $state(null);

	let y = new Tween(1);
	$effect(() => {
		if (open) {
			visible = true;
			tick().then(() => {
				dialog?.showModal();
				dialogDiv!.scrollTop = 0;
				y.set(0, { easing: expoOut, duration: 500 });
			});
		} else {
			y.set(1, { easing: cubicOut, duration: 300 }).then(() => {
				dialog?.close();
				onclose?.();
				visible = false;
			});
		}
	});

	let translateY = $derived(interpolate(y.current, [0, 1], [0, 100]));
	let scale = $derived(interpolate(y.current, [0, 1], [100, 90]));
	let backdropOpacity = $derived(
		store.current.fullscreenModal ? 0 : interpolate(y.current, [1, 0], [0, 0.5])
	);
</script>

{#if trigger}
	<button onclick={() => (open = true)} class={triggerClass}>{@render trigger()}</button>
{/if}

{#if visible}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<dialog
		class={[
			'relative inset-0 items-center justify-center bg-transparent',
			' backdrop:bg-[var(--backdrop)] open:flex'
		]}
		style="--backdrop: rgba(0 0 0 / {backdropOpacity});"
		bind:this={dialog}
		onclick={() => dismissible && (open = false)}
		onclose={() => (open = false)}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={[
				'fixed inset-x-0 bottom-0 mx-auto max-w-2xl rounded-t-xl border-t',
				'border-layer bg-layer/50 py-4 text-text shadow-2xl backdrop-blur-2xl',
				'overflow-x-clip overflow-y-auto lg:bg-layer/75',
				store.current.fullscreenModal ? 'max-h-[99dvh] min-h-[99dvh]' : 'max-h-[90dvh]',
				className
			]}
			style="transform: translateY({translateY}%);
            transform-origin: bottom center;
            scale: {scale}%;"
			onclick={(e) => e.stopPropagation()}
			bind:this={dialogDiv}
		>
			{#if dismissible}
				<button class="sm absolute top-2 right-2 button layer !p-1" onclick={() => (open = false)}>
					<LucideX class="size-4" />
				</button>
			{/if}

			{@render children()}
		</div>
	</dialog>
{/if}
