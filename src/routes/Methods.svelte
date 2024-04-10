<script lang="ts">
	import { dev } from '$app/environment';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const inhale = getContext<Writable<number>>('inhale');
	const pause = getContext<Writable<number>>('pause');
	const exhale = getContext<Writable<number>>('exhale');
	const endPause = getContext<Writable<number>>('endPause');
	const isPlaying = getContext<Writable<boolean>>('isPlaying');
	const isOverlayOpen = getContext<Writable<boolean>>('isOverlayOpen');

	let methods = [
		{
			name: 'Stress relief',
			timing: [4, 7, 8, 0.5]
		},
		{
			name: 'Box breath',
			timing: [4, 4, 4, 4]
		},
		...(dev
			? [
					{
						name: 'Test',
						timing: [1, 0, 1, 0]
					}
				]
			: [])
	];
</script>

<div class="flex flex-col h-full divide-y divide-black/20">
	{#each methods as method}
		<button
			class="text-start flex flex-col gap-2 py-2 hover:bg-neutral-300 px-4 cursor-pointer"
			on:click={() => {
				$isPlaying = false;
				$isOverlayOpen = false;

				$inhale = method.timing[0];
				$pause = method.timing[1];
				$exhale = method.timing[2];
				$endPause = method.timing[3];

				$isPlaying = true;
			}}
		>
			<h2 class="font-semibold">{method.name}</h2>
			<span class="text-black/50">Timing: {method.timing.join(', ')}</span>
		</button>
	{/each}

	<div class="px-4 py-1 text-black/60 grow grid items-end">Select a method to start</div>
</div>
