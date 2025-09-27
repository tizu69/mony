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

	let currencySupportsDecimal = $derived.by(() => {
		const formatter = new Intl.NumberFormat(store.current.locale, {
			style: 'currency',
			currency: store.current.currency
		});
		return formatter.format(0.12).includes('12');
	});
</script>

<div class="relative rounded-lg transition-colors peer-focus-within:bg-layer/50">
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
					if (!currencySupportsDecimal && value < 100) value = 0;
				} else if (e.key >= '0' && e.key <= '9') {
					// add new digit
					if (!currencySupportsDecimal) value = Math.floor(value / 100);
					value = value * 10 + parseInt(e.key);
					if (!currencySupportsDecimal) value = value * 100;
					value = Math.min(Math.max(value, 0), !currencySupportsDecimal ? maximum * 1000 : maximum);
				}
			}}
			onfocus={(e) => {
				const t = e.currentTarget;
				setTimeout(() => {
					t.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
				}, 50);
			}}
		/>
	{/if}
</div>
