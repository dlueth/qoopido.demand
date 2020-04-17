/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, ERROR_LOAD,
	regexIsAbsoluteUri,
	linkElement,
	functionIterate, functionResolveUrl, functionGetTimestamp,
	ClassTask, ClassFailure,
	singletonEvent
*/

//=require constants.js
//=require variables.js
//=require shortcuts.js
//=require function/resolveUrl.js
//=require function/iterate.js
//=require singleton/event.js
//=require class/task.js
//=require class/failure.js

var ClassLoader = (function() {
	var regexMatchEmptySearch = /^(?:\?|)$/,
		loadXhr = new ClassTask(function(resolve, reject, url) {
			var xhr     = new XMLHttpRequest(),
				timeout = 10000,
				checkState, pointer;

			checkState = function() {
				if(this.readyState < 4) {
					this.abort();
				}
			}.bind(xhr);

			xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
				reject(xhr.statusText);
			};

			xhr.onprogress = xhr.onreadystatechange = function() {
				self.clearTimeout(pointer);

				pointer = self.setTimeout(checkState, timeout);
			};

			xhr.onload = function() {
				pointer = self.clearTimeout(pointer);

				if(!('status' in xhr) || xhr.status === 200) {
					resolve(xhr.responseText, xhr.getResponseHeader && xhr.getResponseHeader('content-type'));
				} else {
					reject(xhr.statusText);
				}
			};

			xhr.open('GET', url, true);
			xhr.send();

			pointer = self.setTimeout(checkState, timeout);
		});

	function ClassLoader(dependency) {
		var pattern;

		function resolve(response, type) {
			if(!type || !dependency.handler.validate || dependency.handler.validate(type)) {
				dependency.source = response;

				singletonEvent.emit(EVENT_POST_REQUEST, dependency.type, dependency);
			} else {
				dependency.dfd.reject(new ClassFailure(ERROR_LOAD + ' (content-type)', dependency.id));
			}
		}

		function reject(status) {
			dependency.dfd.reject(new ClassFailure(ERROR_LOAD + (status ? ' (status)' : ''), dependency.id));
		}

		function load(location) {
			location       = location || 0;
			dependency.url = document.createElement('a');

			dependency.url.href = pattern ? functionResolveUrl(pattern.process(dependency.path, location)) : dependency.path;

			if(dependency.invalid) {
				dependency.url.search += ((regexMatchEmptySearch.test(dependency.url.search)) ? '' : '&') + functionGetTimestamp();
			}

			singletonEvent.emit(EVENT_PRE_REQUEST, dependency.type, dependency);

			loadXhr(dependency.url.href)
				.then(
					resolve,
					function(error) {
						location++;

						if (pattern && pattern.location[location]) {
							load(location);
						} else {
							reject(error);
						}
					}
				);
		}

		if(!regexIsAbsoluteUri.test(dependency.path)) {
			functionIterate(settings.pattern, function(property, value) {
				value.matches(dependency.path) && (!pattern || pattern.weight < value.weight) && (pattern = value);
			});
		}

		load();
	}

	return ClassLoader;
}());
