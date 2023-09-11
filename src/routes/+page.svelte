<script>
	import { onMount } from 'svelte';
	// import { createSlider, melt } from '@melt-ui/svelte';
	import Slider from '../lib/Slider.svelte';
	import AverageTaxRate from '../lib/charts/AverageTaxRate.svelte';
	import IncomeTax from '../lib/charts/IncomeTax.svelte';
	import '../utils/toCurrency';

	// const {
	// 	elements: { root, range, thumb },
	// 	states: { value }
	// } = createSlider({
	// 	defaultValue: [0, 300],
	// 	min: 0,
	// 	max: 300,
	// 	step: 1
	// });

	let min = 0;
	let max = 301;
	let chart;
	let labelLower = 0;
	let labelUpper = 301;

	let labels = new Array(max - min).fill(0).map((_, i) => (i + min) * 1000);
</script>

<h1 class="text-7xl font-light mb-0">Election 2023</h1>
<h2 class="text-3xl font-bold mb-8">Tax Policies</h2>
<h3 class="text-2xl italic mb-16">What do the proposed tax brackets actually mean?</h3>
<Slider {labels} bind:labelLower bind:labelUpper />
<IncomeTax {labels} {labelLower} {labelUpper} {min} {max} />
<AverageTaxRate {labels} {labelLower} {labelUpper} {min} {max} />

<style>
</style>
