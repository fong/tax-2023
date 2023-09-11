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
	let min = 0;
	let max = 300;
	export let labelLower;
	export let labelUpper;
	export let width;
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

	$: {
		// if (chart) {
		// 	chart.data.labels = labels.slice(labelLower, labelUpper + 1);
		// 	chart.data.datasets.forEach((dataset, i) => {
		// 		dataset.data = precalc[i].slice(labelLower, labelUpper + 1);
		// 	});
		// 	chart.options.scales.x.min = labelLower * 1000;
		// 	chart.options.scales.x.max = labelUpper * 1000;
		// 	chart.options.plugins.title.text = `    Income Tax (${(labelLower * 1000).toCurrency()} - ${(
		// 		labelUpper * 1000
		// 	).toCurrency()})`;
		// 	chart.update();
		// }
	}

	onMount(async (promise) => {
		var ctx = document.getElementById('pop-dist');
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
						ticks: {
							display: false
						}
					},
					x: {
						type: 'linear',
						ticks: {
							display: true,
							stepSize: 20000,
							callback: function (x) {
								return `${x.toCurrency()}`;
							},
							maxRotation: 30,
							minRotation: 30
						},
						min: min * 1000,
						max: max * 1000
					}
				},
				plugins: {
					legend: {
						display: false
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

<div class="relative w-auto h-[212px] margin-6" bind:offsetWidth={width}>
	<canvas bind:this={chart} id="pop-dist" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
