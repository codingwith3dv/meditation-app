<script lang="ts">
	import '../app.pcss';
	import '@phosphor-icons/web/regular';
	import '@phosphor-icons/web/fill';
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('preline/preline');
		window.HSStaticMethods.autoInit();
	});
</script>

<div class="w-full h-full min-h-full">
	<slot />
</div>
