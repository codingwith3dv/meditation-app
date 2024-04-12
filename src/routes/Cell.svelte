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

	let cell: HTMLDivElement;
	let outline: SVGCircleElement;

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
			repeatRefresh: true,
			onRepeat: () => {
				if ($endPause >= threshold) currentMode = 'hold';
			}
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
					if ($pause >= threshold) currentMode = 'hold';
				}
			},
			`+=${$pause}`
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
				tl?.resume();
			} else {
				tl?.pause();
			}
		});
	});
</script>

<svelte:window on:resize={handleResize} />

<div
	bind:this={cell}
	class="bg-primary relative border border-primary/50 shadow-xl w-52 h-52 rounded-full grid place-items-center"
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
