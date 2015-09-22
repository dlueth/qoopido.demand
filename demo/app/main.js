/* globals console */
;(function(global) {
	'use strict';

	function definition(demand, provide) {
		console.log('demand module /app/main loaded');

		// example: configuration

			demand
				.configure({
					pattern: {
						// IE9+ only, therefore disabled
						//'/qoopido/4.0.0': '//rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min',
						'/qoopido/3.7.4': '//cdn.jsdelivr.net/qoopido.js/3.7.4',
						// IE9+ only, therefore disabled
						// collides with bundle as well
						//'/jquery':        '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min',
						'/jquery+ui':     '//cdn.jsdelivr.net/g/jquery@1.11.3,jquery.ui@1.11.4'
					},
					probes: {
						'/jquery': function() { return global.jQuery; },
						'/jquery/ui': function() { return global.jQuery.ui; }
					},
					modules: {
						'/demand/handler/bundle': {
							'/jquery+ui': [ '/jquery', '/jquery/ui' ]
						}
					}
				});

		// example: demand usage
			// loading a single module without further dependencies with a specific version and lifetime
				demand('@1.0.3#20!simple')
					.then(
						function(appSimple) {
							console.log('demand module /app/simple loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// load JSON data with caching disabled
				demand('!json!dummy')
					.then(
						function(appDummy) {
							console.log('demand module /app/dummy (application/json) loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// loading a single, more complex module with further dependencies
				// IE9+ only, therefore disabled
				/*
				demand('/qoopido/4.0.0/component/iterator')
					.then(
						function(qoopidoComponentIterator) {
							console.log('demand module /qoopido/4.0.0/component/iterator loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);
				*/

			// loading multiple modules with further dependencies and a probe (~=shim)
				// IE9+ only, therefore disabled
				/*
				demand('/qoopido/4.0.0/component/iterator', '/jquery')
					.then(
						function(qoopidoComponentIterator, jQuery) {
							console.log('demand module /qoopido/4.0.0/component/iterator & external /jquery loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);
				*/

			// loading CSS with demand
				demand('css!default')
					.then(
						function(cssDefault) {
							console.log('demand module /app/default (text/css) loaded');

							cssDefault.media = 'screen';
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// loading bundles with demand
				demand('bundle!/jquery+ui').then(
						function(jQuery, jQueryUI) {
							console.log('bundle /jquery+ui loaded');
						},
						function() { console.log('error', arguments); }
				);

			// providing a simple inline module without dependencies
				function definition1() {
					console.log('demand module /app/example1 provided');

					return function appExample1() {

					};
				}

				provide('example1', definition1);

			// providing an inline module with dependencies
				function definition2(appExample1, jQuery) {
					console.log('demand module /app/example2 provided');

					return function appExample2() {

					};
				}

				provide('example2', definition2)
					.when('example1');

		// example: load & use require.js adapter
			// collides with bundle, therefore disabled
			/*
			demand('/demand/adapter/require')
				.then(
					function(adapter) {
						// adapter.require is also register as "require" in global scope
						adapter.require([ '/qoopido/3.7.4/base' ], function(base) {
							console.log('require.js module /qoopido/3.7.4/base loaded');

							adapter.require([ '/qoopido/3.7.4/component/iterator' ], function(componentIterator) {
								console.log('require.js module /qoopido/3.7.4/component/iterator loaded');
							});
						});

						// adapter.define is also registered as "define" in global scope
						adapter.define('/app/example3', function() {
							console.log('require.js module /app/example3 defined');
						});

						// define with dependencies
						adapter.define('/app/example4', [ '/jquery' ], function(jQuery) {
							console.log('require.js module /app/example4 defined');
						});
					}
				);
			*/

		return true;
	}

	provide(definition)
		.when('demand', 'provide');
}(this));