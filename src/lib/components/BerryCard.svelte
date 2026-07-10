<script lang="ts">
	import { formatName, capitalize } from '$lib/utils/format';
	import { flavorColor } from '$lib/utils/flavors';
	import { base } from '$app/paths';
	import type { Berry } from '$lib/api/schemas';

	const { berry }: { berry: Berry } = $props();

	const spriteUrl = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${berry.name}-berry.png`
	);
	const topFlavor = $derived(
		[...berry.flavors].toSorted((a, b) => b.potency - a.potency)[0]
	);
</script>

<a
	href="{base}/berries/{berry.name}"
	class="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-800"
	data-testid="berry-card"
>
	<img
		src={spriteUrl}
		alt={formatName(berry.name)}
		loading="lazy"
		width="64"
		height="64"
		class="h-16 w-16 object-contain transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
	/>
	<h2 class="text-sm font-bold">{formatName(berry.name)} Berry</h2>
	<p class="text-xs text-slate-500 dark:text-slate-400">
		{capitalize(berry.firmness.name)} firmness
	</p>
	{#if topFlavor && topFlavor.potency > 0}
		<span
			class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
			style="background-color: {flavorColor(topFlavor.flavor.name)}"
		>
			{formatName(topFlavor.flavor.name)}
		</span>
	{/if}
</a>
