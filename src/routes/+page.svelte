<script>
	import { onMount } from 'svelte';
	import Slider from '../lib/Slider.svelte';
	import { cn } from '../utils/twMerge';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import '../utils/toCurrency';
	import { createToggleGroup, melt } from '@melt-ui/svelte';
	import AverageTaxRate from '../lib/charts/AverageTaxRate.svelte';
	import IncomeTax from '../lib/charts/IncomeTax.svelte';
	import TaxDifference from '../lib/charts/TaxDifference.svelte';

	let min = 0;
	let max = 301;
	let chart;
	let labelLower;
	let labelUpper;
	let panel = 'income-tax';
	let graphOptions = [
		{ id: 'income-tax', label: 'Income Tax' },
		{ id: 'average-tax-rate', label: 'Average Tax Rate' },
		{ id: 'tax-comparison', label: 'Tax Comparison' }
		// { id: 'income-tax-distribution', label: 'Tax Income Distribution' },
		// { id: 'assessed-tax-distribution', label: 'Tax Assessed Distribution' }
	];

	const {
		elements: { root, item },
		states: { value }
	} = createToggleGroup({
		type: 'single',
		defaultValue: 'income-tax',
		onValueChange: (v) => {
			if (panel !== v.next) {
				panel = v.next;
			}
		}
	});

	onMount(() => {
		panel = parseInt($page.url.searchParams.get('chart')) || 'income-tax';
		value.set(panel);
	});

	$: {
		if (browser) {
			const url = new URL(window.location.toString());
			url.searchParams.set('chart', panel);
			history.replaceState({}, '', url);
			value.set(panel);
		}
	}

	let labels = new Array(max - min).fill(0).map((_, i) => (i + min) * 1000);
</script>

<header class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
	<h1 class="text-4xl md:text-7xl font-light mt-8 mb-0">Election 2023</h1>
	<h2 class="text-3xl font-bold mb-6">Tax Policies</h2>
	<h3 class="text-xl md:text-2xl italic mb-6">What do the proposed tax brackets actually mean?</h3>
</header>
<main class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
	<div class="mb-8">
		<label for="income-slider" class="text-sm z-10 mb-4"
			>Click and drag the black bars to change the select an income range:
		</label>
	</div>
	<Slider {labels} bind:labelLower bind:labelUpper />
	<div
		use:melt={$root}
		class="grid md:grid-cols-5 grid-cols-1 grid-rows-4 md:grid-rows-1 mt-16 mb-0 md:mb-8"
		aria-label="Graph selection"
	>
		{#each graphOptions as option, index}
			<button
				class={cn(
					'px-1 py-2',
					'focus:outline-4 focus:outline focus:outline-gray-300',
					panel === option.id ? 'bg-black text-white' : 'bg-black/20 text-black',
					index === 0 && 'rounded-t-md md:rounded-bl-md md:rounded-tr-none',
					index === graphOptions.length - 1 && 'rounded-b-md md:rounded-tr-md md:rounded-bl-none'
				)}
				use:melt={$item(option.id)}
				aria-label={option.label}
			>
				{option.label}
			</button>
		{/each}
	</div>

	{#if panel === 'income-tax'}
		<IncomeTax {labels} {labelLower} {labelUpper} {min} {max} />
	{:else if panel === 'average-tax-rate'}
		<AverageTaxRate {labels} {labelLower} {labelUpper} {min} {max} />
	{:else if panel === 'tax-comparison'}
		<TaxDifference {labels} {labelLower} {labelUpper} {min} {max} />
	{/if}
</main>

<footer class="w-full mx-auto mt-16 px-4 md:px-12 py-4 bg-black/10">
	<div class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
		<h4 class="text-xl">Notes:</h4>
		<ol class="list-disc">
			<li>
				The top 30,190 taxpayers earning $300,000+ make up the remaining 0.38% of the population
			</li>
			<li>
				Population distribution data above $200,000 is only available in $5,000 intervals and has
				been averaged. Population count/percentage within each interval above $200,000 is an
				approximation only.
			</li>
			<li>
				NZ First has been excluded from the comparisons and they have not provided a definitive tax
				policy other than to <a
					class="italic font-bold hover:text-blue-700 hover:underline"
					href="https://www.nzfirst.nz/2023_commitments"
					target="_blank">ensure tax income brackets are adjusted to inflation</a
				>
			</li>
		</ol>
		<div class="mt-4">
			<a
				href="https://github.com/fong/tax-2023"
				target="_blank"
				aria-label="Github source repo"
				class="hover:text-blue-700 hover:underline">Github</a
			>
		</div>
	</div>
</footer>

<!-- <TaxRevenueDistribution /> -->

<style>
</style>
