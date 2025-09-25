<script lang="ts">
	import { goto } from '$app/navigation';
	import { store } from '$lib/monystore';
</script>

<main class="flex min-h-[80dvh] flex-col items-center justify-center p-4">
	<h1 class="mb-4 text-4xl font-bold">mony</h1>

	<form
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
			required
			name="name"
			class="mr-2 rounded bg-layer p-2"
		/>
		<button type="submit" class="rounded bg-accent px-4 py-2 font-bold text-background">
			-&gt;
		</button>
	</form>
</main>
