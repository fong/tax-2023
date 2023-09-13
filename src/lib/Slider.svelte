<script>
	import { onMount } from 'svelte';
	import { createSlider, melt } from '@melt-ui/svelte';
	import PopulationDistribution from '../lib/charts/PopulationDistribution.svelte';
	import { distribution } from './distribution';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let labels;
	export let labelLower;
	export let labelUpper;
	let visualLower = labelLower;
	let visualUpper = labelUpper;
	let timer;
	let width;
	let sliderArea;
	let popCount;
	let totalPopulation = 4516880;
	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		defaultValue: [0, 138],
		min: 0,
		max: 300,
		step: 1
	});

	onMount(() => {
		labelLower = parseInt($page.url.searchParams.get('lower')) || 0;
		labelUpper = parseInt($page.url.searchParams.get('upper')) || 138;
		value.set([labelLower, labelUpper]);
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

	$: {
		if (browser) {
			const url = new URL(window.location.toString());
			url.searchParams.set('lower', labelLower);
			url.searchParams.set('upper', labelUpper);
			history.replaceState({}, '', url);
			value.set([labelLower, labelUpper]);
		}
	}
</script>

<div class="relative mb-8 flex-col">
	<div class="flex flex-col justify-center items-center min-h-[72px]">
		<div class="text-2xl font-semibold">
			{(visualLower * 1000).toCurrency()} - {(visualUpper * 1000).toCurrency()}
		</div>
		<div class="flex flex-col items-center md:flex-row">
			<div class="text-sm mr-4 text-center">
				Approximately {((popCount / totalPopulation) * 100).toFixed(2)}% of all taxpayers*
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
				<PopulationDistribution bind:width />
			</div>
		</div>
		<div class="flex justify-end w-full z-20 hover:underline hover:text-blue-700">
			<a
				class="text-sm italic"
				href="https://www.ird.govt.nz/about-us/tax-statistics/revenue-refunds/income-distribution/tax-on-taxable-income-datasets"
				target="_blank"
				aria-label="dataset source for Taxable income distribution of individuals, Inland Revenue Department"
			>
				Taxable income distribution of individuals, Inland Revenue Department, 2022
			</a>
		</div>
	</div>
</div>

<style>
	.mask {
		/* clip: rect(10px, 190px, 190px, 10px); */
	}
</style>
