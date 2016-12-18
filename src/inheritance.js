/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor, functionPrototype,
	functionIterate,
	ClassDescriptor
*/

//=require shortcuts.js
//=require function/iterate.js
//=require class/descriptor.js

(function() {
	function extend(parent) {
		var self       = this,
			prototype  = self.prototype,
			properties = {};

		parent = parent.prototype || parent;

		objectGetOwnPropertyNames(prototype).forEach(function(property) {
			properties[property] = objectGetOwnPropertyDescriptor(prototype, property);
		});

		properties.constructor = new ClassDescriptor(self);
		properties.parent      = new ClassDescriptor(parent);

		self.prototype = objectCreate(parent, properties);

		return self;
	}

	objectDefineProperty(functionPrototype, 'extends', new ClassDescriptor(extend));
}());