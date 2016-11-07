/* eslint no-unused-vars:0 */
/* global console */
(function(global, document) {
	'use strict';

	var target  = document.getElementById('target'),
		content = target.textContent ? 'textContent' : 'innerText';

	function log(action, module, state, details) {
		var row = document.createElement('tr'),
			cell;

		cell          = document.createElement('td');
		cell[content] = action;
		cell.setAttribute('class', state);
		row.appendChild(cell);

		cell          = document.createElement('td');
		cell[content] = module;
		row.appendChild(cell);

		cell          = document.createElement('td');
		cell[content] = state;
		row.appendChild(cell);

		cell          = document.createElement('td');
		cell[content] = details || '';
		row.appendChild(cell);

		target.appendChild(row);
	}

	function definition(demand, provide) {
		log('demand', '/app/js/main', 'resolved', 'module');

		// example: configuration
		demand.configure({
			pattern: {
				'/nucleus':          '//cdn.jsdelivr.net/qoopido.nucleus/2.0.1/',
				'/jquery':           '//cdn.jsdelivr.net/jquery/1.11.3/jquery.min',
				'/velocity':         '//cdn.jsdelivr.net/velocity/1.2.3/velocity.min.js',
				'/leaflet':          '//cdn.jsdelivr.net/leaflet/0.7.3/leaflet.js',
				'/velocity+leaflet': '//cdn.jsdelivr.net/g/velocity@1.2.3,leaflet@0.7.3'
			},
			modules: {
				/*
				'/demand/plugin/genie': {
					'/nucleus/': function(dependencies) {
						var fragments = [],
							i = 0, dependency;
						
						for(; (dependency = dependencies[i]); i++) {
							fragments.push(dependency.id.replace(/^\/nucleus\//, '') + '.js');
						}
						
						return '//cdn.jsdelivr.net/g/qoopido.nucleus@2.0.1(' + fragments.join('+') + ')';
					}
				},
				*/
				'/demand/plugin/lzstring': {
					'/app/': true
				},
				'/demand/plugin/cookie': {
					'/app/': true
				},
				'/demand/plugin/sri': {
					'/app/js/simple': { type: 'sha256', hash: 'DsUmscjFGZU+3H+7jzs+O8hcJfNkaDvgfYj5DvxH9zE=' },
					'/app/html/dummy.html': { type: 'sha256', hash: 'SlRwOlHGx/06aQNPOeUwgfQxbmeESluIMyue3hIsW7A=' }
				},
				'/demand/handler/legacy': {
					'/jquery': {
						probe: function() { return global.jQuery; }
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
		
		demand('/nucleus/dom/element', '/nucleus/dom/collection')
			.then(
				function(DomElement, DomCollection) {
					log('demand', '/nucleus/dom/element', 'resolved', 'genie bundle, with dependency');
					log('demand', '/nucleus/dom/collection', 'resolved', 'genie bundle, with dependency');
				},
				function() {
					log('demand', '/nucleus/dom/element', 'rejected');
					log('demand', '/nucleus/dom/collection', 'rejected');
				}
			);
		
		demand('css!../css/default')
			.then(
				function(appCssDefault) {
					log('demand', '/app/css/default', 'resolved', 'css');
				},
				function() {
					log('demand', '/app/css/default', 'rejected');
				}
			);
		
		demand('legacy!/jquery')
			.then(
				function(jQuery) { log('demand', '/jQuery', 'resolved', 'legacy'); },
				function() { log('demand', '/jQuery', 'rejected'); }
			);
		
		demand('bundle!/velocity+leaflet')
			.then(
				function(velocity, leaflet) { log('demand', '/velocity+leaflet', 'resolved', 'bundle, with dependency'); },
				function() { log('demand', '/velocity+leaflet', 'rejected'); }
			);

		// listening to demand events
		/*
		demand
			.on('cacheMiss',   function(loader) { console.log('cacheMiss', loader.path); })
			.on('cacheHit',    function(loader) { console.log('cacheHit', loader.path); })
			.on('cacheClear',  function(loader) { console.log('cacheExceed', loader.path); })
			.on('cacheExceed', function(loader) { console.log('cacheExceed', loader.path); })
			.on('preRequest',  function(loader) { console.log('preRequest', loader.path); })
			.on('postRequest', function(loader) { console.log('postRequest', loader.path); })
			.on('preProcess',  function(loader) { console.log('preProcess', loader.path); })
			.on('postProcess', function(loader) { console.log('postProcess', loader.path); })
			.on('preCache',    function(loader) { console.log('preCache', loader.path); })
			.on('postCache',   function(loader) { console.log('postCache', loader.path); })
		*/
		
		/*
		// load lzstring plugin to compress localStorage
		// content (see configuration above)
		//demand('/demand/plugin/lzstring', '/demand/plugin/sri')
		// loading CSS with demand
			//.then(
			//	function(pluginLzstring, pluginSri) {
			//		log('demand', '/demand/plugin/lzstring', 'resolved', 'module, plugin');
			//		log('demand', '/demand/plugin/sri', 'resolved', 'module, plugin');
		
					demand('/nucleus/dom/element', '/nucleus/dom/collection')
						.then(
							function(DomElement, DomCollection) {
								log('demand', '/nucleus/dom/element', 'resolved', 'genie bundle, with dependency');
								log('demand', '/nucleus/dom/collection', 'resolved', 'genie bundle, with dependency');
							},
							function() {
								log('demand', '/nucleus/dom/element', 'rejected');
								log('demand', '/nucleus/dom/collection', 'rejected');
							}
						);
					
					demand('css!../css/default')
						.then(
							function(appCssDefault) {
								log('demand', '/app/css/default', 'resolved', 'css');
							},
							function() {
								log('demand', '/app/css/default', 'rejected');
							}
						);

					// load cookie plugin to be able to track client
					// cache on server and eventually inline certain
					// parts (see configuration above)
					demand('/demand/plugin/cookie')
						.then(
							function(pluginCookie) {
								log('demand', '/demand/plugin/cookie', 'resolved', 'module, plugin');

								// example: demand usage
								// providing a simple inline module without dependencies
								function definition1() {
									log('provide', '/app/js/example1', 'resolved', 'module');

									return function appJsExample1() {

									};
								}

								provide('example1', definition1);

								// providing an inline module with dependencies
								function definition2(appJsExample1) {
									log('provide', '/app/js/example2', 'resolved', 'module, with dependency');

									return function appJsExample2() {

									};
								}

								provide('example2', [ 'example1' ], definition2);

								// loading a single module without further dependencies
								// with a specific version and lifetime
								var temp = demand('@1.0.3#60!simple')
									.then(
										function(appJsSimple) { log('demand', '/app/js/simple', 'resolved', 'module, version 1.0.3, cache 60s, compress, sri'); },
										function() { log('demand', '/app/js/simple', 'rejected'); }
									);

								// loading text (HTML in this case)
								demand('text!../html/dummy.html')
									.then(
										function(appHtmlDummy) { log('demand', '/app/html/dummy', 'resolved', 'text, cookie, compress, sri'); },
										function() { log('demand', '/app/html/dummy', 'rejected'); }
									);

								// load JSON data with caching disabled
								demand('-json!../json/dummy')
									.then(
										function(appJsonDummy) { log('demand', '/app/json/dummy', 'resolved', 'json, no cache'); },
										function() { log('demand', '/app/json/dummy', 'rejected'); }
									);
								
								demand('legacy!/jquery')
									.then(
										function(jQUery) { log('demand', '/jQuery', 'resolved', 'legacy'); },
										function() { log('demand', '/jQuery', 'rejected'); }
									);
								
								// loading bundles with demand (see configuration above)
								// demand('bundle!/velocity+leaflet')
								//	.then(
								//		function(velocity, leaflet) { log('demand', '/velocity+leaflet', 'resolved', 'bundle, with dependency'); },
								//		function() { log('demand', '/velocity+leaflet', 'rejected'); }
								//	);
							},
							function() {
								log('demand', '/demand/plugin/cookie', 'rejected');
							}
						);
			//	},
			//	function() {
			//		log('demand', '/demand/plugin/lzstring', 'rejected');
			//		log('demand', '/demand/plugin/sri', 'rejected');
			//	}
			//);

		return true;
		*/
	}

	provide([ 'demand', 'provide' ], definition);
}(this, document));