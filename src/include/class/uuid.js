/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global STRING_UNDEFINED */

/* functions */
	//=require function/isTypeOf.js
	/* global isTypeOf */

/* classes */
	//=require class/descriptor.js
	/* global Descriptor */

var Uuid = (function() {
	var objectDefineProperty = Object.defineProperty,
		regex                = new RegExp('[xy]', 'g'),
		storage              = {};

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
			if(isTypeOf(target.uuid, STRING_UNDEFINED)) {
				objectDefineProperty(target, 'uuid', new Descriptor(this.generate()));
			}

			return target.uuid;
		}
	};

	return new Uuid();
}());