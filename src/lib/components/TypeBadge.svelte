<script lang="ts">
	import { typeColor, typeTextColor } from '$lib/utils/types';
	import { formatName } from '$lib/utils/format';

	const { type, size = 'md' }: { type: string; size?: 'sm' | 'md' } = $props();

	const sizeClasses = $derived(size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1');
</script>

<span
	class="inline-flex items-center rounded-full font-semibold uppercase tracking-wide shadow-sm {sizeClasses}"
	style="background-color: {typeColor(type)}; color: {typeTextColor(type)}"
>
	{formatName(type)}
</span>
