/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global NULL, STRING_STRING, STRING_FUNCTION */

/* shortcuts */
	//=require shortcuts.js
	/* global arrayPrototypeSlice */

/* functions */
	//=require function/isTypeOf.js
	/* global isTypeOf */

var event = (function() {
	var regexMatchEvent = /^cache(Miss|Hit|Clear|Exceed)|(pre|post)(Configure.*|Resolve|Request|Process|Cache)$/,
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
		},
		on: function(events, callback) {
			var event;

			if(isTypeOf(events, STRING_STRING) && isTypeOf(callback, STRING_FUNCTION)) {
				events = events.split(' ');

				while(event = events.shift()) {
					event = event.split(':');

					if(regexMatchEvent.test(event[0])) {
						(listener[event[0]] || (listener[event[0]] = [])).push({ callback: callback, filter: event[1] });
					}
				}
			}
		}
	}

	return new Event();
}());
