/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	NULL, STRING_STRING, STRING_FUNCTION, EVENT_POST_CONFIGURE,
	arrayPrototypeSlice,
	validatorIsTypeOf
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js

var singletonEvent = (function() {
	var TYPE_ON         = 'on',
		TYPE_AFTER      = 'after',
		regexMatchEvent = /^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,
		listener        = {};

	function addListener(type, events, callback) {
		var event, pointer;

		if(validatorIsTypeOf(events, STRING_STRING) && validatorIsTypeOf(callback, STRING_FUNCTION)) {
			events = events.split(' ');

			while(event = events.shift()) {
				event = event.split(':');

				if(regexMatchEvent.test(event[0])) {
					(listener[event[0]] || (listener[event[0]] = { on: [], after: [] }))[type].push({ callback: callback, filter: event[1] });

					if(type === TYPE_ON && event[0] === EVENT_POST_CONFIGURE && (pointer = settings.modules[event[1]])) {
						callback(pointer);
					}
				}
			}
		}
	}

	function Event() {}

	Event.prototype = {
		emit: function (event, filter) {
			var pointer = listener[event],
				parameter, i, item;

			if(pointer) {
				parameter = arrayPrototypeSlice.call(arguments, 2);

				for(i = 0; (item = pointer[TYPE_ON][i]); i++) {
					if(!item.filter || item.filter === filter) {
						item.callback.apply(NULL, parameter);
					}
				}

				for(i = 0; (item = pointer[TYPE_AFTER][i]); i++) {
					if(!item.filter || item.filter === filter) {
						item.callback.apply(NULL, parameter);
					}
				}
			}

			return this;
		},
		on: function(events, callback) {
			addListener(TYPE_ON, events,callback);

			return this;
		},
		after: function(events, callback) {
			addListener(TYPE_AFTER, events,callback);

			return this;
		}
	};

	return new Event();
}());
