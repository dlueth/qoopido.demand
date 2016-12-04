/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global NULL */

function Descriptor(value, writable, configurable, enumerable) {
	return {
		__proto__:    NULL,
		value:        value,
		enumerable:   !!enumerable,
		configurable: !!configurable,
		writable:     !!writable
	};
}