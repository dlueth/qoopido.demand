/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor, functionPrototype,
	ClassDescriptor
*/

//=require shortcuts.js
//=require class/descriptor.js

(function() {
	function extend(parent) {
		var self       = this,
			prototype  = self.prototype,
			properties = {},
			names      = objectGetOwnPropertyNames(prototype),
			i = 0, property;

		parent = parent.prototype || parent;

		for(; (property = names[i]); i++) {
			properties[property] = objectGetOwnPropertyDescriptor(prototype, property);
		}

		properties.constructor = new ClassDescriptor(self);
		properties.parent      = new ClassDescriptor(parent);

		self.prototype = objectCreate(parent, properties);

		return self;
	}

	objectDefineProperty(functionPrototype, 'extends', new ClassDescriptor(extend));
}());