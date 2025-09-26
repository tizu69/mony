<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { store } from '$lib/monystore';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header
	class="sticky top-0 z-10 flex space-x-2 overflow-x-scroll bg-background/80 p-4 backdrop-blur-sm"
>
	{#snippet card(text: string, href: string)}
		{@const current = page.url.pathname === new URL(href, page.url).pathname}
		<a
			{href}
			class={[
				'rounded-full px-4 py-2 text-nowrap transition-colors',
				current ? 'bg-accent text-background' : 'bg-layer hover:bg-layer/50'
			]}
		>
			{text}
		</a>
	{/snippet}

	{#each store.current.projects as project}
		{@render card(project.name, `/p/${project.id}`)}
	{/each}
	{@render card('+', `/`)}
</header>

{@render children?.()}
