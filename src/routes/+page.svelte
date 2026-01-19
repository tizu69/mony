<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { store } from '$lib/monystore';
	import ISO639 from 'iso-639-1';
	import { LucideBadgeDollarSign, LucideChevronRight } from 'lucide-svelte';
	import StatGuesser from './StatGuesser.svelte';

	let showCurrencyChangeWarning = $state(false);
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="mb-[10vh] flex min-h-[30vh] flex-col items-center justify-center p-4">
		<h1 class="mb-4 bg-radial from-hover-text bg-clip-text p-4 text-8xl font-bold text-transparent">
			mony
		</h1>

		<form
			class="grid grid-cols-[auto_1fr] gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);

				const name = formData.get('name')?.toString();
				if (!name) return;

				const project = store.addProject(name);
				goto(`/p/${project.id}`);
			}}
		>
			<input
				type="text"
				placeholder="Project name"
				autocomplete="off"
				required
				name="name"
				class="w-full input"
				onchange={(e) => (e.currentTarget.value = e.currentTarget.value.trim())}
			/>
			<button type="submit" class="primary">
				<LucideChevronRight class="w-6 min-w-6" />
			</button>
		</form>
	</div>

	<StatGuesser />

	<div class="space-y-4 p-4">
		<div class="grid grid-cols-[auto_1fr_auto] items-center space-x-2">
			<p>Currency</p>
			<div class="border-b-2 border-dotted"></div>
			<select
				bind:value={store.current.currency}
				onchange={() => (showCurrencyChangeWarning = true)}
				class="input"
			>
				{#each Intl.supportedValuesOf('currency') as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>

			<ConfirmDialog
				bind:open={showCurrencyChangeWarning}
				icon={LucideBadgeDollarSign}
				title="Currency is experimental"
				text={'Changing the currency will not convert existing' +
					' transactions. In mony, one Euro is worth one US Dollar,' +
					' and one US Dollar is worth one British Pound. If you' +
					' travel often as part of a single project, you might want' +
					' to convert transactions before inserting them into mony.' +
					' Note that this may also be wrong, based on how the' +
					' exchange rates change over time. Mony also only really' +
					' works as intended for EUR-like currencies: The low on' +
					' funds warning will trigger at 7 <currency>, which may' +
					' be too low or too high for other currencies.'}
				button="Got it!"
			/>
		</div>
		<div class="grid grid-cols-[auto_1fr_auto] items-center space-x-2">
			<p>Locale</p>
			<div class="border-b-2 border-dotted"></div>
			<select bind:value={store.current.locale} class="input">
				{#each ISO639.getAllCodes() as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="grid grid-cols-[auto_1fr_auto] items-center space-x-2">
			<p>Modals</p>
			<div class="border-b-2 border-dotted"></div>
			<select bind:value={store.current.fullscreenModal} class="input">
				<option value={false}>Normal</option>
				<option value={true}>Compatibility</option>
			</select>
		</div>
	</div>
</main>
