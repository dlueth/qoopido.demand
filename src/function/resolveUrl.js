/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	linkElement
*/

//=require shortcuts.js

function functionResolveUrl(url) {
	linkElement.href = url;

	return linkElement.href;
}