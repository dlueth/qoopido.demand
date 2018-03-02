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

		function filterStates(property) {
			var match = property.match(regexMatchState),
				state;

			if(match) {
				state = getState(getKey(match[1]));

				this.push({
					id:       match[1],
					version:  state[0],
					size:     parseInt(state[1], 10),
					expires:  state[2] ? new Date(parseInt(state[2], 10)) : null,
					demand:   state[3],
					accessed: new Date(parseInt(state[4], 10))
				});
			}
		}

		return function cacheStats() {
			return functionIterate(localStorage, filterStates, []);
		};
	}

	provide([ '/demand/function/iterate' ], definition);
}(localStorage));
