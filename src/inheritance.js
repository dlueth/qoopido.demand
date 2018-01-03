/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor,
	ClassDescriptor
*/

//=require shortcuts.js
//=require class/descriptor.js

(function() {
	var descriptor;

	function extend(parent) {
		var self       = this,
			prototype  = self.prototype,
			properties = {},
			names      = objectGetOwnPropertyNames(prototype),
			i = 0, property;

		for(; (property = names[i]); i++) {
			properties[property] = objectGetOwnPropertyDescriptor(prototype, property);
		}

		properties.constructor = new ClassDescriptor(self);
		self.prototype         = objectCreate(parent.prototype || parent, properties);

		return self;
	}

	descriptor = new ClassDescriptor(extend);

	objectDefineProperty(Function.prototype, 'extends', descriptor);
	objectDefineProperty(global.Function.prototype, 'extends', descriptor);
}());