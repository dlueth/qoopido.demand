(function(document) {
	'use strict';

	function definition(path, abstractHandler, functionResolveSourcemaps, isObject, merge) {
		var target              = document.getElementsByTagName('head')[0],
			resolver            = document.createElement('a'),
			regexMatchUrl       = /url\s*\(\s*["']?(.+?)["']?\s*\)/gi,
			regexMatchImport    = /@import\s+["'](.+?)["']/gi,
			regexIsAbsolutePath = /^\//i,
			regexIsAbsoluteUri  = /^data:|http(s?):|\/\//i,
			regexMatchType      = /^text\/css/,
			settings            = { suffix: '.css' };

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					merge(settings, options);
				}
			});

		function resolveUrl(url) {
			resolver.href = url;

			return resolver;
		}

		function replaceUri(source, match, replacement) {
			if(!regexIsAbsoluteUri.test(match[1])) {
				source = source.replace(match[0], replacement);
			}

			return source;
		}

		function HandlerCss() {}

		HandlerCss.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function(dependency, suffix) {
				var pathname;

				suffix = (typeof suffix !== 'undefined') ? suffix : settings.suffix;

				if(suffix) {
					pathname = dependency.url.pathname;

					dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
				}
			},
			onPostRequest: function(dependency) {
				var url     = resolveUrl(dependency.url + '/..'),
					base    = url.href,
					host    = '//' + url.host,
					source  = dependency.source,
					match;

				while((match = regexMatchUrl.exec(source))) {
					source = replaceUri(source, match, 'url("' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '")');
				}

				while((match = regexMatchImport.exec(source))) {
					source = replaceUri(source, match, '@import "' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '"');
				}

				dependency.source = functionResolveSourcemaps(dependency.url, source);
			},
			process: function(dependency) {
				var element = document.querySelector('[demand-id="' + dependency.id + '"]');

				if(!element) {
					element      = document.createElement('style');
					element.type = 'text/css';

					element.setAttribute('demand-id', dependency.id);
					target.appendChild(element);
				}

				if(element.tagName === 'STYLE') {
					if(element.styleSheet) {
						element.styleSheet.cssText = dependency.source;
					} else {
						element.textContent = dependency.source;
					}
				}

				provide(function() { return element; });
			}
		};

		return new (HandlerCss.extends(abstractHandler));
	}

	provide([ 'path', '/demand/abstract/handler', '/demand/function/resolveSourcemaps', '/demand/validator/isObject', '/demand/function/merge' ], definition);
}(document));
