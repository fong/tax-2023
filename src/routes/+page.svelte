<script>
	import { onMount } from 'svelte';
	import { createSlider, melt } from '@melt-ui/svelte';
	import AverageTaxRate from '../lib/charts/AverageTaxRate.svelte';
	import IncomeTax from '../lib/charts/IncomeTax.svelte';

	const {
		elements: { root, range, thumb },
		states: { value }
	} = createSlider({
		defaultValue: [0, 300],
		min: 0,
		max: 300,
		step: 1
	});

	let min = 0;
	let max = 301;
	let chart;
	let timer;
	let labelLower = 0;
	let labelUpper = 301;
	let visualLower = labelLower;
	let visualUpper = labelUpper;
	let labels = new Array(max - min).fill(0).map((_, i) => (i + min) * 1000);

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
</script>

<h1 class="text-7xl font-light mb-0">Election 2023</h1>
<h2 class="text-3xl font-bold mb-8">Tax Policies</h2>
<h3 class="text-2xl italic mb-16">What do the proposed tax brackets actually mean?</h3>
<div class="mt-8 flex w-auto items-center mx-16 flex-col">
	<label for="income-slider" class="font-bold">Select an income range: </label>
	<span id="income-slider" use:melt={$root} class="relative flex items-center h-[20px] w-full">
		<span class="block h-[3px] w-full bg-black/40">
			<span use:melt={$range} class="h-[3px] bg-black" />
		</span>

		{#each $value as _}
			<span
				use:melt={$thumb()}
				class="block h-5 w-5 rounded-full bg-black focus:ring-4 focus:ring-black/40"
			/>
		{/each}
	</span>
	<div class="flex justify-center">
		<span>${visualLower},000 - ${visualUpper},000</span>
	</div>
</div>
<IncomeTax {labels} {labelLower} {labelUpper} {min} {max} />
<AverageTaxRate {labels} {labelLower} {labelUpper} {min} {max} />

<style>
</style>
