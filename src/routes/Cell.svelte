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

	let tl: gsap.core.Timeline | null;

	let currentMode: 'inhale' | 'hold' | 'exhale' | '' = '';
	const threshold = 0.1;

	let sound: BreathSound;

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
			scale: 1.5,
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
	};

	onMount(() => {
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

<div
	bind:this={cell}
	class="bg-primary border border-primary/50 shadow-xl w-52 h-52 rounded-3xl grid place-items-center"
>
	<span class="capitalize text-xl font-mono">{currentMode}</span>
</div>
