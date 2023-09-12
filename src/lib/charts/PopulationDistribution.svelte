<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { distribution } from '../distribution.js';

	export let labels;
	let min = 0;
	let max = 305;
	export let labelLower;
	export let labelUpper;
	export let width;
	let chart;

	onMount(async (promise) => {
		var ctx = document.getElementById('pop-dist');
		var data = {
			yAxes: {},
			datasets: [
				{
					data: distribution,
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
								return `${x / 1000}k`;
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
						enabled: false
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

<div class="relative w-auto h-[256px] margin-6" bind:offsetWidth={width}>
	<canvas bind:this={chart} id="pop-dist" />
</div>

<style>
	canvas {
		background-color: #fff;
	}
</style>
