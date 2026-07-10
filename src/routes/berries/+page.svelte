<script lang="ts">
	import BerryCard from '$lib/components/BerryCard.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Berries | Pokédex</title>
	<meta name="description" content="Browse every berry in the Pokémon world." />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Berries</h1>
	<p class="mt-2 text-slate-600 dark:text-slate-400">
		{data.berries.length} berries found
	</p>

	<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each data.berries as berry (berry.id)}
			<BerryCard {berry} />
		{/each}
	</div>
</div>
