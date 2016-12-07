/* global
	global, document, demand, provide, queue, processor, settings,
	regexMatchBaseUrl,
	setTimeout, clearTimeout,
	ClassPledge
*/

//=require shortcuts.js
//=require variables.js
//=require class/pledge.js

var ClassXhr = (function(XMLHttpRequest) {
	var XDomainRequest = 'XDomainRequest' in global && global.XDomainRequest || XMLHttpRequest;
	
	function checkState() {
		if(this.readyState < 4) {
			this.abort();
		}
	}
	
	return function ClassXhr(url) {
		var boundCheckState = checkState.bind(this),
			deferred        = ClassPledge.defer(),
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
	};
}(XMLHttpRequest));