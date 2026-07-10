<script lang="ts">
	import TypeBadge from './TypeBadge.svelte';
	import FavoriteButton from './FavoriteButton.svelte';
	import { padId, formatName } from '$lib/utils/format';
	import { typeGradient } from '$lib/utils/types';
	import { base } from '$app/paths';

	const {
		id,
		name,
		types = []
	}: { id: number; name: string; types?: string[] } = $props();

	const artwork = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
	);
	const gradient = $derived(typeGradient(types[0] ?? 'normal'));
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:border-white/10 dark:bg-slate-800"
	data-testid="pokemon-card"
>
	<div class="absolute inset-0 opacity-90" style="background: {gradient}"></div>
	<div class="absolute right-2 top-2 z-10">
		<FavoriteButton {name} />
	</div>
	<a
		href="{base}/pokemon/{name}"
		class="relative z-[1] flex flex-1 flex-col items-center px-4 pb-4 pt-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
	>
		<span class="self-start text-xs font-semibold text-white/80">{padId(id)}</span>
		<img
			src={artwork}
			alt={formatName(name)}
			loading="lazy"
			width="120"
			height="120"
			class="h-28 w-28 object-contain drop-shadow-md transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
		/>
		<h3 class="mt-1 text-base font-bold text-white drop-shadow-sm">{formatName(name)}</h3>
		<div class="mt-2 flex gap-1.5">
			{#each types as t (t)}
				<TypeBadge type={t} size="sm" />
			{/each}
		</div>
	</a>
</div>
