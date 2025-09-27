<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { store } from '$lib/monystore';
	import ISO639 from 'iso-639-1';
	import { LucideBadgeDollarSign, LucideChevronRight } from 'lucide-svelte';

	let showCurrencyChangeWarning = $state(false);
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main>
	<div class="mb-[10dvh] flex h-[60dvh] flex-col items-center justify-center p-4">
		<h1
			class="mb-4 bg-gradient-to-br from-accent bg-clip-text p-4 text-8xl font-bold text-transparent"
		>
			mony
		</h1>

		<form
			class="flex flex-col space-x-2"
			onsubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);

				const name = formData.get('name')?.toString().trim();
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
				class="input"
			/>
			<button
				type="submit"
				class="mx-auto mt-2 button accent transition-transform hover:scale-110 active:scale-90"
			>
				<LucideChevronRight />
			</button>
		</form>
	</div>

	<hr />

	<div class="space-y-4 p-4">
		<div class="grid grid-cols-[auto_1fr_auto] space-x-2">
			<p>Currency</p>
			<div class="mb-1 border-b-2 border-dotted"></div>
			<select
				bind:value={store.current.currency}
				class="link-select"
				onchange={() => (showCurrencyChangeWarning = true)}
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
					' funds warning will trigger at 20 <currency>, which may' +
					' be too low or too high for other currencies.'}
				button="Got it!"
			/>
		</div>
		<div class="grid grid-cols-[auto_1fr_auto] space-x-2">
			<p>Locale</p>
			<div class="mb-1 border-b-2 border-dotted"></div>
			<select bind:value={store.current.locale} class="link-select">
				{#each ISO639.getAllCodes() as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
	</div>
</main>
