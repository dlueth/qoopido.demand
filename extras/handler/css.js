(function(document) {
	'use strict';

	function definition() {
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

		return {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function() {
				var url  = this.url;

				this.url = url.slice(-4) !== '.css' ? url + '.css' : url;
			},
			onPostRequest: function() {
				var url     = resolveUrl(this.url + '/..'),
					base    = url.href,
					host    = '//' + url.host,
					source  = this.source,
					match;

				while((match = regexMatchUrl.exec(source))) {
					source = replaceUri(source, match, 'url("' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '")');
				}

				while((match = regexMatchImport.exec(source))) {
					source = replaceUri(source, match, '@import "' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '"');
				}

				this.source = source;
			},
			process: function() {
				var element = document.querySelector('[demand-id="' + this.id + '"]');

				if(!element) {
					element      = document.createElement('style');
					element.type = 'text/css';

					element.setAttribute('demand-id', this.id);
					target.appendChild(element);
				}

				if(element.tagName === 'STYLE') {
					if(element.styleSheet) {
						element.styleSheet.cssText = this.source;
					} else {
						element.textContent = this.source;
					}
				}

				provide(function() { return element; });
			}
		};
	}

	provide(definition);
}(document));