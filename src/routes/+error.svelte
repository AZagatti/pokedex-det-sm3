<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Not Found | Pokédex</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
	<p class="text-6xl">🔍</p>
	<h1 class="text-3xl font-extrabold tracking-tight">
		{page.status === 404 ? 'Page not found' : 'Something went wrong'}
	</h1>
	<p class="text-text-muted">
		{page.error?.message ?? 'The page you are looking for does not exist.'}
	</p>
	<a
		href="{base}/"
		class="mt-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-indigo-500"
	>
		Back to Pokédex
	</a>
</div>
