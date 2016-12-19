# Qoopido.demand

[![GitHub version](https://img.shields.io/github/tag/dlueth/qoopido.demand.svg?style=flat-square&label=github)](https://github.com/dlueth/qoopido.demand)
[![NPM version](https://img.shields.io/npm/v/qoopido.demand.svg?style=flat-square&label=npm)](https://www.npmjs.com/package/qoopido.demand)
[![License](https://img.shields.io/npm/l/qoopido.demand.svg?style=flat-square)](https://github.com/dlueth/qoopido.demand)
[![Code Climate](https://img.shields.io/codeclimate/github/dlueth/qoopido.demand.svg?style=flat-square)](https://codeclimate.com/github/dlueth/qoopido.demand)
[![NPM downloads](https://img.shields.io/npm/dt/qoopido.demand.svg?style=flat-square&label=npm%20downloads)](https://www.npmjs.org/package/qoopido.demand)
[![David dependencies](https://img.shields.io/david/dlueth/qoopido.demand.svg?style=flat-square)](https://david-dm.org/dlueth/qoopido.demand)
[![David dev dependencies](https://img.shields.io/david/dev/dlueth/qoopido.demand.svg?style=flat-square&label=dev%20dependencies)](https://david-dm.org/dlueth/qoopido.demand)

Qoopido.demand is a modular, flexible and 100% async JavaScript module loader with a promise like interface that utilizes localStorage as a caching layer. It comes in a rather tiny package of roughly **6.5kB minified and gzipped**.

Qoopido.demand originated from my daily use of require.js for the initial development of my Qoopido.nucleus library which is strictly atomic by nature, unbundled. 

You will find a benchmark on the official [site](http://demand.qoopido.com) and some more demo code in this repo's demo directory via [rawgit](https://rawgit.com/dlueth/qoopido.demand/master/demo/index.html). Just open your developer console and remember to clear your localStorage :)

## Key features in detail
- promise like interface (no native promise support required)
- localStorage caching for blazingly fast performance
- automatic cache invalidation by version or lifetime
- per module/path/subpath setting of cache parameters
- relative and absolute module path resolution
- fallback URLs possible by default
- support for handling modules, legacy scripts, bundles (concatenated scripts like from [jsdelivr](https://github.com/jsdelivr/jsdelivr#load-multiple-files-with-single-http-request)), text, CSS and JSON included
- optional support for auto-bundles via ```genie``` included
- plugins for cookie support, lzstring compression and SRI included
- support for custom handlers & plugins built in


## Compatibility
Qoopido.demand is developed for Chrome, Firefox, Safari, Opera and IE9+.

Support for IE8 has been actively removed with Qoopido.demand 4.0.0 due to the lack of justifiable polyfills for parts of the underlying inheritance pattern.

I do test on MacOS Sierra where Qoopido.demand is fully working on Chrome, Firefox, Safari and Opera. IE9, 10, 11 as well as Edge are testet on the official Microsoft VMs via VirtualBox.

## Requirements
Due to modules getting loaded via XHR/XDR a remote server has to have CORS enabled. Be assured that most of the usual CDNs have CORS enabled by default.

## External dependencies
None!

## Availability
Qoopido.demand is available on GitHub as well as jsdelivr, npm and bower at the moment.

## Loading demand
Use the following minified code snippet in a standalone script tag before the closing body tag to include demand:

```javascript
!function(a,b,c){!function(d,e,f,g,h){g=e.getElementsByTagName(f)[0],h=e.createElement(f),d.demand={url:a,main:b,settings:c},h.async=1,h.src=a,g.parentNode.insertBefore(h,g)}(window,document,"script")}
("/src/demand.js","app/main",{base:"/demo",version:"1.0.0"});
```

The snippet is very similar to Google Analytics. The outer function allows you to specify an URL from which to load demand itself as well as a path to the main module and configuration object for demand.

## Configuration
The last parameter of the above code snippet is a configuration object. It just contains ```base``` and ```version``` as these are the properties you will most likely set. There are some more, less frequently used, options that can be either specified here or as part of a ```demand.configure``` call in your ```main``` module (being described in the next section):

```javascript
{
	// enables or disables caching in general (when true/false)
	// optional, defaults to "true"
	cache: true,
	
	// fine grained cache control (when object)
	// any path or part of a path can be set to true to 
	// activate caching or false to disable it.
	// The longest matching path wins over others.
	cache: {
		'/demand/':     true,
		'/app/':        true,
		'/app/nocache': false
	},
				
	// cache will be validated against version
	// optional, defaults to "undefined"
	version: '1.0.0',
				
	// cache will be validated against lifetime, if > 0
	// optional, defaults to "0"
	// unit: seconds
	lifetime: 60,
				
	// sets the timeout for XHR requests
	// optional, defaults to "8" (limited to "2" up to "12")
	// unit: seconds
	timeout: 8, 
				
	// base path from where your relative 
	// dependencies get loaded
	// optional, defaults to "/"
	base: '[path/url to your scripts]',
				
	// optional
	pattern: {
		'/nucleus':   '[path/url to Qoopido.nucleus]',
		'/app':       '[path/url to your modules]',
		// just an example, loading jQuery + bundle 
		// will not work due to the nature of jQuery
		'/jquery':    '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min',
		'/jquery+ui': '//cdn.jsdelivr.net/g/jquery@2.1.4,jquery.ui@1.11.4'
	},

	// per module configuration (if applicable)
	modules: {
		// configure the legacy handler
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
		}
		// configure the bundle handler
		'/demand/handler/bundle': {
			// declare which modules are included in the bundle
			// order is important
			'/jquery+ui': [ '/jquery', '/jquery/ui' ]
		},
		// configure genie plugin
		'/demand/plugin/genie': {
			// handle creation of auto-bundle URL for Qoopido.nucleus from jsdelivr
			'/nucleus/': function(dependencies) {
				var fragments = [],
            		i = 0, dependency;
            								
            	for(; (dependency = dependencies[i]); i++) {
            		fragments.push(dependency.id.replace(/^\/nucleus\//, '') + '.js');
            	}
            								
            	return '//cdn.jsdelivr.net/g/qoopido.nucleus@2.0.1(' + fragments.join('+') + ')';
            },
            // handle creation of auto-bundle URL for your modules from your server
            '/app/': function(dependencies) {
            	var fragments = [],
            		i = 0, dependency;
            								
            	for(; (dependency = dependencies[i]); i++) {
            		fragments.push(dependency.id.replace(/^\/js\//, '') + '.js');
            	}
            								
            	return '/genie/?module[]=' + fragments.join('&module[]=');
            }
		}
	}
```

## Usage
The demanded ```main``` module from the above script might look like the following example:

```javascript
(function(global) {
	'use strict';

	function definition(demand, provide) {
		demand
			.configure({
				// any option from the previous section
				// most likely something like:
				pattern: {
				},
				modules: {
				}
			});
			
		return true; // just return true if there really is nothing to return
	}
	
	provide([ 'demand', 'provide' ], definition);
}(this));
```
Qoopido.demand consists of two components ```demand``` and ```provide``` just like require.js ```require``` and ```define```.

Once demand is loaded anything that is either explicitly requested via ```demand``` or as a dependency of a ```provide``` call will be loaded via XHR as well as modified and injected into the DOM with the help of a ```handler```. The result will be cached in ```localStorage``` (if caching is enabled and localStorage is available) that will get validated against an optional ```version``` and ```lifetime``` set via ```demand.configure``` or the modules path declaration (more on that later).

As ```main``` itself is also loaded as a module it will get cached in localStorage as well.


## Controlling the cache
If caching is enabled, localStorage available and its quota not exceeded chances are good you will never have to manually deal with the cache.

By default demand will invalidate a modules cache under the following conditions:

- module's ```version``` changed
- module's ```lifetime``` is exceeded

Demand will, in addition, do its best to keep leftover garbage to a minimum. It does so by starting an automatic garbage collection for expired caches on load. In addition it will also clear a specific cache if it gets requested and is found to be invalid for any reason.

Beside the automatic cache invalidation demand still offers manual control by registering a ```demand.clear``` object to the global demand function. This object offers the following methods to control the cache:

```javascript
// only clear a single module's cache
demand.clear.path('[module path]');

// clear all expired caches
demand.clear.expired();

// completely clear the cache
demand.clear.all();
```

**Sidenote**
> Demand does use a prefix for its localStorage keys to prevent conflicts with other scripts. Each cache will consist of two keys, one to store the ```state``` information (as JSON) and one for the actual ```value``` (source) of the module. By separating the two only a very small string will have to get parsed as JSON which could lead to performance constraints if a potentially huge module would have to get parsed this way.


## Demanding modules
After your project is set up accordingly you can load further modules like in the following example:

```javascript
demand('app/test', '/nucleus/component/iterator')
	.then(
		function(appTest, nucleusComponentIterator) {
			console.log('=> success', appTest, nucleusComponentIterator);

			new nucleusComponentIterator();
		},
		function() {
			console.log('=> error', arguments);
		}
	);
```

Relative module paths will be resolved relative to the base path or the path of an eventual parent module (see section **Path resolution**). The resulting path will afterwards get matched against patterns defined via ```demand.configure``` which will finally lead to an absolute URL to fetch the module from.

**Sidenote**
> The rejection function will be passed **all** rejected dependencies as arguments, not only the first one rejected.

If no handler is specified it will default to the module handler. If you would like to load e.g. CSS simply prefix your path with ```css!```.

Beside its global configuration Qoopido.demand also allows per module or subpath configuration for general cacheability, versioning and lifetime. All per module settings are optional parts of its path declaration.

You already learnt that a prefix of ```css!``` tells Qoopido.demand to use the CSS handler for the module. All other possible options are also part of the path declaration, for example

```javascript
demand('css@2.0.4#2000!AnyCssModule').then(
	function() {}
);
```

will tell Qoopido.demand to load your ```AnyCssModule``` via the CSS handler and cache it at version ```2.0.4``` for ```2000``` seconds if cache is enabled either globally or for this specific module via ```demand.configure```. You may, in rare cases, want to force a module to either be cached or not overriding any global configuration which can be done by:

```javascript
demand('-css!AnyCssModule').then(
	function() {}
);
```
Prefixing the module's path with a ```-``` will completely disable any caching for this specific demand call whereas prefixing it with a ```+``` will force it to be cached disregarding any global cache settings.

As any parameter that is part of the path declaration is optional you gain total control over when and how Qoopido.demand caches your modules!


## Auto-bundling with genie
Qoopido.demand's original idea was (and still is) to not need a server-side built-process to pre-compile static bundles but to directly load any module required on demand. This decision really embraces new technologies like HTTP/2 that do not establish a new connection for each single request but instead are able to handle all requests with a single connection.

While this is absolutely great HTTP/2 is not 100% supported by servers and clients yet and even if it is, requesting many assets may still slow down your perceived loading experience.
 
To handle this Qoopido.demand has a built-in plugin called ```genie``` which can be configured to create auto-bundle requests for all direct dependencies of a module. To give you a more detailed example think about a module depending on ```/nucleus/dom/element```, ```/nucleus/dom/collection``` and ```/nucleus/component/sense```.

If ```genie``` is enabled for paths prefixed with```/nucleus/``` it will determine if any of the dependencies are already loaded and if there are at least two left for any auto-bundle configured they will get loaded via a single request.

So if none of the dependencies of the aforementioned example are yet loaded all three will be loaded by a single request.

**Sidenote**
> CDNs like jsdelivr allow to request bundles already. A very simple PHP script is part of this repository and can be found under ```/genie/index.php``` (adjust the BASE path accordingly). To be able to adopt ```genie``` for any kind of bundle URL it uses a callback function which is explained in the section **Configuration**.
 

## Providing inline modules
Beside demanding other modules you can as well provide your own, just like in the following example:

```javascript
function definition(appTest, qoopidoBase) {
	return function appMain() {

	}
}

provide('/app/main', [ 'test', '/qoopido/base' ], definition);
```

This is an example for an inline module. The ```provide``` call, in this case, consists of three arguments:

- path of the module
- dependencies of the module
- definition of the module

When dynamically loading modules ```path``` will have to be omitted and gets internally resolved via loading queue handling instead.


## Developing loadable modules
Providing inline modules is only slightly different from building an external, loadable module.

In addition to inline modules you just need some minimal boilerplate code and an anynymous ```provide``` call without the ```path``` argument like in the following example:

```javascript
(function() {
	'use strict';

	function definition(nucleusBase) {
		return function appTest() {

		}
	}

	provide([ '/nucleus/base' ], definition);
}());
```

This example illustrates a module named ```/app/test``` which we already know as the first dependency of the prior example. As with the inline module the ```definition``` function will receive all dependencies as arguments passed so they are in scope of the actual module.


## Path resolution
Path definitions in demand are totally flexible. Relative paths as well as absolute paths starting with a single ```/``` will, by default, be resolved against the ```base``` configuration parameter and might get altered afterwards when matching a certain pattern configured.

There is only one exception to this rule: when providing a module with dependencies these dependencies will always get resolved against the modules own path, if the dependencies path is relative.

Absolute URLs starting either with a protocol or ```//``` will not get altered at all.

As always resolving relative paths against ```base``` might not be desired and you would prefer or need a relative resolution demand provides three special dependencies:

Whenever you request ```demand```, ```provide``` or ```path``` as a dependency of a module your modules definition wil get passed a *localized* version of it. 

```javascript
(function(global) {
	'use strict';

	function definition(demand, provide, path) {
		return function() {
			demand('dependency').then(
				function() {}
			);
			
			provide('module', function module() {
			})
		};
	}
	
	provide([ 'demand', 'provide', 'path' ], definition);
}(this));
```

If you load the above Module from e.g. the directory ```app/``` and name it ```main.js``` it will get passed a localized version of ```demand``` and ```provide``` for the ```app/``` context. So by demanding ```dependency``` you actually demand ```app/dependency``` and by providing ```module``` you really provide ```app/module```.


## Available plugins
Beside the above mentioned handlers ```demand``` offers a variety of plugins with different aims. Currently ```demand``` provides the following loadable plugins:
 
 - Cookie: store module cache states in cookies to exchange cache states with the server
 - LZString: compress/decompress localStorage content to safe space
 - SRI: adds sub-resource-integrity checks when loading modules
 
Plugins have to be loaded manually by simply demanding them. They can be configured via ```demand.configure``` just like the bundle handler mentioned above. ```cookie``` as well as ```lzstring``` use the same configuration theme while ```sri```works only slightly different:
 
 ```javascript
(function(global) {
	'use strict';

	demand.configure({
		modules: {
			'/demand/plugin/cookie': {
				// enable cookie plugin for modules 
				// starting with /app/
				'/app/': true
			},
			'/demand/plugin/lzstring': {
				// enable compression for all modules ...
				'': true,
				// ... but disable it for modules 
				// starting with a certain path
				'/app/do/not/compress': false
			},
			'/demand/plugin/sri': {
				'/nucleus/dom/element': { type: 'sha256', hash: 'pWpW0C5u/YafasONDfkNyRBA4ChXTsRMIk2CGi4wPaU=' }
			}
		}
	});
}(this));
 ```

The use-cases for ```lzstring``` as well as ```sri``` should be fairly obvious but ```cookie```most likely requires some explanation:

In some cases you might want to load (e.g.) a CSS resource via ```demand``` (directly from cache) if it has previously been cached and simply inline it server-side if it is not cached already. The ```cookie``` plugin will allow you to exchange cache-states between ```demand```and your server to make this scenario possible.


## More about handlers
```demand``` comes with handlers for ```modules```, ```legacy```scripts, ```bundles```, ```text```, ```css``` and ```json```. Handlers have four objectives:

- provide an optional function named ```onPreRequest``` that modifies the final URL (e.g. add a file extension like ```.js```) before requesting it via XHR/XDR
- provide an optional function named ```onPostRequest``` that, if present, handles necessary conversion of the loaded source (e.g. CSS paths that are normally relative to the CSS-file path)
- provide an optional function named ```onPreProcess```
- provide an optional ```process``` function that will handle DOM injection and final resolution of a module via an anonymous ```provide``` call

Handlers can, quite similar to require.js, be explicitly set for a certain module by prefixing the module path by ```[handler]!```. The default handler, e.g., is ```module``` which will automatically be used when no other handler is explicitly specified.

I mentioned earlier that demand comes with handlers for modules, legacy JavaScript, bundles, text, CSS and JSON. This is technically not quite correct. As handlers are also modules the only handlers really built-in are ```module``` and ```bundle```. All other handlers are automatically loaded on demand and, as they are modules as well, get cached in localStorage.

Handlers will automatically get loaded from demand's original location. So if you want to have a handler that is not present there you simply set your own pattern to change the URL to wherever you like. The default pattern is ```/demand/handler``` so if you, e.g., want a handler for ```mytype``` loaded from a custom location just create a pattern for ```/demand/handler/mytype``` via ```demand.configure```.

All handler methods are called with their context set to the module's instance of ```Loader```.


## State of modules
Demand also provides means to get information of the state of modules. Similar to ```clear``` there is a ```list``` method attached to the global (or local) ```demand``` function.

```javascript
// get a list of all handlers and their modules ...
	// ... regardless of state
	demand.list.all();

	// ... being currently loaded/resolved
	demand.list.pending();

	// ... that could not be loaded/resolved
	demand.list.rejected();
	
	// .. that where successfully loaded and resolved
	demand.list.resolved();
```


## Removing loaded modules
If you need a possibility to remove an already loaded Module and its cache to force a reload (for, e.g., "hot reloading") Qoopido.demand provides a built-in ```demand.remove``` method that accepts a module path as argument. The code snippet

```javascript
demand.remove('/nucleus/dom/element');
```

will remove any loaded version of this module from demand and will also clear the module's cache if it exists so that the next call of ```demand('/nucleus/dom/element')``` will fetch a fresh copy via XHR.