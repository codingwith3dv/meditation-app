<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const isPlaying = getContext<Writable<boolean>>('isPlaying');

	// Timer
	let minutesNum = 11;
	let minutes: string | number = String(minutesNum);
	let seconds: string | number = '00';
	let timingFunc: ReturnType<typeof setInterval> | null;
	function startTimer(duration: number) {
		let start = Date.now();
		let diff;
		$isPlaying = true;
		function timer() {
			// get the number of seconds that have elapsed since
			// startTimer() was called
			diff = duration - (((Date.now() - start) / 1000) | 0);

			// does the same job as parseInt truncates the float
			let tMinutes = (diff / 60) | 0;
			let tSeconds = diff % 60 | 0;

			if (tMinutes === 0 && tSeconds === 0) {
				stopTimer();
				return;
			}

			minutes = tMinutes < 10 ? '0' + tMinutes : tMinutes;
			seconds = tSeconds < 10 ? '0' + tSeconds : tSeconds;

			if (diff <= 0) {
				// add one second so that the count down starts at the full duration
				// example 05:00 not 04:59
				start = Date.now() + 1000;
			}
		}
		// we don't want to wait a full second before the timer starts
		timer();
		timingFunc = setInterval(timer, 1000);
	}
	function stopTimer() {
		if (timingFunc) {
			clearInterval(timingFunc);
			timingFunc = null;
		}
		$isPlaying = false;
		minutes = String(minutesNum);
		seconds = '00';
	}
	function resetTimer() {
		if (timingFunc) {
			clearInterval(timingFunc);
			timingFunc = null;
		}
		minutes = String(minutesNum);
		seconds = '00';
	}
</script>

<div class="flex flex-row items-center gap-2">
	<div class="font-semibold">
		{minutes}:{seconds}
	</div>
	<button
		type="button"
		class="block rounded-full bg-primary p-2 border border-gray-300"
		on:click={() => {
			if (timingFunc) {
				stopTimer();
			} else {
				startTimer(60 * minutesNum);
			}
		}}
	>
		<i class="ph-fill {timingFunc ? 'ph-pause' : 'ph-play'} grid place-items-center align-middle"
		></i>
	</button>
	<!-- <button
    type="button"
    class="block rounded-full bg-primary/20 p-2 border border-gray-300"
    on:click={() => {
      resetTimer();
    }}
  >
    <i class="ph-fill ph-arrow-counter-clockwise grid place-items-center align-middle"></i>
  </button> -->
</div>
