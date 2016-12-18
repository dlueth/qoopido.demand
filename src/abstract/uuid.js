/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	STRING_UNDEFINED,
	objectDefineProperty,
	validatorIsTypeOf,
	functionUuid,
	ClassDescriptor
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require function/uuid.js
//=require class/descriptor.js

function AbstractUuid() {
	if(validatorIsTypeOf(this.uuid, STRING_UNDEFINED)) {
		objectDefineProperty(this, 'uuid', new ClassDescriptor(functionUuid()));
	}

	return this;
}
