/* eslint no-unused-vars:0 */
/* global console */

(function(global, document) {
	'use strict';

	var target  = document.getElementById('target')
		, content = target.textContent ? 'textContent' : 'innerText'
		, start
		, origin;
	
	(global.performance = global.performance || {}).now = global.performance.now || function() { return +new Date(); };
	
	function getDuration(time) {
		var duration = Math.round(global.performance.now() - time);
		
		return isNaN(duration) ? 'n/a' : duration + 'ms';
	}

	function log(action, module, state, details) {
		var duration = getDuration(start),
			row      = document.createElement('tr'),
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

		cell          = document.createElement('td');
		cell[content] = duration;
		row.appendChild(cell);

		target.appendChild(row);

		start = global.performance.now();
	}

	function definition(demand, provide, Pledge) {
		log('demand', '/app/js/main', 'resolved', 'module');

		// example: configuration
		demand.configure({
			pattern: {
				'/nucleus':          '//cdn.jsdelivr.net/qoopido.nucleus/3.0.4/',
				'/jquery':           '//cdn.jsdelivr.net/jquery/1.11.3/jquery.min',
				'/jquery/ui':        '//cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min',
				'/velocity':         '//cdn.jsdelivr.net/velocity/1.2.3/velocity.min.js',
				'/leaflet':          '//cdn.jsdelivr.net/leaflet/0.7.3/leaflet.js',
				'/velocity+leaflet': '//cdn.jsdelivr.net/g/velocity@1.2.3,leaflet@0.7.3'
			},
			modules: {
				'/demand/plugin/genie': {
					'/app/': function(dependencies) {
						var fragments = [],
							i = 0, dependency;
						
						for(; (dependency = dependencies[i]); i++) {
							fragments.push(dependency.path + '@' + dependency.version);
						}

						return '/genie/index.php?module[]=' + fragments.join('&module[]=');
					},
					'/nucleus/': function(dependencies) {
						var fragments = [],
							i = 0, dependency;

						for(; (dependency = dependencies[i]); i++) {
							fragments.push(dependency.path.replace(/^\/nucleus\//, '') + '.js');
						}

						return '//cdn.jsdelivr.net/g/qoopido.nucleus@3.0.4(' + fragments.join('+') + ')';
					}
				},
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
					'/jquery/ui': {
						probe: function() { return window.jQuery.ui; },
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

		// listen on demand events
		/*
		demand
			.on('cacheMiss',     function(dependency)        { console.log('cacheMiss', dependency.id); })
			.on('cacheHit',      function(dependency)        { console.log('cacheHit', dependency.id); })
			.on('cacheClear',    function(dependency)        { console.log('cacheClear', dependency.id); })
			.on('cacheExceed',   function(dependency)        { console.log('cacheExceed', dependency.id); })
		 	.on('preCache',      function(dependency, state) { console.log('preCache', dependency.id, state); })
		 	.on('postCache',     function(dependency, state) { console.log('postCache', dependency.id, state); })
		 	.on('preConfigure',  function(settings)          { console.log('preConfigure', settings); })
		 	.on('postConfigure', function(settings)          { console.log('postConfigure', settings); })
			.on('preRequest',    function(dependency)        { console.log('preRequest', dependency.id); })
			.on('postRequest',   function(dependency)        { console.log('postRequest', dependency.id); })
			.on('preProcess',    function(dependency)        { console.log('preProcess', dependency.id); })
			.on('postProcess',   function(dependency)        { console.log('postProcess', dependency.id); })
		*/
		
		var regexCleanupSearch = /^\?/;
		
		function addUrlParam(url, param, value) {
			var query;
			
			url.search = (query = (url.search || '').replace(regexCleanupSearch, '')) + (query ? '&' : '?') + param + '=' + value;
			
			return url;
		}
		
		demand.on('preRequest', function(dependency) {
			dependency.url = addUrlParam(dependency.url, 'demand', +new Date());
		});

		// provide a simple inline module without dependencies
			function definition1() {
				log('provide', '/app/js/example1', 'resolved', 'module');

				return function appJsExample1() {

				};
			}

			provide('example1', definition1);

		// provide an inline module with dependencies
			function definition2(appJsExample1) {
				log('provide', '/app/js/example2', 'resolved', 'module, with dependency');

				return function appJsExample2() {

				};
			}

			provide('example2', [ 'example1' ], definition2);

		start = origin = global.performance.now();

		demand('/demand/plugin/cookie', '/demand/plugin/lzstring', '/demand/plugin/sri')
			.then(function() {
				return Pledge.all([
					// load CSS
					demand('css!../css/default')
						.then(
							function(appCssDefault) {
								log('demand', '/app/css/default', 'resolved', 'css');
							},
							function() {
								log('demand', '/app/css/default', 'rejected');
							}
						),
					// load a module without dependencies, a specific version and lifetime
					demand('@1.0.3#60!simple')
						.then(
							function(appJsSimple) {
								log('demand', '/app/js/simple', 'resolved', 'module, version 1.0.3, cache 60s, compress, sri');
							},
							function() {
								log('demand', '/app/js/simple', 'rejected');
							}
						),
					// load html
					demand('html!../html/dummy')
						.then(
							function(appHtmlDummy) {
								log('demand', '/app/html/dummy', 'resolved', 'html, cookie, compress, sri');
							},
							function() {
								log('demand', '/app/html/dummy', 'rejected');
							}
						),
					// load JSON data with caching disabled
					demand('-json!../json/dummy')
						.then(
							function(appJsonDummy) {
								log('demand', '/app/json/dummy', 'resolved', 'json, no cache');
							},
							function() {
								log('demand', '/app/json/dummy', 'rejected');
							}
						),
					// load legacy scripts
					demand('legacy!/jquery/ui')
						.then(
							function(jQueryUi) {
								log('demand', '/jquery/ui', 'resolved', 'legacy, with dependency');
							},
							function() {
								log('demand', '/jquery/ui', 'rejected');
							}
						),
					// load bundles with demand (see configuration above)
					demand('bundle!/velocity+leaflet')
						.then(
							function(velocity, leaflet) {
								log('demand', '/velocity+leaflet', 'resolved', 'bundle, with dependency');
							},
							function() {
								log('demand', '/velocity+leaflet', 'rejected');
							}
						),
					// load modules as genie bundle
					demand('@1.0.5!one', 'two')
						.then(
							function(appJsOne, appJsTwo) {
								log('demand', '/app/js/one', 'resolved', 'genie bundle');
								log('demand', '/app/js/two', 'resolved', 'genie bundle');
							},
							function() {
								log('demand', '/app/js/one', 'rejected');
								log('demand', '/app/js/two', 'rejected');
							}
						),
					// load demand modules as genie bundle (see configuration above)
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
						),
					// load components
					demand('component!/app/component/example')
						.then(
							function(primaryModule, secondaryModule, primaryCss, primaryHtml) {
								log('demand', '/app/component/example', 'resolved', 'component, 2 modules, CSS & HTML');
							},
							function() {
								log('demand', '/app/component/example', 'rejected');
							}
						)
				])
			})
			.always(function() {
				console.info('total: ' + getDuration(origin));
			});
		
		return true;
	}

	provide([ 'demand', 'provide', '/demand/pledge', '/demand/handler/css', '/demand/handler/json', '/demand/handler/text', '/demand/handler/legacy' ], definition);
}(this, document));