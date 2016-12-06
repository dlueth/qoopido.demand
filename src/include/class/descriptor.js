/* global
	global, document, demand, provide, queue, processor, settings,
	NULL
*/

var ClassDescriptor = (function() {
	return function Descriptor(value, writable, configurable, enumerable) {
		return {
			__proto__:    NULL,
			value:        value,
			enumerable:   !!enumerable,
			configurable: !!configurable,
			writable:     !!writable
		};
	}
}());