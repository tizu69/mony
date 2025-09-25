<script lang="ts">
	import { store } from '$lib/monystore';
	import NumberFlow from '@number-flow/svelte';

	let {
		value = $bindable(),
		writeable = false,
		maximum = 1_000_000_00,
		small = false
	}: {
		value: number;
		writeable?: boolean;
		maximum?: number;
		small?: boolean;
	} = $props();

	// this weird setup essentially ensures that the number animates on first
	// render as well
	let displayedValue = $state(0);
	$effect(() => {
		displayedValue = value / 100;
	});
</script>

<div class="relative">
	<NumberFlow
		class={['px-2 font-bold tabular-nums', !small ? 'text-5xl' : 'text-2xl'].join(' ')}
		locales={store.current.locale}
		format={{ currency: store.current.currency, style: 'currency' }}
		value={displayedValue}
		trend={(oldValue: number, value: number) => Math.sign(Math.abs(value) - Math.abs(oldValue))}
	/>
	{#if writeable}
		<input
			type="number"
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
		/>
	{/if}
</div>
