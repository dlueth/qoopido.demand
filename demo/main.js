;(function(global, demand, provide) {
	'use strict';

	function definition() {
		// example: configuration
			demand
				.configure({
					pattern: {
						'/qoopido': 'https://rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min'
					}
				});

		// example: demand usage
			// loading a single, more complex module with further dependencies
				demand('/qoopido/base')
					.then(
						function(componentIterator) {
							console.log('demand module /qoopido/base loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

		return true;
	}

	provide(definition);
}(this, demand, provide));