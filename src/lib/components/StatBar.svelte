<script lang="ts">
	const {
		label,
		value,
		max = 255
	}: { label: string; value: number; max?: number } = $props();

	function statColor(v: number): string {
		if (v >= 100) {return '#22c55e';}
		if (v >= 60) {return '#eab308';}
		return '#ef4444';
	}

	const pct = $derived(Math.min(100, Math.round((value / max) * 100)));
	const barColor = $derived(statColor(value));
</script>

<div class="flex items-center gap-3">
	<span class="w-24 shrink-0 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
		>{label}</span
	>
	<span class="w-8 shrink-0 text-right text-sm font-bold tabular-nums">{value}</span>
	<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
		<div
			class="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
			style="width: {pct}%; background-color: {barColor}"
		></div>
	</div>
</div>
