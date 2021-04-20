/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var arrayPrototype                 = Array.prototype,
	arrayPrototypeSlice            = arrayPrototype.slice,
	arrayPrototypeConcat           = arrayPrototype.concat,
	object                         = Object,
	objectCreate                   = object.create,
	objectDefineProperty           = object.defineProperty,
	objectGetOwnPropertyNames      = object.getOwnPropertyNames,
	objectGetOwnPropertyDescriptor = object.getOwnPropertyDescriptor,
	linkElement                    = document.createElement('a'),
	requestAnimationFrame          = global.requestAnimationFrame;
