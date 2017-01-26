(function(localStorage) {
	'use strict';

	function definition(functionIterate) {
		var PREFIX               = 'demand',
			SUFFIX               = 'state',
			regexMatchState      = new RegExp('^\\[' + PREFIX + '\\]\\[(.+?)\\]\\[' + SUFFIX + '\\]$'),
			regexMatchProperties = /^(.+?),(\d+),(\d*),(.+?),(\d+)$/;

		function getState(key) {
			var state = localStorage.getItem(key),
				matches;

			if(state && (matches = state.match(regexMatchProperties))) {
				return Array.prototype.slice.call(matches, 1);
			}
		}

		function getKey(id) {
			return '[' + PREFIX + '][' + id + '][' + SUFFIX + ']';
		}

		functionIterate(localStorage, function(property) {
			var match = property.match(regexMatchState),
				state;

			if(match) {
				state = getState(getKey(match[1]));

				if(!state[4]) {
					demand.clear.path(match[1]);
				}
			}
		});

		function filterStates(property) {
			var match = property.match(regexMatchState),
				state;

			if(match) {
				state    = getState(getKey(match[1]));
				state[5] = match[1];

				this.push(state);
			}
		}

		function compareAccess(a, b) {
			if(a[4] < b[4]) {
				return -1;
			}

			if(a[4] > b[4]) {
				return 1;
			}

			return 0;
		}

		return function cacheDispose(size) {
			var states = [],
				state;

			functionIterate(localStorage, filterStates, states);

			states.sort(compareAccess);

			while(size > 0 && states.length) {
				state  = states.shift();
				size  -= state[1];

				demand.clear.path(state[5]);
			}
		};
	}

	provide([ '/demand/function/iterate' ], definition);
}(localStorage));