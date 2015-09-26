/* globals console */
;(function(global, document) {
	'use strict';

	var body = document.body;

	function log(message) {
		var element = document.createElement('div');

		element.innerHTML = message;

		body.appendChild(element);
	}

	function definition(demand, provide) {
		log('[demand]&nbsp;&nbsp;/app/main (module) => done');

		// example: configuration
			demand
				.configure({
					pattern: {
						'/jquery':           '//cdn.jsdelivr.net/jquery/1.11.3/jquery.min',
						'/jquery/ui':        '//cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js',
						'/velocity':         '//cdn.jsdelivr.net/velocity/1.2.2/velocity.min.js',
						'/leaflet':          '//cdn.jsdelivr.net/leaflet/0.7.3/leaflet.js',
						'/velocity+leaflet': '//cdn.jsdelivr.net/g/velocity@1.2.2,leaflet@0.7.3'
					},
					modules: {
						'/demand/handler/legacy': {
							'/jquery': {
								probe: function() { return global.jQuery; }
							},
							'/jquery/ui': {
								probe:        function() { return global.jQuery.ui; },
								dependencies: [ 'legacy!/jquery' ]
							},
							'/velocity': {
								probe: function() { return global.Velocity || (global.jQuery && global.jQuery.fn.velocity); }
							},
							'/leaflet': {
								probe: function() { return global.L; }
							}
						},
						'/demand/handler/bundle': {
							'/velocity+leaflet': [ 'legacy!/velocity', 'legacy!/leaflet' ]
						}
					}
				});

		// example: demand usage
			// providing a simple inline module without dependencies
				function definition1() {
					log('[provide] /app/example1 (module) => done');

					return function appExample1() {

					};
				}

				provide('example1', definition1);

			// providing an inline module with dependencies
				function definition2(appExample1) {
					log('[provide] /app/example2 (module) => done');

					return function appExample2() {

					};
				}

				provide('example2', [ 'example1' ], definition2);

			// loading a single module without further dependencies
			// with a specific version and lifetime
				demand('@1.0.3#60!simple')
					.then(
						function(appSimple) { log('[demand]&nbsp;&nbsp;/app/simple (module, 1.0.3, 60s) => done'); },
						function() { log('[error] /app/simple'); }
					);

			// load JSON data with caching disabled
				demand('!json!dummy')
					.then(
						function(appDummy) { log('[demand]&nbsp;&nbsp;/app/dummy (json) => done'); },
						function() { log('[error] /app/dummy'); }
					);

			// loading CSS with demand, store in cookie in addition
				demand('css+cookie!default')
					.then(
						function(cssDefault) { log('[demand]&nbsp;&nbsp;/app/default (css) => done'); },
						function() { log('[error] /app/default'); }
					);

			// loading legacy scripts (with further dependencies)
				demand('legacy!/jquery/ui').then(
					function(jQueryUI) { log('[demand]&nbsp;&nbsp;/jquery/ui (legacy) => done'); },
					function() { log('[error] /jquery/ui'); }
				);

			// loading bundles with demand
				demand('bundle!/velocity+leaflet').then(
					function(velocity, leaflet) { log('[demand]&nbsp;&nbsp;/velocity+leaflet (bundle) => done'); },
					function() { log('[error] /velocity+leaflet'); }
				);

		return true;
	}

	provide([ 'demand', 'provide' ], definition); //
}(this, document));