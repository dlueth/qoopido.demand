/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_UNDEFINED,
	validatorIsTypeOf,
	functionUuid,
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require function/uuid.js

function AbstractUuid() {
	if(validatorIsTypeOf(this.uuid, STRING_UNDEFINED)) {
		this.defineProperty('uuid', functionUuid());
	}

	return this;
}
