/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage
*/

var functionUuid = (function() {
	var regex = new RegExp('[xy]', 'g');

	function randomize(character) {
		var r = Math.random() * 16 | 0;

		return ((character === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
	}

	return function functionUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, randomize);
	};
}());
