<script lang="ts">
	import { writable } from 'svelte/store';
	import Cell from './Cell.svelte';

	const inhale = writable(4);
	const pause = writable(7);
	const exhale = writable(8);
	const endPause = writable(0.5);

	const isPlaying = writable(false);

	const step = 0.5;

	let methods = [
		{
			name: 'Stress relief',
			timing: [4, 7, 8, 0.5]
		},
		{
			name: 'Box breath',
			timing: [4, 4, 4, 4]
		},
		{
			name: 'Test',
			timing: [1, 0, 1, 0]
		}
	];
</script>

<div class="w-full h-full flex flex-col">
	<div class="w-full grid grid-cols-3 gap-6 px-4 py-2">
		<h1 class="col-start-2 font-semibold text-xl text-center">Meditate</h1>
		<div class="self-end justify-self-end">
			<a href="https://x.com/cw3dv" aria-label="Twitter link" target="_blank">
				<span class="text-xl">
					<i class="ph ph-x-logo" />
				</span>
			</a>
		</div>
	</div>
	<div class="grow grid place-items-center w-full h-full relative">
		<div
			class="absolute w-64 h-[77%] overflow-y-auto overflow-x-hidden top-1/2 -translate-y-1/2 left-4 bg-neutral-200 border border-black/50 rounded-xl py-2"
		>
			<div class="flex flex-col h-full divide-y divide-black/20">
				{#each methods as method}
					<button
						class="text-start flex flex-col gap-2 py-2 hover:bg-neutral-300 px-4 cursor-pointer"
						on:click={() => {
							$isPlaying = false;

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

				<div class="px-4 py-1 text-black/60 grow grid items-end">Select a method to play</div>
			</div>
		</div>
		<Cell {inhale} {exhale} {pause} {endPause} {isPlaying}></Cell>
	</div>

	<div class="w-full h-fit bg-primary/5">
		<div class="grid grid-cols-4 gap-6 px-6 py-4">
			<!-- Inhale -->
			<div
				class="bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700"
			>
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-2 px-3">
						<span class="block text-gray-500 dark:text-gray-400"> Inhale ( seconds ) </span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white"
							type="number"
							bind:value={$inhale}
						/>
					</div>
					<div
						class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700"
					>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								if ($inhale >= 1) $inhale = $inhale - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								$inhale = $inhale + step;
							}}
						>
							<i class="ph ph-plus grid place-items-center align-middle text-base"></i>
						</button>
					</div>
				</div>
			</div>
			<!-- Inhale pause -->
			<div
				class="bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700"
			>
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-2 px-3">
						<span class="block text-gray-500 dark:text-gray-400">
							Pause after inhale ( seconds )
						</span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white"
							type="number"
							bind:value={$pause}
						/>
					</div>
					<div
						class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700"
					>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								if ($pause > 0) $pause = $pause - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								$pause = $pause + step;
							}}
						>
							<i class="ph ph-plus grid place-items-center align-middle text-base"></i>
						</button>
					</div>
				</div>
			</div>
			<!-- Exhale -->
			<div
				class="bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700"
			>
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-2 px-3">
						<span class="block text-gray-500 dark:text-gray-400"> Exhale ( seconds ) </span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white"
							type="number"
							bind:value={$exhale}
						/>
					</div>
					<div
						class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700"
					>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								if ($exhale >= 1) $exhale = $exhale - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								$exhale = $exhale + step;
							}}
						>
							<i class="ph ph-plus grid place-items-center align-middle text-base"></i>
						</button>
					</div>
				</div>
			</div>
			<!-- Exhale pause -->
			<div
				class="bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700"
			>
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-2 px-3">
						<span class="block text-gray-500 dark:text-gray-400">
							Pause after exhale ( seconds )
						</span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 dark:text-white"
							type="number"
							bind:value={$endPause}
						/>
					</div>
					<div
						class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200 dark:divide-gray-700 dark:border-gray-700"
					>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								if ($endPause > 0) $endPause = $endPause - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:text-white dark:hover:bg-gray-700"
							on:click={() => {
								$endPause = $endPause + step;
							}}
						>
							<i class="ph ph-plus grid place-items-center align-middle text-base"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
