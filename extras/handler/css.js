(function(document) {
	'use strict';

	function definition(abstractHandler) {
		var target              = document.getElementsByTagName('head')[0],
			resolver            = document.createElement('a'),
			regexMatchUrl       = /url\s*\(\s*["']?(.+?)["']?\s*\)/gi,
			regexMatchImport    = /@import\s+["'](.+?)["']/gi,
			regexIsAbsolutePath = /^\//i,
			regexIsAbsoluteUri  = /^data:|http(s?):|\/\//i,
			regexMatchType      = /^text\/css/;

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
			onPreRequest: function(dependency) {
				var url  = dependency.url;

				dependency.url = url.slice(-4) !== '.css' ? url + '.css' : url;
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

				dependency.source = source;
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

	provide([ '/demand/abstract/handler' ], definition);
}(document));