<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import { base } from '$app/paths';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface text-text">
	<Nav />
	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
		{@render children()}
	</main>
	<footer class="border-t border-border py-6 text-center text-sm text-text-muted">
		Data from <a href="https://pokeapi.co" class="underline underline-offset-2" target="_blank" rel="noreferrer">PokéAPI</a>
	</footer>
</div>
