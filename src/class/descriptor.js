/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	NULL
*/

//=require constants.js

function ClassDescriptor(value, writable, configurable, enumerable) {
	return {
		__proto__:    NULL,
		value:        value,
		enumerable:   !!enumerable,
		configurable: !!configurable,
		writable:     !!writable
	};
}
