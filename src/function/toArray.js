/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	arrayPrototypeSlice
*/

//=require shortcuts.js

function functionToArray(arrayLikeObject, start, end) {
	return arrayPrototypeSlice.call(arrayLikeObject, start, end);
}