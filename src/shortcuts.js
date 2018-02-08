/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var arrayPrototype                 = Array.prototype,
	arrayPrototypeSlice            = arrayPrototype.slice,
	arrayPrototypeConcat           = arrayPrototype.concat,
	object                         = Object,
	objectPrototype                = object.prototype,
	objectPrototypeToString        = objectPrototype.toString,
	objectCreate                   = object.create,
	objectDefineProperty           = object.defineProperty,
	objectGetOwnPropertyNames      = object.getOwnPropertyNames,
	objectGetOwnPropertyDescriptor = object.getOwnPropertyDescriptor,
	linkElement                    = document.createElement('a');
