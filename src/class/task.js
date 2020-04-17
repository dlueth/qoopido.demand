/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	functionToArray, functionUuid,
	ClassPledge
*/

//=require function/toArray.js
//=require function/uuid.js
//=require class/pledge.js

var ClassTask = (function() {
	var lookup = {};

	function isTransferable(value) {
		return (value instanceof ArrayBuffer) || (value instanceof MessagePort) || ('ImageBitmap' in self && value instanceof ImageBitmap);
	}

	function Task(task) {
		var script, worker;

		/* global $task, $isTransferable */
		script = '$task = ' + task + '; $isTransferable = ' + isTransferable + '; onmessage = ' + function(message) {
			var toArray = Array.prototype.slice,
				data    = message.data,
				isSettled;

			function resolve() {
				var args;

				if(!isSettled) {
					isSettled = true;
					args      = toArray.call(arguments);

					postMessage([ data[0], 1, args], args.filter($isTransferable));
				}
			}

			function reject(error) {
				if(!isSettled) {
					isSettled = true;

					postMessage([ data[0], 0, error.toString() ]);
				}
			}

			try {
				$task.apply($task, [ resolve, reject ].concat(data[1]));
			} catch(error) {
				reject(error);
			}
		};

		worker = new Worker(URL.createObjectURL(new Blob([ script ], { type: 'application/javascript' })));

		worker.onmessage = function(message) {
			var uuid = message.data[0],
				dfd  = uuid ? lookup[uuid] : null;

			if(!uuid || !dfd) {
				return;
			}

			if(message.data[1]) {
				dfd.resolve.apply(null, message.data[2]);
			} else {
				dfd.reject(message.data[2]);
			}

			delete lookup[uuid];
		}

		return function() {
			var dfd  = ClassPledge.defer(),
				uuid = functionUuid(),
				args = functionToArray(arguments);

			lookup[uuid] = dfd;

			worker.postMessage([ uuid, args ], args.filter(isTransferable));

			return dfd.pledge;
		}
	}

	return Task;
}());
