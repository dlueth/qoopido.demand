(function() {
	'use strict';

	function definition(functionIterate, cacheStates) {
		function compareAccess(a, b) {
			if(a.accessed < b.accessed) {
				return -1;
			}

			if(a.accessed > b.accessed) {
				return 1;
			}

			return 0;
		}

		return function cacheDispose(size) {
			var states = cacheStates(),
				item;

			states.sort(compareAccess);

			while(size > 0 && states.length) {
				item  =  states.shift();
				size  -= item.size;

				demand.cache.clear(item.id);
			}
		};
	}

	provide([ '/demand/function/iterate', './states' ], definition);
}());
