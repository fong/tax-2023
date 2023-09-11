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

	export let labels;
	export let min = 0;
	export let max = 301;
	export let labelLower = 0;
	export let labelUpper = 301;
	let chart;

	const precalc = [
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketStatusQuo)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsNational)),
		new Array(max - min)
			.fill(0)
			.map(
				(_, i) =>
					+((calculateTax(i * 1000, bracketsAct) - lmito(i * 1000)) / (i * 1000) || 0).toFixed(6)
			),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsGreens)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsTPM)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsTOP))
	];

	$: {
		if (chart) {
			chart.data.labels = labels.slice(labelLower, labelUpper + 1);
			chart.data.datasets.forEach((dataset, i) => {
				dataset.data = precalc[i].slice(labelLower, labelUpper + 1);
			});
			chart.options.scales.x.min = labelLower * 1000;
			chart.options.scales.x.max = labelUpper * 1000;
			chart.options.plugins.title.text = `    Average Tax Rate (${(
				labelLower * 1000
			).toCurrency()} - ${(labelUpper * 1000).toCurrency()})`;
			chart.update();
		}
	}

	onMount(async (promise) => {
		var ctx = document.getElementById('average-tax-rate');
		var data = {
			labels: labels,
			yAxes: {},
			datasets: [
				{
					label: 'Labour',
					borderColor: '#d82c20',
					backgroundColor: '#d82c20',
					data: precalc[0],
					fill: false
				},
				{
					label: 'National',
					borderColor: '#0a3067',
					backgroundColor: '#0a3067',
					data: precalc[1],
					fill: false
				},
				{
					label: 'ACT',
					borderColor: '#fbbf03',
					backgroundColor: '#fbbf03',
					data: precalc[2],
					fill: false
				},
				{
					label: 'Green',
					borderColor: '#00491e',
					backgroundColor: '#00491e',
					data: precalc[3],
					fill: false
				},
				{
					label: 'TPM',
					borderColor: '#7c2629',
					backgroundColor: '#7c2629',
					data: precalc[4],
					fill: false
				},
				{
					label: 'TOP',
					borderColor: '#0bb598',
					backgroundColor: '#0bb598',
					data: precalc[5],
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
							text: 'Average Tax Rate',
							font: {
								size: 20,
								family: "'Source Sans 3', sans-serif",
								lineHeight: 1.4
							}
						},
						ticks: {
							callback: function (x) {
								return `${(x * 100).toFixed(0)}%`;
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
					title: {
						display: true,
						text: `    Average Tax Rate (${(labelLower * 1000).toCurrency()} - ${(
							labelUpper * 1000
						).toCurrency()})`,
						align: 'start',
						font: {
							size: 24,
							weight: 'normal',
							family: "'Source Sans 3', sans-serif"
						}
					},
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
						// var data = chart.config.data;
						// for (var i = 0; i < data.datasets.length; i++) {
						// 	for (var j = 0; j < data.labels.length; j++) {
						// 		var fct = data.datasets[i].function,
						// 			x = data.labels[j],
						// 			y = fct(x);
						// 		data.datasets[i].data.push(y);
						// 	}
						// }

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

<div class="relative w-auto h-[384px] md:h-[520px] margin-6">
	<canvas bind:this={chart} id="average-tax-rate" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
