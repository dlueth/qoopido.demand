/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	regexMatchSourcemap, regexIsAbsoluteUri
	linkElement
*/

//=require variables.js
//=require shortcuts.js

function functionResolveSourcemaps(url, source) {
	var match, replacement;
	
	while(match = regexMatchSourcemap.exec(source)) {
		linkElement.href = url;
		
		if(regexIsAbsoluteUri.test(match[2])) {
			replacement = linkElement.protocol + '//' + linkElement.host + match[2];
		} else {
			linkElement.pathname += '/../' + match[2];
			
			replacement = linkElement.protocol + '//' + linkElement.host + linkElement.pathname;
		}
		
		source = source.replace(match[0], match[1] + ' sourceMappingURL=' + replacement + '.map' + (match[3] ? ' ' + match[3] : ''));
	}
	
	return source;
}