<script lang="ts">
	import { goto } from '$app/navigation';
	import { CloudOffIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// redirect to `/` if someone tries to access `/appshell`
	// otherwise redirect to the current url so sveltekit renders the page
	onMount(() =>
		goto(
			location.pathname.startsWith('/_sw_appshell') ? '/' : location.pathname + location.search,
			{
				replaceState: true
			}
		)
	);
</script>

<div class="grid h-dvh w-dvw place-items-center">
	<CloudOffIcon class="size-8 text-subtext" />
</div>
