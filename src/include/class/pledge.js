/* global
	global, document, demand, provide, queue, processor, settings,
 	FUNCTION_EMPTY, NULL,
	arrayPrototypeSlice, arrayPrototypeConcat,
	functionDefer,
	singletonUuid
*/

//=require constants.js
//=require shortcuts.js
//=require function/defer.js
//=require singleton/uuid.js

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
		var self     = this,
			listener = storage[self.uuid],
			pointer, result;

		if(self.state === PLEDGE_PENDING) {
			self.state = state;
			self.value = parameter;
		}

		while(pointer = listener[self.state].shift()) {
			result = pointer.handler.apply(NULL, self.value);

			if(result && typeof result.then === 'function') {
				result.then(pointer.deferred.resolve, pointer.deferred.reject);
			} else {
				pointer.deferred[self.state === PLEDGE_RESOLVED ? 'resolve' : 'reject'].apply(NULL, self.value);
			}
		}

		listener[PLEDGE_RESOLVED].length = 0;
		listener[PLEDGE_REJECTED].length = 0;
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
		var self = this;

		storage[singletonUuid.set(self)] = { handle: handle.bind(self), resolved: [], rejected: [] };

		executor(resolve.bind(self), reject.bind(self));
	}

	ClassPledge.prototype = {
		/* only for reference
		 uuid:   NULL,
		 value:  NULL,
		 cache:  NULL, // will only be set by storage
		 */
		state:  PLEDGE_PENDING,
		'catch': function(listener) {
			return this.then(FUNCTION_EMPTY, listener);
		},
		always: function(alwaysListener) {
			return this.then(alwaysListener, alwaysListener);
		},
		then: function(resolveListener, rejectListener) {
			var self       = this,
				properties = storage[self.uuid],
				deferred   = ClassPledge.defer();

			resolveListener && properties[PLEDGE_RESOLVED].push({ handler: resolveListener, deferred: deferred });
			rejectListener && properties[PLEDGE_REJECTED].push({ handler: rejectListener, deferred: deferred });

			if(self.state !== PLEDGE_PENDING) {
				functionDefer(properties.handle);
			}

			return deferred.pledge;
		},
		isPending: function() {
			return this.state === PLEDGE_PENDING;
		},
		isResolved: function() {
			return this.state === PLEDGE_RESOLVED;
		},
		isRejected: function() {
			return this.state === PLEDGE_REJECTED;
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
			properties = (storage[singletonUuid.generate()] = { deferred: deferred, resolved: [], rejected: [], total: pledges.length, count: 0 }),
			i = 0, pledge;

		for(; pledge = pledges[i]; i++) {
			observe(pledge, i, properties)
		}

		return deferred.pledge;
	};

	ClassPledge.race = function(pledges) {
		var deferred = ClassPledge.defer(),
			i = 0, pledge;

		for(; pledge = pledges[i]; i++) {
			pledge.then(deferred.resolve, deferred.reject);
		}

		return deferred.pledge;
	};

	return ClassPledge;
}());