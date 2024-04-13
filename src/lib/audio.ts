export class BreathSound {
	private context: AudioContext;
	private started = false;

	constructor() {
		this.context = new AudioContext();
	}

	public close() {
		if (this.context.state !== 'closed') this.context.close();
	}

	// private createNoiseBuffer() {
	// 	const bufferSize = this.context.sampleRate; // 1 second of audio
	// 	const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
	// 	const output = buffer.getChannelData(0);

	// 	for (let i = 0; i < bufferSize; i++) {
	// 		output[i] = Math.random() * 2 - 1; // Generate white noise
	// 	}

	// 	return buffer;
	// }

	// public playBreathSound(duration: number = 4000, type: 'inhale' | 'exhale'): void {
	// 	const noiseBuffer = this.createNoiseBuffer();
	// 	const noiseSource = this.context.createBufferSource();
	// 	noiseSource.buffer = noiseBuffer;

	// 	// Create a biquad filter to control the noise
	// 	const biquadFilter = this.context.createBiquadFilter();
	// 	biquadFilter.type = 'bandpass';
	// 	biquadFilter.frequency.value = type === 'inhale' ? 1000 : 500; // Higher frequency for inhale, lower for exhale

	// 	// Adjust Q for a sharper filter
	// 	biquadFilter.Q.value = 10;

	// 	// Gain node for volume control
	// 	const gainNode = this.context.createGain();
	// 	gainNode.gain.setValueAtTime(0.3, this.context.currentTime); // Start with lower volume
	// 	gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration / 1000); // Fade out

	// 	// Connect nodes
	// 	noiseSource.connect(biquadFilter);
	// 	biquadFilter.connect(gainNode);
	// 	gainNode.connect(this.context.destination);

	// 	// Start and stop the noise source
	// 	noiseSource.start(this.context.currentTime);
	// 	noiseSource.stop(this.context.currentTime + duration / 1000);
	// }

	private createBreathBuffer(duration: number, type: 'inhale' | 'exhale'): AudioBuffer {
		const bufferSize = Math.ceil((duration * this.context.sampleRate) / 1000);
		const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
		const output = buffer.getChannelData(0);
		const breathRate = type === 'inhale' ? 0.5 : -0.5; // Adjust rate based on inhale or exhale

		let lastValue = 0;

		for (let i = 0; i < bufferSize; i++) {
			// Simulate a breath-like waveform using Perlin noise
			const value = lastValue + (Math.random() * 2 - 1) * 0.1;
			lastValue = value;
			output[i] = value * Math.sin((i * breathRate * Math.PI) / bufferSize); // Modulate with sine wave for airflow variation
		}

		return buffer;
	}

	public playBreathSound(duration: number = 4000, type: 'inhale' | 'exhale'): void {
		this.started = true;

		const breathBuffer = this.createBreathBuffer(duration, type);
		const breathSource = this.context.createBufferSource();
		breathSource.buffer = breathBuffer;

		// Create a biquad filter to shape the breath sound
		const biquadFilter = this.context.createBiquadFilter();
		biquadFilter.type = 'bandpass';
		biquadFilter.frequency.value = type === 'inhale' ? 5000 : 2000; // Higher frequency for inhale, lower for exhale
		biquadFilter.Q.value = 2; // Adjust Q factor for a smoother filter response

		// Gain node for volume control
		const gainNode = this.context.createGain();
		gainNode.gain.setValueAtTime(25, this.context.currentTime); // Start with lower volume
		gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration / 1000); // Fade out

		// Connect nodes
		breathSource.connect(biquadFilter);
		biquadFilter.connect(gainNode);
		gainNode.connect(this.context.destination);

		// Start and stop the breath source
		breathSource.start(this.context.currentTime);
		breathSource.stop(this.context.currentTime + duration / 1000);
	}

	public pause() {
		return this.context.suspend();
	}

	public resume() {
		return this.context.resume();
	}
}
