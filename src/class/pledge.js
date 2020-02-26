/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
 	FUNCTION_EMPTY, UNDEFINED, STRING_UNDEFINED, NULL,
	arrayPrototypeConcat,
	functionDefer, functionToArray,
	ClassWeakmap
*/

//=require constants.js
//=require shortcuts.js
//=require function/defer.js
//=require function/toArray.js
//=require class/weakmap.js

var ClassPledge = (function() {
	var PLEDGE_PENDING  = 'pending',
		PLEDGE_RESOLVED = 'resolved',
		PLEDGE_REJECTED = 'rejected',
		storage         = new ClassWeakmap();

	function resolve() {
		storage.get(this).handle(PLEDGE_RESOLVED, arguments);
	}

	function reject() {
		storage.get(this).handle(PLEDGE_REJECTED, arguments);
	}

	function handle(state, parameter) {
		var properties = storage.get(this),
			pointer, result;

		if(properties.state === PLEDGE_PENDING) {
			properties.state = state;
			properties.value = parameter;
		}

		while(pointer = properties[properties.state].shift()) {
			try {
				result = pointer.handler.apply(NULL, properties.value);

				if(result && typeof result.then === 'function') {
					result.then(pointer.dfd.resolve, pointer.dfd.reject);

					continue;
				}

				if(typeof result === STRING_UNDEFINED) {
					pointer.dfd[properties.state === PLEDGE_RESOLVED ? 'resolve' : 'reject'].apply(NULL, properties.value);

					continue;
				}

				pointer.dfd.resolve(result);
			} catch(error) {
				pointer.dfd.reject(error);
			}
		}

		properties[PLEDGE_RESOLVED].length = 0;
		properties[PLEDGE_REJECTED].length = 0;
	}

	function observe(pledge, index, properties) {
		pledge.then(
			function() {
				properties.resolved[index] = functionToArray(arguments);

				properties.count++;

				check(properties);
			},
			function() {
				properties.rejected.push(functionToArray(arguments));

				check(properties);
			}
		);
	}

	function check(properties) {
		if(properties.count === properties.total) {
			properties.dfd.resolve.apply(NULL, arrayPrototypeConcat.apply([], properties.resolved));
		} else if(properties.rejected.length + properties.count === properties.total) {
			properties.dfd.reject.apply(NULL, arrayPrototypeConcat.apply([], properties.rejected));
		}
	}

	function ClassPledge(executor) {
		var self = this;

		storage.set(self, { state: PLEDGE_PENDING, handle: handle.bind(self), value: NULL, resolved: [], rejected: [], count: 0 });

		executor(resolve.bind(self), reject.bind(self));

		return self;
	}

	ClassPledge.prototype = {
		'catch': function(listener) {
			return this.then(UNDEFINED, function() {
				var dfd = ClassPledge.defer(),
					result;

				try {
					result = listener.apply(NULL, arguments);

					if(result && typeof result.then === 'function') {
						result.then(dfd.resolve, dfd.reject);
					} else {
						dfd.resolve(result);
					}
				} catch(error) {
					dfd.reject(error);
				}

				return dfd.pledge;
			});
		},
		always: function(listener) {
			return this.then(listener, function() {
				var dfd = ClassPledge.defer(),
					result;

				try {
					result = listener.apply(NULL, arguments);

					if(result && typeof result.then === 'function') {
						result.then(dfd.resolve, dfd.reject);
					} else {
						dfd.reject.apply(NULL, arguments);
					}
				} catch(error) {
					dfd.reject(error);
				}

				return dfd.pledge;
			});
		},
		then: function(resolveListener, rejectListener) {
			var properties = storage.get(this),
				dfd        = ClassPledge.defer();

			properties[PLEDGE_RESOLVED].push({
				handler: resolveListener || function() { return ClassPledge.resolve.apply(NULL, arguments) },
				dfd: dfd
			});

			properties[PLEDGE_REJECTED].push({
				handler: rejectListener || function() { return ClassPledge.reject.apply(NULL, arguments) },
				dfd: dfd
			});

			if(properties.state !== PLEDGE_PENDING) {
				functionDefer(properties.handle);
			}

			return dfd.pledge;
		},
		isPending: function() {
			return storage.get(this).state === PLEDGE_PENDING;
		},
		isResolved: function() {
			return storage.get(this).state === PLEDGE_RESOLVED;
		},
		isRejected: function() {
			return storage.get(this).state === PLEDGE_REJECTED;
		}
	};

	ClassPledge.prototype.finally = ClassPledge.prototype.always;

	ClassPledge.defer = function() {
		var self = {};

		self.pledge = new ClassPledge(function(resolveListener, rejectListener) {
			self.resolve = resolveListener;
			self.reject  = rejectListener;
		});

		return self;
	};

	ClassPledge.all = function(pledges) {
		var dfd = ClassPledge.defer(),
			properties, i = 0, pledge;

		if(pledges.length) {
			properties = { dfd: dfd, resolved: [], rejected: [], total: pledges.length, count: 0 };

			for(; pledge = pledges[i]; i++) {
				observe(pledge, i, properties)
			}
		} else {
			dfd.resolve();
		}

		return dfd.pledge;
	};

	ClassPledge.race = function(pledges) {
		var dfd = ClassPledge.defer(),
			i = 0, pledge;

		for(; pledge = pledges[i]; i++) {
			pledge.then(dfd.resolve, dfd.reject);
		}

		if(!pledges.length) {
			dfd.resolve();
		}

		return dfd.pledge;
	};

	ClassPledge.resolve = function() {
		var dfd = ClassPledge.defer();

		dfd.resolve.apply(NULL, arguments);

		return dfd.pledge;
	};

	ClassPledge.reject = function() {
		var dfd = ClassPledge.defer();

		dfd.reject.apply(NULL, arguments);

		return dfd.pledge;
	};

	return ClassPledge;
}());
