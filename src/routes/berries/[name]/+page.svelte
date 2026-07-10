<script lang="ts">
	import { formatName, capitalize } from '$lib/utils/format';
	import { flavorColor } from '$lib/utils/flavors';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { base } from '$app/paths';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const berry = $derived(data.berry);
	const spriteUrl = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${berry.name}-berry.png`
	);
</script>

<svelte:head>
	<title>{formatName(berry.name)} | Pokédex</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
	<a
		href="{base}/berries"
		class="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
	>
		&larr; Back to Berries
	</a>

	<div class="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
		<img src={spriteUrl} alt={formatName(berry.name)} width="96" height="96" class="h-24 w-24 object-contain" />
		<h1 class="text-3xl font-extrabold">{formatName(berry.name)} Berry</h1>
		<TypeBadge type={berry.natural_gift_type.name} />
	</div>

	<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Firmness</p>
			<p class="mt-1 text-lg font-bold">{formatName(berry.firmness.name)}</p>
		</div>
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Size</p>
			<p class="mt-1 text-lg font-bold">{berry.size / 10} cm</p>
		</div>
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Smoothness</p>
			<p class="mt-1 text-lg font-bold">{berry.smoothness}</p>
		</div>
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Growth Time</p>
			<p class="mt-1 text-lg font-bold">{berry.growth_time}h</p>
		</div>
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Max Harvest</p>
			<p class="mt-1 text-lg font-bold">{berry.max_harvest}</p>
		</div>
		<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
			<p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Gift Power</p>
			<p class="mt-1 text-lg font-bold">{berry.natural_gift_power}</p>
		</div>
	</div>

	<section class="mt-8">
		<h2 class="mb-3 text-xl font-bold">Flavors</h2>
		<div class="flex flex-wrap gap-2">
			{#each berry.flavors as f (f.flavor.name)}
				{#if f.potency > 0}
					<span
						class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
						style="background-color: {flavorColor(f.flavor.name)}"
					>
						{capitalize(f.flavor.name)}
						<span class="text-white/80">{f.potency}</span>
					</span>
				{/if}
			{/each}
		</div>
	</section>
</div>
