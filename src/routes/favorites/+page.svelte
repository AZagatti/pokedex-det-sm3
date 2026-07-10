<script lang="ts">
	import { favoritesStore } from '$lib/stores/favorites.svelte';
	import { getPokemon } from '$lib/api/client';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import PokemonCardSkeleton from '$lib/components/PokemonCardSkeleton.svelte';
	import { base } from '$app/paths';

	let entries = $state<{ id: number; name: string; types: string[] }[]>([]);
	let loading = $state(true);

	$effect(() => {
		const names = [...favoritesStore.names];

		async function loadFavorites() {
			loading = true;
			try {
				const results = await Promise.allSettled(
					names.map(async (name) => {
						const p = await getPokemon(fetch, name);
						return { id: p.id, name: p.name, types: p.types.map((t) => t.type.name) };
					})
				);
				entries = results
					.filter((r) => r.status === 'fulfilled')
					.map((r) => r.value)
					.toSorted((a, b) => a.id - b.id);
			} finally {
				loading = false;
			}
		}

		loadFavorites();
	});
</script>

<svelte:head>
	<title>Favorites | Pokédex</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Favorites</h1>
	<p class="mt-2 text-slate-600 dark:text-slate-400">
		{favoritesStore.names.size} favorited Pokémon
	</p>

	{#if loading}
		<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each Array(favoritesStore.names.size || 4) as _, i (i)}
				<PokemonCardSkeleton />
			{/each}
		</div>
	{:else if entries.length === 0}
		<div class="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 py-24 text-center dark:border-slate-700">
			<p class="text-lg font-semibold">No favorites yet</p>
			<p class="text-slate-500 dark:text-slate-400">
				Tap the heart on any Pokémon to add it here.
			</p>
			<a
				href="{base}/"
				class="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
			>
				Browse Pokédex
			</a>
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each entries as entry (entry.id)}
				<PokemonCard id={entry.id} name={entry.name} types={entry.types} />
			{/each}
		</div>
	{/if}
</div>
