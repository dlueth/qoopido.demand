> **If you would like to support this project feel free to star or fork it, or both. By doing so it will be easier to get it into some of the usual CDNs :)**

> And if you like it and want to help even more, spread the word as well!

# Qoopido.demand
Qoopido.demand is a modular, flexible, localStorage caching and totally async JavaScript module loader with a promise like interface. All these features come in a tiny package of **~3.59 kB minified and gzipped**.

Qoopido.demand originated from my daily use of require.js for my Qoopido.js library. Caused by the nature of the library (modular/atomic modules, no concatenation) I have been having an eye on basket.js as well as it is able to reduce the number of requests on recurring requests. Sadly enough there was no solution combining the advantages of both - until now.

You will find some demo code in this repo's demo directory via [rawgit](https://rawgit.com/dlueth/qoopido.demand/master/demo/index.html). Just open your developer console and remember to clear your localStorage :)

## Key features in detail
- promise like interface (no native promise support required)
- any loaded module will be cached in localStorage for blazingly fast performance
- cache will be validated against global semver versioning, a modules URL and an expiration timeout
- manual cache invalidation (if needed)
- only state information will be stored in localStorage as JSON, value is stored as a String (so a probably huge JS will not have to be stringified/parsed every time)
- dependencies of loaded modules are resolved relative to their parent module if their path is relative
- support for loading JavaScript and CSS included
- further custom types can be added easily
- support for loading non compatible scripts via configurable "probe" functions, similar to require.js shims
- basic support for loading require.js modules via a loadable adapter module
- support for "patterns" which are mostly equivalent to require.js "paths"
- success handlers get passed all resolved, error handlers receive all rejected modules


## Compatibility
Qoopido.demand does not officially support older legacy Internet Explorers (< IE9) but might still work with some polyfills. I do test on OSX Yosemite and demand is fully working on Chrome, Firefox, Safari and Opera there. To test IE9, 10, 11 as well as Edge (which are also fully supported) the official Microsoft VMs in combination with VirtualBox are being used.

## Limitations
Due to the fact that modules are being loaded via XHR/XDR a remote server will have to have CORS headers set. Most of the usual CDNs have CORS enabled by default.

## External dependencies
None!


## Availability
Qoopido.demand is available on GitHub as well as jsdelivr and npm at the moment. CDNJS will follow in the near future.


## Loading demand
Use the following code snippet in a standalone script tag before the closing body tag to include demand:

```javascript
(function(url, main, settings) {
	(function(window, document, type, target, script){
		target = document.getElementsByTagName(type)[0];
		script = document.createElement(type);

		window.demand = { url: url, main: main, settings: settings };

		script.async = script.defer = 1;
		script.src   = url;

		target.parentNode.insertBefore(script, target);
	}(window, document, 'script'))
}('/src/demand.js', 'app/main', { base: '/demo', version: '1.0.0' }));
```

You may as well use the uglified version:

```javascript
!function(a,b,c){!function(d,e,f,g,h){g=e.getElementsByTagName(f)[0],h=e.createElement(f),d.demand={url:a,main:b,settings:c},h.async=h.defer=1,h.src=a,g.parentNode.insertBefore(h,g)}(window,document,"script")}
("/src/demand.js","app/main",{base:"/demo",version:"1.0.0"});
```

The above snippet is very similar to the one Google Analytics provides. The outer function allows you to specify an URL from which to load demand itself as well as a path to the main module and configuration settings for demand. The path to the main module will be relative to base if it is relative itself.

## Configuration options
The last parameter of the above code snippet is a configuration object. Tt just shows the properties you will most frequently set. There are some more options, less frequently used, that can be either specified here or as part of a ```demand.configure``` call in your ```main``` module (being described in the next section):

```javascript
{
	// enables or disables caching in general
	// optional, defaults to "true"
	cache: true,
				
	// cache will be validated against version
	// optional, defaults to "1.0.0"
	version: '1.0.0',
				
	// cache will be validated against lifetime, if > 0
	// optional, defaults to "0"
	// unit: seconds
	lifetime: 60,
				
	// sets the timeout for XHR requests
	// loaded but not yet resolved modules 
	// have a timeout of timeout / 5 to get
	// resolved by their handler
	// optional, defaults to "5" (limited to "2" up to "10")
	// unit: seconds
	timeout: 8, 
				
	// base path from where your relative 
	// dependencies get loaded
	// optional, defaults to "/"
	base: '[path/url to your scripts]',
				
	// optional
	pattern: {
		'/qoopido': '[path/url to Qoopido.js]',
		'/jquery':  '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min'
	},
				
	// probes allow you to write fallback tests
	// for modules that do not natively support
	// demand/provide
	// optional
	probes: {
		'/jquery': function() { return global.jQuery; }
		}
	}
```

## Usage
The demanded ```main``` module from the above script might look like the following example:

```javascript
;(function(global, demand, provide) {
	'use strict';

	function definition() {
		demand
			.configure({
				// any option from the previous section
				// most likely something like:
				pattern: {
				},
				probes: {
				}
			});
			
		return true; // just return true if there really is nothing to return
	}
	
	provide(definition);
}(this, demand, provide));
```
Qoopido.demand consists of two components ```demand``` and ```provide``` just like require.js ```require``` and ```define```.

Once demand is loaded anything that is either explicitly requested via ```demand``` or as a dependency of a ```provide``` call will be loaded via XHR as well as modified and injected into the DOM with the help of a handler. The result will be cached in ```localStorage``` (if caching is enabled and localStorage is available) and will get validated against the version number and the timeout both set via ```configure```, as well as the modules URL.

As you might have guessed already ```main``` itself is also loaded as a module and therefore will also get cached in localStorage.

