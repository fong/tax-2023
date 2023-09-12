<script>
	import { onMount } from 'svelte';
	// import { createSlider, melt } from '@melt-ui/svelte';
	import Slider from '../lib/Slider.svelte';
	import AverageTaxRate from '../lib/charts/AverageTaxRate.svelte';
	import IncomeTax from '../lib/charts/IncomeTax.svelte';
	import clsx from 'clsx';
	import { cn } from '../utils/twMerge';

	import '../utils/toCurrency';

	import { createToggleGroup, melt } from '@melt-ui/svelte';

	let min = 0;
	let max = 301;
	let chart;
	let labelLower = 0;
	let labelUpper = 301;
	let panel = 'income-tax';
	let graphOptions = [
		{ id: 'income-tax', label: 'Income Tax' },
		{ id: 'average-tax-rate', label: 'Average Tax Rate' },
		{ id: 'tax-delta', label: 'Tax Difference' }
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

	let labels = new Array(max - min).fill(0).map((_, i) => (i + min) * 1000);
</script>

<h1 class="text-7xl font-light mt-8 mb-0">Election 2023</h1>
<h2 class="text-3xl font-bold mb-8">Tax Policies</h2>
<h3 class="text-2xl italic">What do the proposed tax brackets actually mean?</h3>
<div class="mb-8">
	<label for="income-slider" class="text-sm z-10 mb-4"
		>Click and drag the black bars to change the select an income range:
	</label>
</div>
<Slider {labels} bind:labelLower bind:labelUpper />
<div
	use:melt={$root}
	class="grid md:grid-cols-4 grid-cols-1 grid-rows-4 md:grid-rows-1 mb-0 md:mb-8"
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
{/if}

<style>
</style>
