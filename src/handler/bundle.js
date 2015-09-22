/**
 * Qoopido.demand handler/bundle
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function(document) {
	'use strict';

	var target              = document.getElementsByTagName('head')[0],
		regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g;

	function definition(settings, removeProtocol, resolveUrl) {
		return {
			matchType: /^(application|text)\/javascript/,
			/**
			 * handles modifying of JavaScript module's source prior to caching
			 *
			 * Rewrites sourcemap URL to an absolute URL in relation to the URL the module was loaded from
			 *
			 * @this Loader
			 */
			onPostRequest: function() {
				var self   = this,
					url    = self.url,
					source = self.source,
					match, replacement;

				while(match = regexMatchSourcemap.exec(source)) {
					replacement = removeProtocol(resolveUrl(url + '/../' + match[1]));
					source      = source.replace(match[0], '//# sourcemap=' + replacement + '.map');
				}

				self.source = source;
			},
			/**
			 * handles pre-processing of loaded JavaScript bundles
			 *
			 * @this Loader
			 */
			onPreProcess: function(aLoader) {
				var self    = aLoader,
					source  = self.source,
					defered = self.defered,
					modules = settings[self.path],
					i = 0, module, script;

				for(; (module = modules[i]) !== undefined; i++) {
					modules[i] = 'mock!' + module;
				}

				script       = document.createElement('script');
				script.async = true;
				script.text  = source;

				script.setAttribute('demand-type', self.type);
				script.setAttribute('demand-path', self.path);

				target.appendChild(script);

				demand
						.apply(null, modules)
						.then(
								function() {
									defered.resolve.apply(null, arguments);

									setTimeout(function() {
										provide(function() { return true; });
									});
								},
								defered.reject
						);
			}
		};
	}

	provide(definition)
		.when('settings', '/demand/modifier/removeProtocol', '/demand/function/resolve/url', '/demand/handler/mock');
}(document));