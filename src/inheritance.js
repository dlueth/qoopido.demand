/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	TRUE,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor,
	ClassDescriptor
*/

//=require constants.js
//=require shortcuts.js
//=require class/descriptor.js

(function(strPrototype) {
	function objectDefine(name, value, writable, configurable, enumerable) {
		objectDefineProperty(this, name, new ClassDescriptor(value, writable, configurable, enumerable));
	}

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

	objectDefine.call(Object.prototype, 'defineProperty', objectDefine);
	objectDefine.call(global.Object.prototype, 'defineProperty', objectDefine);
	Function.prototype.defineProperty('extends', functionExtends);
	global.Function.prototype.defineProperty('extends', functionExtends);
}('prototype'));
