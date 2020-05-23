var datasets = [];
var values = [
	80,
	20,
	-20,
	-80
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
			layout: {
				padding: {
					top: 20,
					bottom: 20
				}
			},
			scales: {
				y: {
					min: 50,
					max: -50
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
			height: 256,
			width: 720
		}
	}
};
