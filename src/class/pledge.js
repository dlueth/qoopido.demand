/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
 	FUNCTION_EMPTY, NULL,
	arrayPrototypeSlice, arrayPrototypeConcat,
	functionDefer, functionUuid,
	AbstractUuid
*/

//=require constants.js
//=require shortcuts.js
//=require function/defer.js
//=require function/uuid.js
//=require abstract/uuid.js

var ClassPledge = (function() {
	var PLEDGE_PENDING  = 'pending',
		PLEDGE_RESOLVED = 'resolved',
		PLEDGE_REJECTED = 'rejected',
		storage         = {};

	function resolve() {
		storage[this.uuid].handle(PLEDGE_RESOLVED, arguments);
	}

	function reject() {
		storage[this.uuid].handle(PLEDGE_REJECTED, arguments);
	}

	function handle(state, parameter) {
		var properties = storage[this.uuid],
			pointer, result;

		if(properties.state === PLEDGE_PENDING) {
			properties.state = state;
			properties.value = parameter;
		}

		while(pointer = properties[properties.state].shift()) {
			result = pointer.handler.apply(NULL, properties.value);

			if(result && typeof result.then === 'function') {
				result.then(pointer.deferred.resolve, pointer.deferred.reject);
			} else {
				pointer.deferred[properties.state === PLEDGE_RESOLVED ? 'resolve' : 'reject'].apply(NULL, properties.value);
			}
		}

		properties[PLEDGE_RESOLVED].length = 0;
		properties[PLEDGE_REJECTED].length = 0;
	}

	function observe(pledge, index, properties) {
		pledge.then(
			function() {
				properties.resolved[index] = arrayPrototypeSlice.call(arguments);

				properties.count++;

				check(properties);
			},
			function() {
				properties.rejected.push(arrayPrototypeSlice.call(arguments));

				check(properties);
			}
		);
	}

	function check(properties) {
		if(properties.count === properties.total) {
			properties.deferred.resolve.apply(NULL, arrayPrototypeConcat.apply([], properties.resolved));
		} else if(properties.rejected.length + properties.count === properties.total) {
			properties.deferred.reject.apply(NULL, arrayPrototypeConcat.apply([], properties.rejected));
		}
	}

	function ClassPledge(executor) {
		var self = this.parent.constructor.call(this);

		storage[self.uuid] = { state: PLEDGE_PENDING, handle: handle.bind(self), value: NULL, resolved: [], rejected: [], count: 0 };

		executor(resolve.bind(self), reject.bind(self));
	}

	ClassPledge.prototype = {
		'catch': function(listener) {
			return this.then(FUNCTION_EMPTY, listener);
		},
		always: function(alwaysListener) {
			return this.then(alwaysListener, alwaysListener);
		},
		then: function(resolveListener, rejectListener) {
			var properties = storage[this.uuid],
				deferred   = ClassPledge.defer();

			resolveListener && properties[PLEDGE_RESOLVED].push({ handler: resolveListener, deferred: deferred });
			rejectListener && properties[PLEDGE_REJECTED].push({ handler: rejectListener, deferred: deferred });

			if(properties.state !== PLEDGE_PENDING) {
				functionDefer(properties.handle);
			}

			return deferred.pledge;
		},
		isPending: function() {
			return storage[this.uuid].state === PLEDGE_PENDING;
		},
		isResolved: function() {
			return storage[this.uuid].state === PLEDGE_RESOLVED;
		},
		isRejected: function() {
			return storage[this.uuid].state === PLEDGE_REJECTED;
		}
	};

	ClassPledge.defer = function() {
		var self = {};

		self.pledge = new ClassPledge(function(resolveListener, rejectListener) {
			self.resolve = resolveListener;
			self.reject  = rejectListener;
		});

		return self;
	};

	ClassPledge.all = function(pledges) {
		var deferred   = ClassPledge.defer(),
			properties, i = 0, pledge;
		
		if(pledges.length) {
			properties = (storage[functionUuid()] = { deferred: deferred, resolved: [], rejected: [], total: pledges.length, count: 0 })
			
			for(; pledge = pledges[i]; i++) {
				observe(pledge, i, properties)
			}
		} else {
			deferred.resolve();
		}

		return deferred.pledge;
	};

	ClassPledge.race = function(pledges) {
		var deferred = ClassPledge.defer(),
			i = 0, pledge;

		for(; pledge = pledges[i]; i++) {
			pledge.then(deferred.resolve, deferred.reject);
		}
		
		if(!pledges.length) {
			deferred.resolve();
		}

		return deferred.pledge;
	};

	return ClassPledge.extends(AbstractUuid);
}());