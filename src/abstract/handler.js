/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	NULL
*/

//=require constants.js

function abstractHandler() {

}

abstractHandler.prototype = {
	validate: NULL,
	onPreRequest: NULL,
	onPostRequest: NULL,
	onPreProcess: NULL,
	process: NULL
};
