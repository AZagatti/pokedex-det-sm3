<script lang="ts">
	import { formatName, idFromUrl, padId } from '$lib/utils/format';
	import { base } from '$app/paths';
	import type { EvolutionChainLink } from '$lib/api/schemas';
	import { ArrowRight } from 'lucide-svelte';

	const { chain }: { chain: EvolutionChainLink } = $props();

	function flatten(link: EvolutionChainLink): EvolutionChainLink[][] {
		if (link.evolves_to.length === 0) {return [[link]];}
		return link.evolves_to.flatMap((child) =>
			flatten(child).map((path) => [link, ...path])
		);
	}

	const stages = $derived(flatten(chain));
</script>

<div class="flex flex-col gap-4">
	{#each stages as stage, i (i)}
		<div class="flex flex-wrap items-center gap-2">
			{#each stage as link, j (link.species.name)}
				{#if j > 0}
					<div class="flex flex-col items-center px-1 text-slate-400">
						<ArrowRight size={18} aria-hidden="true" />
						{#if link.min_level}
							<span class="text-[10px] font-medium">Lv. {link.min_level}</span>
						{:else if link.trigger_name}
							<span class="text-[10px] font-medium capitalize">{link.trigger_name.replace('-', ' ')}</span>
						{/if}
					</div>
				{/if}
				<a
					href="{base}/pokemon/{link.species.name}"
					class="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center transition-colors duration-150 ease-out hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800"
				>
					<img
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{idFromUrl(
							link.species.url
						)}.png"
						alt={formatName(link.species.name)}
						loading="lazy"
						width="72"
						height="72"
						class="h-16 w-16 object-contain sm:h-18 sm:w-18"
					/>
					<span class="text-xs text-slate-400">{padId(idFromUrl(link.species.url))}</span>
					<span class="text-sm font-semibold">{formatName(link.species.name)}</span>
				</a>
			{/each}
		</div>
	{/each}
</div>
