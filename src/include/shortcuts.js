/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var arrayPrototype                 = Array.prototype,
	arrayPrototypeSlice            = arrayPrototype.slice,
	arrayPrototypeConcat           = arrayPrototype.concat,
	objectPrototype                = Object.prototype,
	objectPrototypeToString        = objectPrototype.toString,
	objectCreate                   = Object.create,
	objectDefineProperty           = Object.defineProperty,
	objectGetOwnPropertyNames      = Object.getOwnPropertyNames,
	objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
	functionPrototype              = Function.prototype;