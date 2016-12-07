/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	objectCreate, objectDefineProperty, objectGetOwnPropertyNames, objectGetOwnPropertyDescriptor, functionPrototype,
	ClassDescriptor
*/

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
	}

	objectDefineProperty(functionPrototype, 'extends', new ClassDescriptor(extend));
}());