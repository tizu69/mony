<script lang="ts">
	import { store } from '$lib/monystore';
	import NumberFlow from '@number-flow/svelte';

	let {
		value = $bindable(),
		writeable = false,
		maximum = 1_000_000_00,
		small = false,
		autofocus,
		type = 'currency'
	}: {
		value: number;
		writeable?: boolean;
		maximum?: number;
		small?: boolean;
		autofocus?: boolean;
		type?: 'currency' | 'number';
	} = $props();

	let format = $derived.by(() => {
		if (type === 'currency') return { currency: store.current.currency, style: 'currency' };
		if (type === 'number') return { style: 'decimal' };
	});

	// this weird setup essentially ensures that the number animates on first
	// render as well
	let displayedValue = $state(0);
	$effect(() => {
		displayedValue = type !== 'currency' ? value : value / 100;
	});
</script>

<div class="relative">
	<NumberFlow
		class={['px-2 font-bold tabular-nums', !small ? 'text-5xl' : 'text-2xl'].join(' ')}
		locales={store.current.locale}
		{format}
		value={displayedValue}
		trend={(oldValue: number, value: number) => Math.sign(Math.abs(value) - Math.abs(oldValue))}
	/>
	{#if writeable}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			{autofocus}
			type="number"
			pattern="\d*"
			class="peer absolute inset-0 h-full w-full opacity-0"
			onkeypress={(e) => e.preventDefault()}
			onkeydown={(e) => {
				e.preventDefault();
				if (e.key === 'Backspace' || e.key === 'Delete') {
					// remove last digit
					value = Math.floor(value / 10);
				} else if (e.key >= '0' && e.key <= '9') {
					// add new digit
					let next = value * 10 + parseInt(e.key);
					next = Math.min(Math.max(next, 0), maximum);
					value = next;
				}
			}}
			onfocus={(e) =>
				e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })}
		/>
	{/if}
</div>
