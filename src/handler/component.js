/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	FALSE, EVENT_POST_REQUEST, ERROR_RESOLVE,
	functionResolveSourcemaps,
	abstractHandler,
	ClassDependency, ClassPledge, ClassFailure
*/

//=require constants.js
//=require function/resolveSourcemaps.js
//=require abstract/handler.js
//=require class/dependency.js
//=require class/pledge.js
//=require class/Failure.js

var handlerComponent = (function() {
	var suffix         = '.html',
		regexMatchType = /^text\/.+$/;

	function HandlerComponent() {}

	HandlerComponent.prototype = {
		validate: function(type) {
			return regexMatchType.test(type);
		},
		onPreRequest: function(dependency) {
			var pathname = dependency.url.pathname;
			
			dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
		},
		onPostRequest: function(dependency) {
			dependency.source = functionResolveSourcemaps(dependency.url, dependency.source);
		},
		onPreProcess: function(dependency) {
			var context   = dependency.path,
				dfd       = dependency.dfd,
				container = document.createElement('body'),
				modules   = [],
				pledges   = [],
				node, handler, path, uri;

			dependency.enqueue  = FALSE;
			container.innerHTML = dependency.source;

			function reject() {
				dfd.reject(new ClassFailure(ERROR_RESOLVE, dependency.id, arguments));
			}

			while(node = container.firstElementChild) {
				if(handler = node.getAttribute('type')) {
					path = node.getAttribute('path');
					uri  = handler + '!' + context + (path ? '/' + path : '');

					node.parentNode.removeChild(node);
					modules.push({ source: node.textContent, uri:  uri });
					pledges.push(ClassDependency.resolve('mock:' + uri).pledge);
				}
			}

			ClassPledge.all(pledges).then(
				function() {
					var i = 0, module, dependency;

					pledges.length = 0;

					for(; (module = modules[i]); i++) {
						dependency         = ClassDependency.get(module.uri) || new ClassDependency(module.uri);
						dependency.source  = module.source;
						dependency.handler = arguments[i];

						pledges.push(dependency.pledge);

						queue.enqueue(dependency);
					}

					ClassPledge.all(pledges).then(dfd.resolve, reject);
				},
				reject
			);
		}
	};

	return new (HandlerComponent.extends(abstractHandler));
}());