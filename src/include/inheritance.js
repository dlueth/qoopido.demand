/* global Descriptor, objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor, functionPrototype */

/* global global, document, settings */

/* classes */
	//=require class/descriptor.js
	/* global Descriptor */

(function() {
	function extend(parent) {
		var self       = this,
			prototype  = self.prototype,
			properties = {};

		parent = parent.prototype || parent;

		objectGetOwnPropertyNames(prototype).forEach(function(property) {
			properties[property] = objectGetOwnPropertyDescriptor(prototype, property);
		});

		properties.constructor = new Descriptor(self);
		properties.parent      = new Descriptor(parent);

		self.prototype = objectCreate(parent, properties);
	}

	objectDefineProperty(functionPrototype, 'extends', new Descriptor(extend));
}());