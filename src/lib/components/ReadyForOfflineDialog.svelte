<script lang="ts">
	import { LucideCloudOff } from 'lucide-svelte';
	import Dialog from './Dialog.svelte';

	let open = $state(false);

	// on SW message event
	$effect(() => {
		const fn = (ev: MessageEvent<any>) => {
			if (ev.data.type === 'install') open = true;
		};
		navigator.serviceWorker.addEventListener('message', fn);
		return () => navigator.serviceWorker.removeEventListener('message', fn);
	});
</script>

<Dialog class="px-4" bind:open>
	<LucideCloudOff class="mx-auto mt-2 size-10" />
	<h2 class="mt-6 text-center text-2xl font-bold text-pretty">
		mony can now be used while offline!
	</h2>
	<button
		class="mt-6 w-full button accent transition-colors hover:bg-accent/75"
		onclick={() => (open = false)}
	>
		Great!
	</button>
</Dialog>
