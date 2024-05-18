<script lang="ts">
	import { BreathSound } from '$lib/audio';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	/** In seconds */
	export let inhale: Writable<number>;
	/** In seconds */
	export let pause: Writable<number>;
	/** In seconds */
	export let exhale: Writable<number>;
	/** In seconds */
	export let endPause: Writable<number>;
	export let isPlaying: Writable<boolean>;
	export let isFirstTime: Writable<boolean>;

	let cell: HTMLDivElement;
	let outline: SVGCircleElement;
	let body: HTMLBodyElement;

	let tl: gsap.core.Timeline | null;

	let currentMode: 'inhale' | 'hold' | 'exhale' | '' = '';
	const threshold = 0.1;
	const dashOffset = 60 * 3.14 * 2; /* 370.52 */

	let sound: BreathSound;
	let isMd: boolean = false;

	function matches(query: string) {
		return window.matchMedia(query).matches;
	}

	function handleResize() {
		isMd = matches('(min-width: 768px)');
	}

	const breath = () => {
		gsap.ticker.lagSmoothing(false);

		sound?.close();
		sound = new BreathSound();

		tl = gsap.timeline({
			repeat: -1,
			repeatDelay: $endPause,
			repeatRefresh: true
		});
		tl.to(cell, {});
		tl.to(cell, {
			duration: $inhale,
			scale: isMd ? 1.5 : 1.25,
			transformOrigin: '50% 50%',
			ease: 'sine.inOut',
			onStart: () => {
				currentMode = 'inhale';
				sound.playBreathSound($inhale * 1000, 'inhale');
			},
			onComplete: () => {
				if ($pause >= threshold) currentMode = 'hold';
			}
		});
		tl.to(
			outline,
			{
				duration: $inhale,
				ease: 'sine.inOut',
				css: {
					strokeDashoffset: 0,
					stroke: '#9a3412'
				}
			},
			0
		);
		tl.to(
			cell,
			{
				duration: $exhale,
				scale: 1,
				transformOrigin: '50% 50%',
				ease: 'sine.inOut',
				onStart: () => {
					currentMode = 'exhale';
					sound.playBreathSound($exhale * 1000, 'exhale');
				},
				onComplete: () => {
					if ($endPause >= threshold) currentMode = 'hold';
				}
			},
			$inhale + $pause
		);
		tl.to(
			outline,
			{
				duration: $exhale,
				ease: 'sine.inOut',
				css: {
					strokeDashoffset: dashOffset
				}
			},
			$inhale + $pause
		);
	};

	/* In minutes */
	let duration = 0;
	let startDate = new Date();

	const pauseTl = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
		tl?.pause();
		sound.pause();
		duration = Math.round(((new Date().getTime() - startDate.getTime()) / 1000 / 60) * 10) / 10;
	};
	const resumeTl = () => {
		if (!document.fullscreenElement) {
			document
				.getElementsByTagName('body')[0]
				.requestFullscreen()
				.catch((err) => {
					alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
				});
		}
		tl?.resume();
		sound.resume();
		duration = 0;
		startDate = new Date();
	};

	onMount(() => {
		isMd = matches('(min-width: 768px)');

		const reset = () => {
			if (tl) {
				tl.kill();
				tl = null;
			}
			breath();
		};
		inhale.subscribe(() => {
			reset();
		});
		exhale.subscribe(() => {
			reset();
		});
		pause.subscribe(() => {
			reset();
		});
		endPause.subscribe(() => {
			reset();
		});
		isPlaying.subscribe((v) => {
			if (v) {
				resumeTl();
			} else {
				pauseTl();
			}
		});
	});

	const showShareModal = () => {
		// @ts-ignore
		window?.HSOverlay.open(document.getElementById('hs-basic-modal'));
	};
</script>

<svelte:window on:resize={handleResize} />

<div
	id="hs-basic-modal"
	class="hs-overlay hs-overlay-backdrop-open:bg-primary/20 hidden pt-7 sm:max-w-xl sm:w-full px-3 sm:mx-auto w-full !h-fit fixed inset-x-0 bottom-2 sm:bottom-14 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
>
	<div class="w-full">
		<div class="flex mx-auto flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
			<div class="flex justify-between items-center py-3 px-4 border-b">
				<h3 class="font-bold text-gray-800 text-2xl">
					Congratulations, you meditated for {duration} minutes today.
				</h3>
				<button
					type="button"
					class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
					data-hs-overlay="#hs-basic-modal"
				>
					<span class="sr-only">Close</span>
					<i class="ph ph-x grid place-items-center align-middle"></i>
				</button>
			</div>
			<div class="p-4 space-y-4 overflow-y-auto">
				<p class="mt-1 text-gray-800 text-lg">
					Share this achievement with your friends and followers.
				</p>
				<a
					id="share-on-x"
					target="_blank"
					href={'https://twitter.com/intent/tweet' +
						`?text=${encodeURIComponent(`I meditated for ${duration} minutes today on meditation[.]deveshdas[.]com`)}`}
					class="py-3 px-4 inline-flex align-middle items-center gap-x-2 text-sm text-black font-semibold rounded-lg border border-transparent bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					<span class="block bottom-0.5 relative"> Share on </span>
					<i class="ph ph-x-logo grid place-items-center align-middle text-xl"></i>
				</a>
			</div>
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={cell}
	class="bg-primary relative border border-primary/50 shadow-xl w-52 h-52 rounded-full grid place-items-center hover:cursor-pointer"
	on:click={() => {
		if ($isPlaying) {
			$isPlaying = false;
			if ($isFirstTime) {
				showShareModal();
				// $isFirstTime = false;
			}
		} else {
			$isPlaying = true;
		}
	}}
>
	<svg viewBox="0 0 120 120" class="-rotate-90 absolute w-[calc(100%_+_4px)] h-[calc(100%_+_4px)]">
		<circle
			bind:this={outline}
			cx="60"
			cy="60"
			r="58"
			stroke="transparent"
			stroke-width="3"
			fill="transparent"
			stroke-dasharray={dashOffset}
			stroke-dashoffset={dashOffset}
		/>
	</svg>
	<span class="capitalize text-xl font-mono">{currentMode}</span>
</div>
