<script lang="ts">
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import StatBar from '$lib/components/StatBar.svelte';
	import EvolutionChain from '$lib/components/EvolutionChain.svelte';
	import { formatName, padId } from '$lib/utils/format';
	import { typeGradient } from '$lib/utils/types';
	import { base } from '$app/paths';
	import { ArrowLeft, Volume2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const pokemon = $derived(data.pokemon);
	const species = $derived(data.species);
	const evolutionChain = $derived(data.evolutionChain);

	const artwork = $derived(
		pokemon.sprites.other?.['official-artwork']?.front_default ??
			pokemon.sprites.front_default ??
			''
	);
	const shinyArtwork = $derived(
		pokemon.sprites.other?.['official-artwork']?.front_shiny ?? null
	);

	let showShiny = $state(false);
	const displayArtwork = $derived(showShiny && shinyArtwork ? shinyArtwork : artwork);
	let showAllMoves = $state(false);

	const gradient = $derived(typeGradient(pokemon.types[0]?.type.name ?? 'normal'));

	const flavorText = $derived(
		(
			species.flavor_text_entries.find((e) => e.language.name === 'en')?.flavor_text ?? ''
		)
			.replaceAll(/[\n\f\r]/gu, ' ')
			.trim()
	);

	const genus = $derived(species.genera.find((g) => g.language.name === 'en')?.genus ?? '');

	const heightM = $derived((pokemon.height / 10).toFixed(1));
	const weightKg = $derived((pokemon.weight / 10).toFixed(1));

	const cryUrl = $derived(pokemon.cries?.latest ?? null);
	let audioEl: HTMLAudioElement | undefined = $state();

	async function playCry() {
		try {
			await audioEl?.play();
		} catch {
			// autoplay/decode failures are non-critical; ignore
		}
	}
</script>

<svelte:head>
	<title>{formatName(pokemon.name)} | Pokédex</title>
	<meta name="description" content={flavorText || `Details for ${formatName(pokemon.name)}`} />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
	<a
		href="{base}/"
		class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
	>
		<ArrowLeft size={16} aria-hidden="true" />
		Back to Pokédex
	</a>

	<div
		class="relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10"
		style="background: {gradient}"
	>
		<div class="absolute inset-0 bg-black/10"></div>
		<div class="relative">
		<div class="absolute right-4 top-4 z-10 flex items-center gap-2">
			{#if cryUrl}
				<button
					type="button"
					onclick={playCry}
					class="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors duration-150 ease-out hover:bg-white/25"
					aria-label="Play cry"
				>
					<Volume2 size={20} aria-hidden="true" />
				</button>
				<audio bind:this={audioEl} src={cryUrl} preload="none"></audio>
			{/if}
			<FavoriteButton name={pokemon.name} size={24} />
		</div>

		<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-8">
			<button
				type="button"
				onclick={() => shinyArtwork && (showShiny = !showShiny)}
				class="grid place-items-center rounded-2xl bg-white/10 p-2 transition-transform duration-200 ease-out {shinyArtwork
					? 'cursor-pointer hover:scale-105'
					: 'cursor-default'}"
				disabled={!shinyArtwork}
				aria-label={shinyArtwork ? 'Toggle shiny artwork' : undefined}
			>
				<img
					src={displayArtwork}
					alt={formatName(pokemon.name)}
					width="200"
					height="200"
					class="h-40 w-40 object-contain drop-shadow-xl sm:h-52 sm:w-52"
				/>
			</button>
			<div class="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
				<span class="text-sm font-semibold text-white/70">{padId(pokemon.id)}</span>
				<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
					{formatName(pokemon.name)}
				</h1>
				{#if genus}
					<p class="text-white/80">{genus}</p>
				{/if}
				<div class="mt-1 flex gap-2">
					{#each pokemon.types as t (t.type.name)}
						<TypeBadge type={t.type.name} />
					{/each}
				</div>
				{#if species.is_legendary || species.is_mythical}
					<span
						class="mt-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide"
					>
						{species.is_mythical ? 'Mythical' : 'Legendary'}
					</span>
				{/if}
			</div>
		</div>
		</div>
	</div>

	{#if flavorText}
		<p class="mt-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">{flavorText}</p>
	{/if}

	<div class="mt-8 grid gap-8 sm:grid-cols-2">
		<section>
			<h2 class="mb-3 text-lg font-bold">Physical</h2>
			<dl class="grid grid-cols-2 gap-4">
				<div class="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
					<dt class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
						Height
					</dt>
					<dd class="text-xl font-bold tabular-nums">{heightM} m</dd>
				</div>
				<div class="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
					<dt class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
						Weight
					</dt>
					<dd class="text-xl font-bold tabular-nums">{weightKg} kg</dd>
				</div>
			</dl>

			<h2 class="mb-3 mt-6 text-lg font-bold">Abilities</h2>
			<ul class="flex flex-wrap gap-2">
				{#each pokemon.abilities as a (a.ability.name)}
					<li
						class="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium capitalize dark:bg-slate-800"
					>
						{formatName(a.ability.name)}
						{#if a.is_hidden}
							<span class="text-xs text-slate-400">(Hidden)</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2 class="mb-3 text-lg font-bold">Base Stats</h2>
			<div class="flex flex-col gap-2.5">
				{#each pokemon.stats as s (s.stat.name)}
					<StatBar label={s.stat.name.replace('special-', 'sp. ')} value={s.base_stat} />
				{/each}
			</div>
		</section>
	</div>

	{#if evolutionChain}
		<section class="mt-8">
			<h2 class="mb-3 text-lg font-bold">Evolution Chain</h2>
			<EvolutionChain chain={evolutionChain} />
		</section>
	{/if}

	<section class="mt-8">
		<h2 class="mb-3 text-lg font-bold">Moves</h2>
		<div class="flex flex-wrap gap-2">
			{#each pokemon.moves.slice(0, showAllMoves ? pokemon.moves.length : 20) as m (m.move.name)}
				<span
					class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium capitalize dark:border-slate-700"
				>
					{formatName(m.move.name)}
				</span>
			{/each}
			{#if pokemon.moves.length > 20}
				<button
					type="button"
					onclick={() => (showAllMoves = !showAllMoves)}
					class="rounded-full px-3 py-1 text-xs font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
				>
					{showAllMoves ? 'Show less' : `+${pokemon.moves.length - 20} more`}
				</button>
			{/if}
		</div>
	</section>
</div>
