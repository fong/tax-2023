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
	let labelLower;
	let labelUpper;
	let panel;
	let popCount;
	let totalPopulation;
	let graphOptions = [
		{ id: 'income-tax', label: 'Income Tax' },
		{ id: 'average-tax-rate', label: 'Average Tax Rate' },
		{ id: 'tax-comparison', label: 'Tax Comparison' }
		// { id: 'income-tax-distribution', label: 'Tax Income Distribution' },
		// { id: 'assessed-tax-distribution', label: 'Tax Assessed Distribution' }
	];
	let copyText = 'Copy link to graph';

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
		panel = $page.url.searchParams.get('chart') || 'income-tax';
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

	const copyLink = () => {
		if (browser) {
			navigator.clipboard.writeText(window.location.toString() + '#graph').then(
				() => {
					/* clipboard successfully set */
					copyText = 'Copied!';
					setTimeout(() => {
						copyText = 'Copy link to graph';
					}, 3000);
				},
				() => {
					/* clipboard write failed */
					copyText = 'Copy Failed!';
					setTimeout(() => {
						copyText = 'Copy link to graph';
					}, 3000);
				}
			);
		}
	};
</script>

<svelte:head>
	<title>Election 2023 - Tax Policies</title>
	<meta charset="UTF-8" />
	<!-- HTML Meta Tags -->
	<title>Tax Policy Comparison - Election 2023</title>
	<meta
		name="description"
		content="What do the proposed tax brackets actually mean for you and the rest of the NZ population?"
	/>

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://tax.tofoo.co/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Tax Policy Comparison - Election 2023" />
	<meta
		property="og:description"
		content="What do the proposed tax brackets actually mean for you and the rest of the NZ population?"
	/>
	<meta property="og:image" content="https://tax.tofoo.co/og.jpg" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="tax.tofoo.co" />
	<meta property="twitter:url" content="https://tax.tofoo.co/" />
	<meta name="twitter:title" content="Tax Policy Comparison - Election 2023" />
	<meta
		name="twitter:description"
		content="What do the proposed tax brackets actually mean for you and the rest of the NZ population?"
	/>
	<meta name="twitter:image" content="https://tax.tofoo.co/og.jpg" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<header class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
	<h1 class="text-4xl md:text-6xl font-light mt-8 mb-0">Election 2023</h1>
	<h2 class="text-3xl font-bold mb-6">Tax Policies</h2>
	<h3 class="text-xl md:text-2xl italic mb-6">
		What do the proposed tax brackets actually mean for you and the rest of the NZ population?
	</h3>
</header>
<main class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
	<div class="mb-4">
		<label for="income-slider" class="text-sm z-10 mb-4"
			>Click and drag the black bars to change the income range:
		</label>
	</div>
	<Slider {labels} bind:labelLower bind:labelUpper bind:totalPopulation bind:popCount />
	<div id="graph">
		<div
			use:melt={$root}
			class="grid md:grid-cols-5 grid-cols-1 grid-rows-4 md:grid-rows-1 mt-16 mb-0 md:mb-8"
			aria-label="Graph selection"
		>
			{#each graphOptions as option, index}
				<a
					class={cn(
						'px-1 py-2 text-center',
						'focus:outline-4 focus:outline focus:outline-gray-800',
						panel === option.id ? 'bg-black text-white' : 'bg-black/20 text-black',
						index === 0 && 'rounded-t-md md:rounded-bl-md md:rounded-tr-none',
						index === graphOptions.length - 1 && 'rounded-b-md md:rounded-tr-md md:rounded-bl-none'
					)}
					use:melt={$item(option.id)}
					href="#graph"
					tabindex="0"
					aria-label={option.label}
				>
					{option.label}
				</a>
			{/each}
		</div>
		<div class="flex justify-end">
			<button
				on:click={copyLink}
				class="w-32 border-2 border-black/40 text-black/75 text-sm px-1 rounded hover:bg-black/10"
				>{copyText}</button
			>
		</div>
		{#if panel === 'income-tax'}
			<IncomeTax {labels} {labelLower} {labelUpper} {min} {max} {totalPopulation} {popCount} />
		{:else if panel === 'average-tax-rate'}
			<AverageTaxRate {labels} {labelLower} {labelUpper} {min} {max} {totalPopulation} {popCount} />
		{:else if panel === 'tax-comparison'}
			<TaxDifference {labels} {labelLower} {labelUpper} {min} {max} {totalPopulation} {popCount} />
		{/if}
	</div>
</main>

<footer class="w-full mx-auto mt-16 px-4 md:px-12 py-4 md:py-8 bg-black/10">
	<div class="max-w-[1200px] mx-auto px-4 md:px-12 py-4">
		<h4 class="text-xl">Notes:</h4>
		<ol class="list-disc">
			<li class="my-1 ml-6">
				The income range from $0 to $300,000 covers 99.62% of the taxpayers. The top taxpayers
				earning $300,000+ make up the remaining 0.38% of taxpayers (30,190 people).
			</li>
			<li class="my-1 ml-6">
				Population distribution data above $200,000 is only available in $5,000 intervals.
				Population count/percentage within each $5,000 interval above $200,000 is an averaged
				approximation only.
			</li>
			<li class="my-1 ml-6">
				The comparisons above are based upon the steady state of the proposed party tax policy. For
				example, ACT policy has an incremental adoption policy which reaches it's two-rate tax
				policy on FY2025/26, NZ First policy includes inflation adjustment from 2027 (not further
				defined).
			</li>
			<li class="my-1 ml-6">
				Calculations for ACT include the <a
					class="italic font-bold hover:text-blue-700 hover:underline"
					href="https://www.act.org.nz/tax"
					target="_blank">Low and Middle Income Tax Offset (LMITO)</a
				> for incomes between $2,000 to $58,000.
			</li>
			<!-- <li class="my-1 ml-6">
				NZ First has been excluded from the comparisons as they have not provided a definitive tax
				bracket policy other than to <a
					class="italic font-bold hover:text-blue-700 hover:underline"
					href="https://www.nzfirst.nz/2023_commitments"
					target="_blank">ensure tax income brackets are adjusted to inflation</a
				>.
			</li> -->
		</ol>
		<div class="mt-8 flex justify-end">
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
