(function(localStorage) {
	'use strict';

	function definition(functionIterate) {
		var PREFIX          = 'demand',
			SUFFIX          = 'state',
			regexMatchState = new RegExp('^\\[' + PREFIX + '\\]\\[(.+?)\\]\\[' + SUFFIX + '\\]$');

		functionIterate(localStorage, function(property) {
			var match = property.match(regexMatchState),
				state;

			if(match) {
				state = JSON.parse(localStorage.getItem('[' + PREFIX + '][' + match[1] + '][' + SUFFIX + ']'));

				if(!state.access) {
					demand.clear.path(match[1]);
				}
			}
		});

		function filterStates(property) {
			var match = property.match(regexMatchState),
				state;

			if(match) {
				state    = JSON.parse(localStorage.getItem('[' + PREFIX + '][' + match[1] + '][' + SUFFIX + ']'));
				state.id = match[1];

				this.push(state);
			}
		}

		function compareAccess(a, b) {
			if(a.access < b.access) {
				return -1;
			}

			if(a.access > b.access) {
				return 1;
			}

			return 0;
		}

		return function cacheDispose(bytes) {
			var states = [],
				state;

			functionIterate(localStorage, filterStates, states);

			states.sort(compareAccess);

			while(bytes > 0 && states.length) {
				state  = states.shift();
				bytes -= state.size;

				demand.clear.path(state.id);
			}
		};
	}

	provide([ '/demand/function/iterate' ], definition);
}(localStorage));