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
		bracketsTOP,
		bracketsNZFirst
	} from '../../utils/generateData';

	export let labels;
	export let min = 0;
	export let max = 301;
	export let labelLower = 0;
	export let labelUpper = 301;
	export let popCount;
	export let totalPopulation;
	let chart;

	const precalc = [
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketStatusQuo)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsNational)),
		new Array(max - min)
			.fill(0)
			.map(
				(_, i) =>
					+(
						(calculateTax(i * 1000, bracketsAct) - lmito(i * 1000)) / (i * 1000) ||
						bracketsAct[0][2]
					).toFixed(6)
			),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsGreens)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsTPM)),
		new Array(max - min).fill(0).map((_, i) => calculateTaxPercent(i * 1000, bracketsNZFirst)),
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
					borderColor: '#00ba32',
					backgroundColor: '#00ba32',
					data: precalc[3],
					fill: false
				},
				{
					label: 'TPM',
					borderColor: '#630000',
					backgroundColor: '#630000',
					data: precalc[4],
					fill: false
				},
				{
					label: 'NZ First',
					borderColor: '#000000',
					backgroundColor: '#000000',
					data: precalc[5],
					fill: false
				},
				{
					label: 'TOP',
					borderColor: '#26a7cb',
					backgroundColor: '#26a7cb',
					data: precalc[6],
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
							count: 10,
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
					},
					tooltip: {
						enabled: true,
						mode: 'index',
						intersect: false,
						caretSize: 16,
						borderWidth: 2,
						borderColor: '#000',
						boxPadding: 6,
						padding: 12,
						callbacks: {
							title: function (context, data) {
								return `$${context[0].label}`;
							},
							label: function (context) {
								return `${context.dataset.label}: ${(context.raw * 100).toFixed(2)}%`;
							},
							labelPointStyle: function (context) {
								return {
									pointStyle: 'circle',
									rotation: 0
								};
							}
						},
						usePointStyle: true,
						backgroundColor: '#ffffffff',
						titleFont: {
							size: 18,
							family: "'Source Sans 3', 'sans-serif'",
							lineHeight: 1.4
						},
						titleColor: '#000',
						bodyFont: {
							size: 16,
							family: "'Source Sans 3', 'sans-serif'",
							lineHeight: 1.4
						},
						bodyColor: '#222'
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
					},
					beforeTooltipDraw: (chart) => {
						if (chart.tooltip?._active?.length) {
							let x = chart.tooltip._active[0].element.x;
							let yAxis = chart.scales.y;
							let ctx = chart.ctx;
							ctx.save();
							ctx.beginPath();
							ctx.moveTo(x, yAxis.top);
							ctx.lineTo(x, yAxis.bottom);
							ctx.lineWidth = 1;
							ctx.strokeStyle = '#000';
							ctx.stroke();
							ctx.restore();
						}
					}
				}
			]
		});
	});
</script>

<div class="text-2xl font-bold">Average Tax Rate</div>
<div class="flex justify-between">
	<div class="text-sm text-black/60">
		<span class="font-bold">Income Range</span>
		<br />{(labelLower * 1000).toCurrency()} - {(labelUpper * 1000).toCurrency()}
	</div>
	<div class="text-sm text-black/60 text-right">
		<span class="font-bold">Taxpayer population coverage</span>
		<br />{((popCount / totalPopulation) * 100).toFixed(2)}% -
		{popCount.toLocaleString('en-NZ')} people
	</div>
</div>
<div class="relative w-auto h-[384px] md:h-[520px]">
	<canvas bind:this={chart} id="average-tax-rate" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
