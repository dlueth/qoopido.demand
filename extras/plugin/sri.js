/* global
	jsSHA
*/

(function() {
	'use strict';

  //=include vendor/jssha/src/sha_dev.js

	function definition(path, Failure, iterate, isObject) {
		var settings;

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					settings = options;
				}
			})
			.on('postRequest', function(dependency) {
				var options, sha;

				if(options = isEnabled(dependency.path)) {
					try {
            sha = new jsSHA(options.type, 'TEXT');

            sha.update(dependency.source);

            if(sha.getHash('HEX') !== options.hash) {
              dependency.dfd.reject(new Failure('error resolving (sri)', dependency.id));
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

		return jsSHA;
	}

	provide([ 'path', '/demand/failure', '/demand/function/iterate', '/demand/validator/isObject' ], definition);
}());