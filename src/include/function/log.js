/* global
	global, document, demand, provide, queue, processor, settings,
	STRING_UNDEFINED,
	validatorIsTypeOf
*/

function functionLog(error) {
	/* eslint-disable no-console */
	if(!validatorIsTypeOf(console, STRING_UNDEFINED)) {
		console.error(error.toString());
	}
	/* eslint-enable no-console */
}