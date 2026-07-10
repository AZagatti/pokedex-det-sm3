<script lang="ts">
	import { page } from '$app/state';
	import { Moon, Sun, Menu, X } from 'lucide-svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { base } from '$app/paths';

	let mobileOpen = $state(false);

	const links = [
		{ href: `${base}/`, label: 'Pokédex' },
		{ href: `${base}/berries`, label: 'Berries' },
		{ href: `${base}/favorites`, label: 'Favorites' }
	];

	function isActive(href: string): boolean {
		if (href === `${base}/`) {
			return page.url.pathname === `${base}/` || page.url.pathname === base;
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<header
	class="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
		<a href="{base}/" class="flex items-center gap-2 text-lg font-bold tracking-tight">
			<span
				class="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm"
			>
				<span class="h-3 w-3 rounded-full border-2 border-white bg-white"></span>
			</span>
			Pokédex
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out {isActive(
						link.href
					)
						? 'bg-black/5 text-text dark:bg-white/10'
						: 'text-text-muted hover:text-text'}"
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-1">
			<button
				type="button"
				class="grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-black/5 dark:hover:bg-white/10"
				aria-label={themeStore.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				onclick={() => themeStore.toggle()}
			>
				{#if themeStore.current === 'dark'}
					<Sun size={20} />
				{:else}
					<Moon size={20} />
				{/if}
			</button>
			<button
				type="button"
				class="grid h-11 w-11 place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-black/5 dark:hover:bg-white/10 sm:hidden"
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<nav class="flex flex-col gap-1 border-t border-border px-4 py-2 sm:hidden">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-lg px-3 py-2.5 text-sm font-medium {isActive(link.href)
						? 'bg-black/5 text-text dark:bg-white/10'
						: 'text-text-muted'}"
					onclick={() => (mobileOpen = false)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
