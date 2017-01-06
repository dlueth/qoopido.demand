/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage
*/

var functionUuid = (function() {
	var regex   = new RegExp('[xy]', 'g'),
		storage = {};

	function randomize(character) {
		var r = Math.random() * 16 | 0;

		return ((character === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
	}

	return function functionUuid() {
		var uuid;

		do {
			uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, randomize);
		} while(storage[uuid]);

		storage[uuid] = 1;

		return uuid;
	};
}());