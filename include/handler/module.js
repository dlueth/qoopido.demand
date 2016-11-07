/**
 * /demand/handler/module
 */

(function() {
	function definition() {
		var target              = document.getElementsByTagName('head')[0],
			regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g;
		
		return {
			matchType: /^(application|text)\/(x-)?javascript/,
			onPreRequest: function() {
				var url  = this.url;
				
				this.url = url.slice(-3) !== '.js' ? url + '.js' : url;
			},
			onPostRequest: function() {
				var self   = this,
					source = self.source,
					match, replacement;
				
				if(source) {
					while(match = regexMatchSourcemap.exec(source)) {
						if(regexIsAbsolutePath.test(match[1])) {
							resolver.href = self.url;
							
							replacement = resolver.protocol + '//' + resolver.host + match[1];
						} else {
							replacement = resolveUrl(self.url + '/../' + match[1]);
						}
						
						source = source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
					}
					
					self.source = source;
				}
			},
			process: function() {
				var source = this.source,
					script;
				
				if(source) {
					script       = document.createElement('script');
					script.async = true;
					script.text  = source;
					
					script.setAttribute('demand-path', this.path);
					
					target.appendChild(script);
				}
			}
		};
	}
	
	provide(MODULE_PREFIX_HANDLER + 'module', definition);
}());