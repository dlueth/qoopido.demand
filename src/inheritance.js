/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	TRUE,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor,
	ClassDescriptor
*/

//=require constants.js
//=require shortcuts.js
//=require class/descriptor.js

(function(strPrototype) {
	var descriptor;

	function functionExtends(source) {
		var self       = this,
			prototype  = self[strPrototype],
			names      = objectGetOwnPropertyNames(prototype),
			properties = { constructor:  new ClassDescriptor(self, TRUE, TRUE)},
			i = 0, property;

		for(; (property = names[i]) && !properties[property]; i++) {
			properties[property] = objectGetOwnPropertyDescriptor(prototype, property);
		}

		try {
			self[strPrototype] = objectCreate(source[strPrototype] || source, properties);
		} catch(e) {
			// ES6 class prototypes are readonly at least in Chrome
			// (and assignment throws an error in strict mode) ...
		}

		// ... which is handled here
		if(self[strPrototype] === prototype) {
			throw new TypeError('Unable to extend, prototype is not writable');
		}

		return self;
	}

	descriptor = new ClassDescriptor(functionExtends);

	objectDefineProperty(Function.prototype, 'extends', descriptor);
	objectDefineProperty(global.Function.prototype, 'extends', descriptor);
}('prototype'));
