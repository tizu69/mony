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

<header class="flex space-x-2 overflow-x-scroll p-4">
	{#snippet card(text: string, href: string)}
		{@const current = page.url.pathname === new URL(href, page.url).pathname}
		<a {href} class={['rounded-full px-2', current ? 'bg-accent text-background' : 'bg-layer']}>
			{text}
		</a>
	{/snippet}

	{#each store.current.projects as project}
		{@render card(project.name, `/p/${project.id}`)}
	{/each}
	{@render card('+', `/`)}
</header>

{@render children?.()}
