<script lang="ts">
	import { writable } from 'svelte/store';
	import Cell from './Cell.svelte';
	import Methods from './Methods.svelte';
	import { setContext } from 'svelte';
	import Timer from './Timer.svelte';
	import { persisted } from 'svelte-persisted-store';

	const inhale = persisted('inhaleDuration', 5.5);
	const pause = persisted('inhalePauseDuration', 0);
	const exhale = persisted('exhaleDuration', 5.5);
	const endPause = persisted('exhalePauseDuration', 0);

	const isFirstTime = persisted('isFirstTime', true);

	const isPlaying = writable(false);
	const isOverlayOpen = writable(false);

	const step = 0.5;

	setContext('inhale', inhale);
	setContext('pause', pause);
	setContext('exhale', exhale);
	setContext('endPause', endPause);
	setContext('isPlaying', isPlaying);
	setContext('isOverlayOpen', isOverlayOpen);
	setContext('isFirstTime', isFirstTime);
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
			class="absolute hidden md:block w-64 h-[77%] overflow-y-auto overflow-x-hidden top-1/2 -translate-y-1/2 left-4 bg-neutral-200 border border-black/50 rounded-xl py-2"
		>
			<Methods></Methods>
		</div>

		<div
			class="absolute top-4 right-4 rounded-full px-2 py-2 hidden md:block bg-gray-100 shadow-md"
		>
			<Timer />
		</div>

		<Cell {inhale} {exhale} {pause} {endPause} {isPlaying} {isFirstTime}></Cell>
	</div>

	<div
		class="-translate-x-full fixed top-0 start-0 transition-all duration-300 transform h-full max-w-xs w-full z-[80] bg-white border-e"
		tabindex="-1"
		class:translate-x-0={$isOverlayOpen}
	>
		<div class="flex justify-between items-center py-3 px-4 border-b">
			<h3 class="font-bold text-gray-800">Choose method</h3>
			<button
				type="button"
				class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
				on:click={() => {
					$isOverlayOpen = false;
				}}
			>
				<span class="sr-only">Close modal</span>
				<i class="ph ph-x grid place-items-center align-middle text-xl"></i>
			</button>
		</div>
		<div class="py-4">
			<Methods></Methods>
		</div>
	</div>

	<div class="w-full h-fit bg-primary/5 py-2 md:py-4 px-4 md:px-6">
		<div class="flex flex-row gap-3 items-center mb-2">
			<button
				type="button"
				class="md:hidden py-2 px-3 w-full inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:pointer-events-none"
				on:click={() => {
					$isOverlayOpen = true;
				}}
			>
				Choose method
			</button>
			<div class="block md:hidden">
				<Timer />
			</div>
		</div>
		<div class="grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 rounded-lg !overflow-hidden">
			<!-- Inhale -->
			<div class="bg-white border border-gray-200 md:rounded-lg">
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-1 px-3">
						<span class="block text-gray-500 text-sm md:text-base"> Inhale ( seconds ) </span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0"
							type="number"
							bind:value={$inhale}
						/>
					</div>
					<div class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200">
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium md:rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
							on:click={() => {
								if ($inhale >= 1) $inhale = $inhale - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
			<div class="bg-white border border-gray-200 md:rounded-lg">
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-1 px-3">
						<span class="block text-gray-500 text-sm md:text-base">
							Pause after inhale ( seconds )
						</span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0"
							type="number"
							bind:value={$pause}
						/>
					</div>
					<div class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200">
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium md:rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
							on:click={() => {
								if ($pause > 0) $pause = $pause - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
			<div class="bg-white border border-gray-200 md:rounded-lg">
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-1 px-3">
						<span class="block text-gray-500 text-sm md:text-base"> Exhale ( seconds ) </span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0"
							type="number"
							bind:value={$exhale}
						/>
					</div>
					<div class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200">
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium md:rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
							on:click={() => {
								if ($exhale >= 1) $exhale = $exhale - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
			<div class="bg-white border border-gray-200 md:rounded-lg">
				<div class="w-full flex justify-between items-center gap-x-1">
					<div class="grow py-1 px-3">
						<span class="block text-gray-500 text-sm md:text-base">
							Pause after exhale ( seconds )
						</span>
						<input
							class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0"
							type="number"
							bind:value={$endPause}
						/>
					</div>
					<div class="flex flex-col -gap-y-px divide-y divide-gray-200 border-s border-gray-200">
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium md:rounded-se-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
							on:click={() => {
								if ($endPause > 0) $endPause = $endPause - step;
							}}
						>
							<i class="ph ph-minus grid place-items-center align-middle text-base"></i>
						</button>
						<button
							type="button"
							class="size-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-lg bg-gray-50 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
