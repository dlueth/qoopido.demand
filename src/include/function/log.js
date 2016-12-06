/* global
	global, document, demand, provide, queue, processor, settings,
	STRING_UNDEFINED,
	validatorIsTypeOf
*/

var functionLog = (function() {
	return function log(error) {
		/* eslint-disable no-console */
		if(!validatorIsTypeOf(console, STRING_UNDEFINED)) {
			console.error(error.toString());
		}
		/* eslint-enable no-console */
	}
}());