/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	STRING_UNDEFINED,
	validatorIsTypeOf
*/

//=require constants.js
//=require validator/isTypeOf.js

function functionLog(failure) {
	/* eslint-disable no-console */
	if(!validatorIsTypeOf(console, STRING_UNDEFINED)) {
		console.error(failure.toString());
	}
	/* eslint-enable no-console */

	return failure;
}