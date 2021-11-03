/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	regexMatchSourcemap, regexIsAbsoluteUri, regexMatchLeadingSlash
*/

//=require variables.js
//=require shortcuts.js

function functionResolveSourcemaps(url, source) {
	var match, replacement;

	while(match = regexMatchSourcemap.exec(source)) {
		if(regexIsAbsoluteUri.test(match[3])) {
			replacement = url.protocol + '//' + url.host + match[3];
		} else {
			url.pathname += '/' + match[3].replace(regexMatchLeadingSlash, '');

			replacement = url.protocol + '//' + url.host + url.pathname;
		}

		source = source.replace(match[0], match[1] + ' ' + match[2] + '=' + replacement + '.map' + (match[4] ? ' ' + match[4] : ''));
	}

	return source;
}
