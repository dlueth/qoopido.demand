/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_UNDEFINED, FALSE,
	objectDefineProperty,
	validatorIsTypeOf,
	functionUuid,
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require function/uuid.js

function AbstractUuid() {
	if(validatorIsTypeOf(this.uuid, STRING_UNDEFINED)) {
		objectDefineProperty(this, 'uuid', { value: functionUuid(), configurable: FALSE, writable: FALSE });
	}

	return this;
}
