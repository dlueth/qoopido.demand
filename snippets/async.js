/* global url, main, settings */

(function(window, document, type, target, script){
	target = document.getElementsByTagName(type)[0];
	script = document.createElement(type);

	window.demand = { url: url, main: main, settings: settings };

	script.async = 1;
	script.src   = url;

	target.parentNode.insertBefore(script, target);
}(window, document, 'script'));