## More about handlers
```demand``` comes with handlers for JavaScript and CSS. Handlers have three objectives:

- provide a function named ```prepare``` that modifies the final URL (e.g. add a file extension like ```.js```) before requesting it via XHR/XDR
- provide a function named ```resolve``` that handles DOM injection and final resolution of a module via an anonymous ```provide``` call
- provide an optional function named ```modify``` that, if present, handles necessary conversion of the loaded source (e.g. CSS paths that are normally relative to the CSS-file path and sourcemap URLs in Javascript)

Handlers can, quite similar to require.js, be explicitly set for a certain module by prefixing the module path by ```[handler]!```. The default handler, e.g., is ```js``` which will automatically be used when no other handler is explicitly set.

I mentioned earlier that demand comes with handlers for JavaScript and CSS. This is not technically correct I have to admit. As handlers are also modules the only built-in handler is for Javascript to be honest. The CSS handler is part of demand as a standalone module that will automatically get loaded from the ```handler``` subdirectory of the location you orignally loaded demand from.

Due to the fact that handlers are modules as well you are able to write your own handlers quite easily. Simply look at the module in ```/src/handler/css.js``` and adopt it accordingly.

As stated above handlers will automatically get loaded from demand's original location. So if you want to have a handler that is not present there you simply set your own pattern to change the URL to wherever you like. The default pattern is ```/demand/handler``` so if you, e.g., want a handler for ```mytype``` loaded from a custom location just create a pattern for ```/demand/handler/mytype```.

Just keep these few things in mind:

- ```prepare``` must return the modified URL
- ```resolve``` must make an anonymous ```provide``` call that resolves the queued loader
- in case you need a ```modify``` function make sure it returns the modified ```value```


## Controlling the cache
If caching is enabled, localStorage available and its quota not exceeded chances are good you will never have to manually deal with the caching.

By default demand will invalidate a modules cache under the following conditions:

- global ```version``` changed
- cache is expired due to ```lifetime```
- a modules URL changed

Demand will, in addition, do its best to keep leftover garbage to a minimum. It does so by starting an automatic garbage collection for expired caches on load. In addition it will also clear a cache if it gets requested and is found to be invalid for any reason.

Beside this demand still offers manual control by registering a ```demand.clear``` object to the global demand function. This object offers the following emthods to control the cache:

```javascript
// only clear a single module's cache
demand.clear.path('[module path]');

// clear all expired caches
demand.clear.expired();

// completely clear the cache
demand.clear.all();
```

**Sidenote**
> Demand does use a prefix for its localStorage keys to prevent conflicts with other scripts. Each cache will consist of two keys, one to store the ```state``` information (as JSON) and one for the actual ```source``` of the module. By separating the two only a very small string will have to get parsed as JSON which could lead to performance constraints if a potentially huge module would have to get parsed this way.

> Demand will also do its best to detect "quota exceeded" errors by putting a try/catch around the actual cache writes. As IE does not throw exceptions currently a workaround to use ```localStorage.remainingSpace```is implemented as well.


## Demanding modules
After your project is set up accordingly you can load further modules like this

```javascript
demand('app/test', '/qoopido/component/iterator')
	.then(
		function(appTest, qoopidoComponentIterator) {
			console.log('=> success', appTest, qoopidoComponentIterator);

			new qoopidoComponentIterator();
		},
		function() {
			console.log('=> error', arguments);
		}
	);
```

Module paths not starting with a ```/``` will be resolved relative to the path of an eventual parent module. The resulting path will afterwards get matched to patterns defined via ```demand.configure``` which will finally lead to an absolute URL to fetch the module from.

**Sidenote**
> The error callback function will be passed **all** rejected dependencies as arguments, not only the first one rejected.


## Providing inline modules
Beside demanding other modules you can as well provide your own, just like in the following example:

```javascript
function definition(appTest, qoopidoBase) {
	return function appMain() {

	}
}

provide('/app/main', definition)
	.when('test', '/qoopido/base');
```

This is an example for an inline module. The ```provide``` call, in this case, consists of two arguments:

- path of the module
- definition of the module

When dynamically loading modules ```path``` will have to be omitted and gets internally resolved via loading queue handling instead.

Module resolution via ```provide``` is internally defered to be able to return an object providing a ```when``` function to request dependencies.


## Providing loadable modules
You just learnt how to provide inline modules which is only slightly different from building an external, loadable module. Demand will dynamically load any modules that are not already registered.

In addition to inline modules you just need some boilerplate code and an anynymous ```provide``` call without the ```path``` argument like in the following example:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {
		return function appTest() {

		}
	}

	provide(definition)
		.when('/qoopido/base');
}());
```

This example illustrates a module named ```/app/test``` which we already know as the first dependency of the prior example. As with the inline module the ```definition``` function will receive all dependencies as arguments passed so they are in scope of the actual module.


## Loading require.js modules
By its nature as a module loader demand shares the parameters common also to other loaders like require.js. As its function principle is quite different demand is therefore not directly able to load require.js modules.

But to not let you guys down with your existing require.js modules (and, yes, I also used and loved it - honestly!) demand provides a loadable adapter to provide an abstraction between require.js modules and demand modules.

The adapter can be loaded via demand and used in, e.g., your main module via:

```javascript
demand('/adapter/require')
	.then(
		function() {
			require([ 'dependency1', 'dependency2' ], function(dependency1, dependency2) {
			});
		}
	);
```

Require.js modules loaded via the adapter will be loaded via ```demand``` and will therefore benefit from its caching mechanisms as well.

Missing from the adapter is the support for the simplified CommonJS wrapper that is part of require.js itself. At the time of this writing require.js ```bundles```are also not supported. The latter will most likely change due to the fact that ```bundles```are planned as a feature of Qoopido.demand as well.