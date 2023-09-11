<script>
	import { createSlider, melt } from '@melt-ui/svelte';
	import PopulationDistribution from '../lib/charts/PopulationDistribution.svelte';
	import { onMount } from 'svelte';

	export let labels;
	export let labelLower;
	export let labelUpper;
	let visualLower = labelLower;
	let visualUpper = labelUpper;
	let timer;
	let width;
	let sliderArea;

	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		defaultValue: [0, 300],
		min: 0,
		max: 300,
		step: 1
	});

	const debounce = (v) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			labelLower = v[0];
			labelUpper = v[1];
		}, 100);
	};

	value.subscribe((value) => {
		visualLower = value[0];
		visualUpper = value[1];
		debounce(value);
	});

	onMount(() => {});
	// $: console.log(sliderArea.style.left);
</script>

<div class="relative mb-8">
	<label for="income-slider" class="font-bold z-10 absolute">Select an income range: </label>
	<div class="-mt-4 flex w-auto items-center flex-col z-0">
		<div class="relative w-full h-[200px]">
			<div class="absolute top-11 z-20 h-[100px] ml-12 mr-8" style="width: {width - 56}px">
				<div id="income-slider" use:melt={$root} class="flex items-center">
					<div
						id="slider-area"
						use:melt={$range}
						bind:this={sliderArea}
						class="absolute h-full border-2 border-black border-dotted"
					/>
					<div class="block h-[86px] w-full" />

					{#each $value as _}
						<span
							use:melt={$thumb()}
							class="block h-[100px] w-1 bg-black focus:ring-4 focus:ring-black/40"
						/>
					{/each}
				</div>
			</div>
			<div class="flex justify-center">
				<span>${visualLower},000 - ${visualUpper},000</span>
			</div>
			<div class="absolute top-0 z-0 w-full pl-4 pr-6">
				<PopulationDistribution {labels} {labelLower} {labelUpper} bind:width />
			</div>
		</div>
	</div>
</div>

<style>
	.mask {
		/* clip: rect(10px, 190px, 190px, 10px); */
	}
</style>
