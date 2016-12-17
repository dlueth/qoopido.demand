/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_UNDEFINED,
	objectDefineProperty,
	validatorIsTypeOf,
	ClassDescriptor
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require class/Descriptor.js

var singletonUuid = (function() {
	var regex   = new RegExp('[xy]', 'g'),
		storage = {};

	function randomize(character) {
		var r = Math.random() * 16 | 0;

		return ((character === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
	}

	function Uuid() {}

	Uuid.prototype = {
		generate: function() {
			var result;

			do {
				result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, randomize);
			} while(storage[result]);

			storage[result] = 1;

			return result;
		},
		set: function(target) {
			if(validatorIsTypeOf(target.uuid, STRING_UNDEFINED)) {
				objectDefineProperty(target, 'uuid', new ClassDescriptor(this.generate()));
			}

			return target.uuid;
		}
	};

	return new Uuid();
}());