/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	TRUE,
	regexMatchBaseUrl,
	ClassPledge
*/

//=require constants.js
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
		var dfd             = ClassPledge.defer(),
			xhr             = regexMatchBaseUrl.test(url) ? new XMLHttpRequest() : new XDomainRequest(),
			boundCheckState = checkState.bind(xhr),
			timeout         = settings.timeout,
			pointer;

		xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
			dfd.reject(xhr.status);
		};
		xhr.onprogress = xhr.onreadystatechange = function() {
			clearTimeout(pointer);

			pointer = setTimeout(boundCheckState, timeout);
		};
		xhr.onload = function() {
			pointer = clearTimeout(pointer);

			if(!('status' in xhr) || xhr.status === 200) {
				dfd.resolve(xhr.responseText, xhr.getResponseHeader && xhr.getResponseHeader('content-type'));
			} else {
				dfd.reject(xhr.status);
			}
		};

		xhr.open('GET', url, TRUE);
		xhr.send();

		pointer = setTimeout(boundCheckState, timeout);

		return dfd.pledge;
	};
}(XMLHttpRequest));
