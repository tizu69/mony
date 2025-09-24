<script lang="ts">
	import { store } from '$lib/monystore';
	import NumberFlow from '@number-flow/svelte';

	let {
		value = $bindable(),
		writeable = false
	}: {
		value: number;
		writeable?: boolean;
	} = $props();
</script>

<div class="relative">
	<NumberFlow
		class="text-5xl font-bold"
		locales={store.current.locale}
		format={{ currency: store.current.currency, style: 'currency' }}
		{value}
	/>
	{#if writeable}
		<input
			type="number"
			bind:value
			class="absolute inset-0 h-full w-full cursor-text text-[1px] opacity-0"
			onchange={(e) => {
				// on change, update the value to be a float with 2 decimal places
				value = parseFloat(parseFloat(e.currentTarget.value).toFixed(2));
				if (isNaN(value)) value = 0;
				if (value < 0) value = 0;
				if (value > 999_999) value = 999_999;
			}}
		/>
	{/if}
</div>
