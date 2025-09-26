<script lang="ts">
	import { goto } from '$app/navigation';
	import { store } from '$lib/monystore';
	import { LucideChevronRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>mony</title>
</svelte:head>

<main class="flex min-h-[80dvh] flex-col items-center justify-center p-4">
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
</main>
