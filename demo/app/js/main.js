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
		log('[demand]&nbsp;&nbsp;/app/js/main (module) => done');

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
						'/demand/plugin/lzstring': {
							'':                  false,
							'/app/js/simple':    true,
							'/app/css/default' : true
						},
						'/demand/handler/legacy': {
							'/jquery': {
								probe: function() { return global.jQuery; }
							},
							'/jquery/ui': {
								probe:        function() { return global.jQuery.ui; },
								dependencies: [ 'legacy!/jquery' ]
							},
							'/velocity': {
								probe:        function() { return global.Velocity || (global.jQuery && global.jQuery.fn.velocity); },
								dependencies: [ 'legacy!/jquery' ]
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

		// listening to cache events
			/*
			demand
				.on('cacheMiss',   function(loader) { console.log('cacheMiss', loader.path); })
				.on('cacheStore',  function(loader) { console.log('cacheStore', loader.path); })
				.on('cacheHit',    function(loader) { console.log('cacheHit', loader.path); })
				.on('cacheExceed', function(loader) { console.log('cacheExceed', loader.path); });
			*/

		// load lzstring plugin to compress localStorage content (see configuration above)
			demand('/demand/plugin/lzstring');

		// example: demand usage
			// providing a simple inline module without dependencies
				function definition1() {
					log('[provide] /app/js/example1 (module) => done');

					return function appJsExample1() {

					};
				}

				provide('example1', definition1);

			// providing an inline module with dependencies
				function definition2(appJsExample1) {
					log('[provide] /app/js/example2 (module) => done');

					return function appJsExample2() {

					};
				}

				provide('example2', [ 'example1' ], definition2);

			// loading a single module without further dependencies
			// with a specific version and lifetime
				demand('@1.0.3#60!simple')
					.then(
						function(appJsSimple) { log('[demand]&nbsp;&nbsp;/app/js/simple (module, version 1.0.3, cached for 60s, compressed) => done'); },
						function() { log('[error] /app/js/simple'); }
					);

			// loading text (HTML in this case)
				demand('text!../html/dummy.html')
					.then(
						function(appHtmlDummy) { log('[demand]&nbsp;&nbsp;/app/html/dummy (text) => done'); },
						function() { log('[error] /app/html/dummy'); }
					);

			// loading CSS with demand, store in cookie in addition
				demand('css+cookie!../css/default')
					.then(
						function(appCssDefault) { log('[demand]&nbsp;&nbsp;/app/css/default (css, cookie enabled, compressed) => done'); },
						function() { log('[error] /app/css/default'); }
					);

			// load JSON data with caching disabled
				demand('!json!../json/dummy')
					.then(
						function(appJsonDummy) { log('[demand]&nbsp;&nbsp;/app/json/dummy (json, cache disabled) => done'); },
						function() { log('[error] /app/json/dummy'); }
					);

			// loading legacy scripts (with further dependencies, see configuration above)
				demand('legacy!/jquery/ui').then(
					function(jQueryUI) { log('[demand]&nbsp;&nbsp;/jquery/ui (legacy) => done'); },
					function() { log('[error] /jquery/ui'); }
				);

			// loading bundles with demand (see configuration above)
				demand('bundle!/velocity+leaflet').then(
					function(velocity, leaflet) { log('[demand]&nbsp;&nbsp;/velocity+leaflet (bundle) => done'); },
					function() { log('[error] /velocity+leaflet'); }
				);

		return true;
	}

	provide([ 'demand', 'provide' ], definition);
}(this, document));