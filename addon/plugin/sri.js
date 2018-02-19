/* global
	jsSHA
*/

//=include vendor/jssha/src/sha_dev.js

(function(global) {
	'use strict';

	function definition(path, Failure, iterate, isObject) {
		var settings;

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					settings = options;
				}
			})
			.on('postRequest', function(dependency) {
				var options, sha, hash;

				if(options = isEnabled(dependency.path)) {
					try {
            sha = new global.jsSHA(options.type, 'TEXT');

            sha.update(dependency.source);

            if((hash = sha.getHash('B64')) !== options.hash) {
              dependency.dfd.reject(new Failure('hash mismatch, should be "' + options.hash + '" but is "' + hash + '" (sri)', dependency.id));
            }
					} catch(error) {
            dependency.dfd.reject(new Failure('unsupported hashing algorithm (sri)', dependency.id));
					}
				}
			});

		function isEnabled(path) {
			var match;

			iterate(settings, function(key, value) {
				if(key === path) {
					match = value;

					return false;
				}
			});

			return match || false;
		}

    return true;
	}

	provide([ 'path', '/demand/failure', '/demand/function/iterate', '/demand/validator/isObject' ], definition);
}(this));