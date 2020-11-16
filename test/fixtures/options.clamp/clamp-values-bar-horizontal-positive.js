var datasets = [];
var values = [
	20,
	50,
	80
];

['start', 'center', 'end'].forEach(function(anchor) {
	[false, true].forEach(function(clamp) {
		datasets.push({
			data: values,
			datalabels: {
				anchor: anchor,
				clamp: clamp
			}
		});
	});
});

export default {
	config: {
		type: 'bar',
		data: {
			datasets: datasets,
			labels: values
		},
		options: {
			indexAxis: 'y',
			layout: {
				padding: {
					left: 20,
					right: 20
				}
			},
			scales: {
				x: {
					min: 40,
					max: 60
				}
			},
			plugins: {
				datalabels: {
					backgroundColor: '#00ff77',
					borderColor: 'black',
					borderWidth: 2,
					font: {
						size: 0
					},
					padding: 8,
					offset: 0
				}
			}
		}
	},
	options: {
		canvas: {
			height: 512,
			width: 192
		}
	}
};
