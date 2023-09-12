<script>
	import { createSlider, melt } from '@melt-ui/svelte';
	import PopulationDistribution from '../lib/charts/PopulationDistribution.svelte';
	import { distribution } from './distribution';

	export let labels;
	export let labelLower;
	export let labelUpper;
	let visualLower = labelLower;
	let visualUpper = labelUpper;
	let timer;
	let width;
	let sliderArea;
	let popCount;
	let totalPopulation = 4362650;

	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		defaultValue: [0, 132],
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

	$: {
		popCount = 0;
		distribution.forEach((v) => {
			if (v.x >= labelLower * 1000 && v.x <= labelUpper * 1000) {
				popCount += v.y;
			}
		});
	}
</script>

<div class="relative mb-8 flex-col">
	<div class="flex flex-col justify-center items-center">
		<div class="text-2xl font-semibold">
			{(visualLower * 1000).toCurrency()} - {(visualUpper * 1000).toCurrency()}
		</div>
		<div class="flex">
			<div class="text-sm mr-4">
				{((popCount / totalPopulation) * 100).toFixed(2)}% of all taxpayers
			</div>
			<div class="text-sm">
				{popCount.toLocaleString('en-NZ')} people
			</div>
		</div>
	</div>
	<div class="mt-0 flex w-auto items-center flex-col z-0">
		<div class="relative w-full h-[256px]">
			<div class="absolute top-[89px] z-20 h-[188px] ml-16 mr-8" style="width: {width - 90}px">
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
							class="block h-[188px] w-1 bg-black focus:ring-4 focus:ring-black/40"
						/>
					{/each}
				</div>
			</div>
			<div class="absolute top-0 z-0 w-full">
				<PopulationDistribution {labels} {labelLower} {labelUpper} bind:width />
			</div>
		</div>
		<div class="flex justify-end w-full">
			<div class="text-sm italic">
				Taxable income distribution of individuals, Inland Revenue Department, 2021
			</div>
		</div>
	</div>
</div>

<style>
	.mask {
		/* clip: rect(10px, 190px, 190px, 10px); */
	}
</style>
