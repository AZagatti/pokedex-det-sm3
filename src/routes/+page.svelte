<script lang="ts">
	import { getGenerationDetail, getGenerationList, getTypeDetail, getTypeList } from '$lib/api/client';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import PokemonCardSkeleton from '$lib/components/PokemonCardSkeleton.svelte';
	import { formatName, idFromUrl } from '$lib/utils/format';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	interface Entry { name: string; url: string; id: number; types: string[] }

	const allEntries: Entry[] = $derived(
		data.allPokemon.map((p) => {
			const id = idFromUrl(p.url);
			return {
				id,
				name: p.name,
				types: data.typesByPokemonId[id] ?? [],
				url: p.url
			};
		})
	);

	let searchQuery = $state('');
	let selectedType = $state('');
	let selectedGeneration = $state('');
	let sortBy = $state<'id' | 'name'>('id');
	let visibleCount = $state(40);
	let typeOptions = $state<string[]>([]);
	let generationOptions = $state<{ name: string; label: string }[]>([]);
	let typeFilterIds = $state<Set<number> | null>(null);
	let generationSpeciesNames = $state<Set<string> | null>(null);
	let filterLoading = $state(false);
	let filterError = $state('');

	$effect(() => {
		async function loadFilters() {
			const typeRes = await getTypeList(fetch);
			typeOptions = typeRes.results.map((r) => r.name).filter((n) => n !== 'unknown' && n !== 'shadow');
			const genRes = await getGenerationList(fetch);
			generationOptions = genRes.results.map((r) => ({
				label: r.name.replace('generation-', 'Gen ').toUpperCase(),
				name: r.name
			}));
		}
		loadFilters();
	});

	async function onTypeChange() {
		if (!selectedType) {
			typeFilterIds = null;
			return;
		}
		filterLoading = true;
		filterError = '';
		try {
			const detail = await getTypeDetail(fetch, selectedType);
			typeFilterIds = new Set(detail.pokemon.map((p) => idFromUrl(p.pokemon.url)));
		} catch {
			filterError = 'Could not load that type filter. Please try again.';
			selectedType = '';
			typeFilterIds = null;
		} finally {
			filterLoading = false;
		}
	}

	async function onGenerationChange() {
		if (!selectedGeneration) {
			generationSpeciesNames = null;
			return;
		}
		filterLoading = true;
		filterError = '';
		try {
			const detail = await getGenerationDetail(fetch, selectedGeneration);
			generationSpeciesNames = new Set(detail.pokemon_species.map((p) => p.name));
		} catch {
			filterError = 'Could not load that generation filter. Please try again.';
			selectedGeneration = '';
			generationSpeciesNames = null;
		} finally {
			filterLoading = false;
		}
	}

	const FORM_SUFFIXES = [
		'-alola',
		'-galar',
		'-hisui',
		'-paldea',
		'-mega',
		'-mega-x',
		'-mega-y',
		'-gmax',
		'-totem',
		'-primal',
		'-origin',
		'-therian',
		'-incarnate',
		'-crowned',
		'-eternamax',
		'-partner',
		'-starter',
		'-world-cap',
		'-cap'
	];

	function baseSpeciesName(name: string): string {
		for (const suffix of FORM_SUFFIXES) {
			if (name.endsWith(suffix)) {
				return name.slice(0, -suffix.length);
			}
		}
		return name;
	}

	const filtered = $derived.by(() => {
		let list = allEntries;
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			list = list.filter((p) => p.name.includes(q) || String(p.id) === q);
		}
		if (typeFilterIds) {
			list = list.filter((p) => typeFilterIds?.has(p.id));
		}
		if (generationSpeciesNames) {
			list = list.filter(
				(p) => generationSpeciesNames?.has(p.name) || generationSpeciesNames?.has(baseSpeciesName(p.name))
			);
		}
		const sorted = [...list];
		if (sortBy === 'name') {
			sorted.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			sorted.sort((a, b) => a.id - b.id);
		}
		return sorted;
	});

	const visible = $derived(filtered.slice(0, visibleCount));
	const hasMore = $derived(visibleCount < filtered.length);

	$effect(() => {
		void searchQuery;
		void selectedType;
		void selectedGeneration;
		void sortBy;
		visibleCount = 40;
	});

	let sentinel: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!sentinel) {return;}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMore) {
					visibleCount += 40;
				}
			},
			{ rootMargin: '400px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	function resetFilters() {
		searchQuery = '';
		selectedType = '';
		selectedGeneration = '';
		sortBy = 'id';
		typeFilterIds = null;
		generationSpeciesNames = null;
		filterError = '';
	}
</script>

<svelte:head>
	<title>Pokédex</title>
	<meta name="description" content="Browse, search, and explore every Pokémon." />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8 flex flex-col gap-4">
		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Explore the Pokédex</h1>
		<p class="text-slate-600 dark:text-slate-400">
			{filtered.length} Pokémon found
		</p>
		{#if filterError}
			<p class="text-sm font-medium text-rose-600 dark:text-rose-400" role="alert">{filterError}</p>
		{/if}

		<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<div class="relative flex-1">
				<label class="sr-only" for="search">Search Pokémon</label>
				<input
					id="search"
					type="search"
					placeholder="Search by name or number…"
					bind:value={searchQuery}
					class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
				/>
			</div>

			<select
				bind:value={selectedType}
				onchange={onTypeChange}
				class="rounded-xl border border-slate-300 bg-white px-3 py-3 text-base shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
				aria-label="Filter by type"
			>
				<option value="">All Types</option>
				{#each typeOptions as t (t)}
					<option value={t}>{formatName(t)}</option>
				{/each}
			</select>

			<select
				bind:value={selectedGeneration}
				onchange={onGenerationChange}
				class="rounded-xl border border-slate-300 bg-white px-3 py-3 text-base shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
				aria-label="Filter by generation"
			>
				<option value="">All Generations</option>
				{#each generationOptions as g (g.name)}
					<option value={g.name}>{g.label}</option>
				{/each}
			</select>

			<select
				bind:value={sortBy}
				class="rounded-xl border border-slate-300 bg-white px-3 py-3 text-base shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
				aria-label="Sort by"
			>
				<option value="id">Sort: Number</option>
				<option value="name">Sort: Name</option>
			</select>

			{#if searchQuery || selectedType || selectedGeneration || sortBy !== 'id'}
				<button
					type="button"
					onclick={resetFilters}
					class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
				>
					Clear
				</button>
			{/if}
		</div>
	</div>

	{#if filterLoading}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each Array(10) as _, i (i)}
				<PokemonCardSkeleton />
			{/each}
		</div>
	{:else if visible.length === 0}
		<div class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 py-24 text-center dark:border-slate-700">
			<p class="text-lg font-semibold">No Pokémon found</p>
			<p class="text-slate-500 dark:text-slate-400">Try a different search term or clear your filters.</p>
			<button
				type="button"
				onclick={resetFilters}
				class="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
			>
				Clear filters
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each visible as entry (entry.id)}
				<PokemonCard id={entry.id} name={entry.name} types={entry.types} />
			{/each}
		</div>
		{#if hasMore}
			<div bind:this={sentinel} class="mt-8 flex justify-center">
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
					{#each Array(5) as _, i (i)}
						<PokemonCardSkeleton />
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
