/* global global, document, demand, provide, settings */

/* variables */
	//=require variables.js
	/* global regexMatchBaseUrl */

/* shortcuts */
	//=require shortcuts.js
	/* global setTimeout, clearTimeout */

/* classes */
	//=require class/pledge.js
	/* global Pledge */

var Xhr = (function(XMLHttpRequest) {
	var XDomainRequest = 'XDomainRequest' in global && global.XDomainRequest || XMLHttpRequest;
	
	function checkState() {
		if(this.readyState < 4) {
			this.abort();
		}
	}
	
	return function Xhr(url) {
		var boundCheckState = checkState.bind(this),
			deferred        = Pledge.defer(),
			xhr             = regexMatchBaseUrl.test(url) ? new XMLHttpRequest() : new XDomainRequest(),
			timeout         = settings.timeout,
			pointer;
		
		xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
			deferred.reject(xhr.status);
		};
		xhr.onprogress = xhr.onreadystatechange = function() {
			clearTimeout(pointer);
			
			pointer = setTimeout(boundCheckState, settings.timeout);
		};
		xhr.onload = function() {
			timeout = clearTimeout(timeout);
			
			if(!('status' in xhr) || xhr.status === 200) {
				deferred.resolve(xhr.responseText, xhr.getResponseHeader && xhr.getResponseHeader('content-type'));
			} else {
				deferred.reject(xhr.status);
			}
		};
		
		xhr.open('GET', url, true);
		setTimeout(function() {
			xhr.send();
		});
		
		pointer = setTimeout(boundCheckState, settings.timeout);
		
		return deferred.pledge;
	}
}(XMLHttpRequest));