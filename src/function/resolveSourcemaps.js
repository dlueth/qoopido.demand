/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	regexMatchSourcemap, regexMatchSuffix, regexIsAbsoluteUri
	linkElement
*/

//=require variables.js
//=require shortcuts.js

function functionResolveSourcemaps(url, source) {
	var match, replacement;

	while(match = regexMatchSourcemap.exec(source)) {
		linkElement.href = url;

		if(regexIsAbsoluteUri.test(match[3])) {
			replacement = linkElement.protocol + '//' + linkElement.host + match[3];
		} else {
			linkElement.pathname += (regexMatchSuffix.test(linkElement.pathname) ? '/../' : '/') + match[3];

			replacement = linkElement.protocol + '//' + linkElement.host + linkElement.pathname;
		}

		source = source.replace(match[0], match[1] + ' ' + match[2] + '=' + replacement + '.map' + (match[4] ? ' ' + match[4] : ''));
	}

	return source;
}
