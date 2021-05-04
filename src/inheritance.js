/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	FALSE,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor
*/

//=require constants.js
//=require shortcuts.js

(function(strPrototype) {
	function functionExtends(source) {
		var self       = this,
			prototype  = self[strPrototype],
			names      = objectGetOwnPropertyNames(prototype),
			properties = { constructor: { value: self } },
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

	objectDefineProperty(global.Function.prototype, 'extends', { value: functionExtends, configurable: FALSE, writable: FALSE });
}('prototype'));
