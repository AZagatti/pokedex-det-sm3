<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { favoritesStore } from '$lib/stores/favorites.svelte';

	const { name, size = 20 }: { name: string; size?: number } = $props();

	const active = $derived(favoritesStore.has(name));

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		favoritesStore.toggle(name);
	}
</script>

<button
	type="button"
	class="grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-black/5 dark:hover:bg-white/10"
	aria-pressed={active}
	aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
	onclick={handleClick}
>
	<Heart
		size={size}
		class="transition-transform duration-150 ease-out {active
			? 'scale-110 fill-rose-500 text-rose-500'
			: 'text-text-muted'}"
	/>
</button>
