<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import {
		calculateTax,
		bracketsNational,
		bracketStatusQuo,
		bracketsAct,
		lmito,
		bracketsGreens,
		bracketsTPM,
		bracketsTOP
	} from '../../utils/generateData';

	export let labels;
	export let min = 0;
	export let max = 301;
	export let labelLower = 0;
	export let labelUpper = 301;
	let benchmark = 0;
	let transformedDatasets;
	let chart;

	const precalc = [
		new Array(max - min).fill(0).map((_, i) => calculateTax(i * 1000, bracketStatusQuo)),
		new Array(max - min).fill(0).map((_, i) => calculateTax(i * 1000, bracketsNational)),
		new Array(max - min)
			.fill(0)
			.map((_, i) => +(calculateTax(i * 1000, bracketsAct) - lmito(i * 1000) || 0).toFixed(6)),
		new Array(max - min).fill(0).map((_, i) => calculateTax(i * 1000, bracketsGreens)),
		new Array(max - min).fill(0).map((_, i) => calculateTax(i * 1000, bracketsTPM)),
		new Array(max - min).fill(0).map((_, i) => calculateTax(i * 1000, bracketsTOP))
	];

	const recalculate = (benchmark) => {
		return precalc.map((p) => {
			return p.map((v, i) => {
				return precalc[benchmark][i] - v;
			});
		});
	};

	$: {
		transformedDatasets = recalculate(benchmark);
		if (chart) {
			chart.data.labels = labels.slice(labelLower, labelUpper + 1);
			chart.data.datasets.forEach((dataset, i) => {
				dataset.data = transformedDatasets[i].slice(labelLower, labelUpper + 1);
			});
			chart.options.scales.x.min = labelLower * 1000;
			chart.options.scales.x.max = labelUpper * 1000;
			chart.options.plugins.title.text = `    Income Tax (${(labelLower * 1000).toCurrency()} - ${(
				labelUpper * 1000
			).toCurrency()})`;
			if (window.innerWidth < 480) {
				chart.options.scales.y.ticks.callback = function (x) {
					return `${(x / 1000).toCurrency()}k`;
				};
			} else {
				chart.options.scales.y.ticks.callback = function (x) {
					return `${x.toCurrency()}`;
				};
			}
			chart.update();
		}
	}

	onMount(async (promise) => {
		var ctx = document.getElementById('income-tax');
		var data = {
			labels: labels,
			yAxes: {},
			datasets: [
				{
					label: 'Labour',
					borderColor: '#d82c20',
					backgroundColor: '#d82c20',
					data: transformedDatasets[0],
					fill: false
				},
				{
					label: 'National',
					borderColor: '#0a3067',
					backgroundColor: '#0a3067',
					data: transformedDatasets[1],
					fill: false
				},
				{
					label: 'ACT',
					borderColor: '#fbbf03',
					backgroundColor: '#fbbf03',
					data: transformedDatasets[2],
					fill: false
				},
				{
					label: 'Green',
					borderColor: '#00491e',
					backgroundColor: '#00491e',
					data: transformedDatasets[3],
					fill: false
				},
				{
					label: 'TPM',
					borderColor: '#7c2629',
					backgroundColor: '#7c2629',
					data: transformedDatasets[4],
					fill: false
				},
				{
					label: 'TOP',
					borderColor: '#0bb598',
					backgroundColor: '#0bb598',
					data: transformedDatasets[5],
					fill: false
				}
			]
		};

		chart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				maintainAspectRatio: false,
				elements: {
					point: {
						pointStyle: false
					},
					line: {
						tension: 0
					}
				},
				scales: {
					y: {
						title: {
							display: true,
							text: 'Income Tax',
							font: {
								size: 20,
								family: "'Source Sans 3', sans-serif",
								lineHeight: 1.4
							}
						},
						ticks: {
							callback: function (x) {
								return `${x.toCurrency()}`;
							}
						}
					},
					x: {
						type: 'linear',
						title: {
							display: true,
							text: 'Taxable Income',
							font: {
								size: 20,
								family: "'Source Sans 3', sans-serif",
								lineHeight: 1.4
							}
						},
						ticks: {
							stepSize: 20000,
							callback: function (x) {
								return `${x.toCurrency()}`;
							}
						},
						min: labelLower * 1000,
						max: labelUpper * 1000
					}
				},
				plugins: {
					legend: {
						align: 'start',
						labels: {
							padding: 20,
							usePointStyle: true,
							pointStyle: 'circle'
						}
					}
				}
			},
			plugins: [
				{
					beforeInit: function (chart) {
						const originalFit = chart.legend.fit;

						chart.legend.fit = function fit() {
							originalFit.bind(chart.legend)();
							this.height += 15;
						};
					}
				}
			]
		});
	});
</script>

<div class="text-2xl">
	Income Tax Comparison ({(labelLower * 1000).toCurrency()} - {(labelUpper * 1000).toCurrency()})
</div>
<div class="text-sm mb-4">
	Positive values indicate <span class="italic">"better off"</span>, negative values indicate
	<span class="italic">"worse off"</span>
</div>
<div class="flex flex-col">
	<label for="benchmark-select mr-4" aria-label="tax comparison benchmark select"
		>Tax Policy Benchmark</label
	>
	<select
		id="benchmark-select"
		class="w-56 mb-4 border-2 border-black p-1 focus:outline-2 focus:outline-black/40 focus:outline focus:outline-offset-2"
		bind:value={benchmark}
	>
		<option value={0} class="hover:bg-black/20 checked:bg-black checked:text-white"
			>Labour (status quo)</option
		>
		<option value={1} class="hover:bg-black/20 checked:bg-black checked:text-white">National</option
		>
		<option value={2} class="hover:bg-black/20 checked:bg-black checked:text-white">ACT</option>
		<option value={3} class="hover:bg-black/20 checked:bg-black checked:text-white">Green</option>
		<option value={4} class="hover:bg-black/20 checked:bg-black checked:text-white">TPM</option>
		<option value={5} class="hover:bg-black/20 checked:bg-black checked:text-white">TOP</option>
	</select>
</div>
<div class="relative w-auto h-[384px] md:h-[520px]">
	<canvas bind:this={chart} id="income-tax" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
