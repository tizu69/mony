<script lang="ts">
	import { page } from '$app/state';
	import ReadyForOfflineDialog from '$lib/components/ReadyForOfflineDialog.svelte';
	import { store } from '$lib/monystore';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/pwa_icon.png" />
</svelte:head>

<header class="sticky top-0 z-10 flex w-full overflow-x-scroll border-b bg-back1 px-4">
	{#snippet card(text: string, href: string)}
		{@const current = page.url.pathname === new URL(href, page.url).pathname}
		<a {href} class={['group block px-1 py-2', current && 'border-b-2 border-text']}>
			<span class="rounded px-2 py-1.5 group-hover:bg-hover-back">{text}</span>
		</a>
	{/snippet}

	{@render card('mony', `/`)}
	{#each store.getProjects() as project}
		{@render card(project.name, `/p/${project.id}`)}
	{/each}
</header>

<ReadyForOfflineDialog />
{@render children?.()}
