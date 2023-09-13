<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import {
		calculateTax,
		calculateTaxPercent,
		bracketsNational,
		bracketStatusQuo,
		bracketsAct,
		lmito,
		bracketsGreens,
		bracketsTPM,
		bracketsTOP
	} from '../../utils/generateData';
	import { distribution } from '../distribution.js';

	// export let labels;
	export let min = 0;
	export let max = 301;
	export let labelLower = 0;
	export let labelUpper = 301;
	let chart;

	const taxRevenueDistribution = distribution.map((b) => {
		return { x: b.x, y: b.x * b.y };
	});

	// console.log(taxRevenueDistribution);

	// $: {
	// 	if (chart) {
	// 		chart.data.labels = labels.slice(labelLower, labelUpper + 1);
	// 		chart.data.datasets.forEach((dataset, i) => {
	// 			dataset.data = precalc[i].slice(labelLower, labelUpper + 1);
	// 		});
	// 		chart.options.scales.x.min = labelLower * 1000;
	// 		chart.options.scales.x.max = labelUpper * 1000;
	// 		chart.options.plugins.title.text = `    Income Tax (${(labelLower * 1000).toCurrency()} - ${(
	// 			labelUpper * 1000
	// 		).toCurrency()})`;
	// 		if (window.innerWidth < 480) {
	// 			chart.options.scales.y.ticks.callback = function (x) {
	// 				return `${(x / 1000).toCurrency()}k`;
	// 			};
	// 		} else {
	// 			chart.options.scales.y.ticks.callback = function (x) {
	// 				return `${x.toCurrency()}`;
	// 			};
	// 		}
	// 		chart.update();
	// 	}
	// }

	onMount(async (promise) => {
		var ctx = document.getElementById('tax-revenue-distribution');
		var data = {
			// labels: labels,
			// yAxes: {},
			datasets: [
				{
					data: taxRevenueDistribution,
					backgroundColor: ['rgba(255, 99, 132)'],
					barPercentage: 1.2,
					barThickness: 'flex'
				}
			]
		};

		chart = new Chart(ctx, {
			type: 'bar',
			data: data,
			options: {
				maintainAspectRatio: false,
				layout: {
					padding: 24
				},
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
						beginAtZero: true,
						ticks: {
							callback: function (x) {
								return `${(x / 1000000000).toCurrency()}B`;
							}
						}
					},
					x: {
						type: 'linear',
						ticks: {
							display: false,
							stepSize: 1000,
							callback: function (x) {
								return `${x.toCurrency()}`;
							}
						},
						grid: {
							display: false
						},
						min: min * 1000,
						max: max * 1000
					}
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true
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
	Income Tax Revenue Distribution ({(labelLower * 1000).toCurrency()} - {(
		labelUpper * 1000
	).toCurrency()})
</div>
<!-- <div>{JSON.stringify(taxRevenueDistribution)}</div> -->
<div class="relative w-auto h-[384px] md:h-[520px]">
	<canvas bind:this={chart} id="tax-revenue-distribution" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
