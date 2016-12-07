/* global
	global, document, demand, provide, queue, processor, settings,
	NULL, STRING_STRING, STRING_FUNCTION, EVENT_POST_CONFIGURE,
	arrayPrototypeSlice,
	validatorIsTypeOf
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js

var singletonEvent = (function() {
	var regexMatchEvent = /^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Configure|Request|Process|Cache)$/,
		listener        = {};

	function Event() {}

	Event.prototype = {
		emit: function (event, filter) {
			var pointer = listener[event],
				parameter, i, item;

			if(pointer) {
				parameter = arrayPrototypeSlice.call(arguments, 2);

				for(i = 0; (item = pointer[i]); i++) {
					if(!item.filter || item.filter === filter) {
						item.callback.apply(NULL, parameter);
					}
				}
			}

			return this;
		},
		on: function(events, callback) {
			var event, pointer;

			if(validatorIsTypeOf(events, STRING_STRING) && validatorIsTypeOf(callback, STRING_FUNCTION)) {
				events = events.split(' ');

				while(event = events.shift()) {
					event = event.split(':');

					if(regexMatchEvent.test(event[0])) {
						(listener[event[0]] || (listener[event[0]] = [])).push({ callback: callback, filter: event[1] });

						if(event[0] === EVENT_POST_CONFIGURE && (pointer = settings.modules[event[1]])) {
							callback(pointer);
						}
					}
				}
			}

			return this;
		}
	};

	return new Event();
}());
