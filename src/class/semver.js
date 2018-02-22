/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_UNDEFINED, STRING_STRING,
	validatorIsSemver
*/

//=require constants.js
//=require validator/isSemver.js

// see https://semver.org/#semantic-versioning-specification-semver

var ClassSemver = (function() {
	function parse(version) {
		var parts = version.split('-'),
			i = 0, temp;

		parts = !parts[1] ? parts[0].split('.') : Array.prototype.concat(parts[0].split('.'), parts[1].split('.'));

		for(; (temp = parts[i]); i++) {
			parts[i] = parseInt(temp, 10).toString() === temp ? parseInt(temp, 10) : temp;
		}

		return parts;
	}

	function compareLevel(a, b) {
		return (a < b) ? -1 : ((a > b) ? 1 : 0);
	}

	function compareIdentifier(a, b) {
		var i = 0, pa, pb, tpa, tpb;

		if(a.length && !b.length) {
			return -1;
		} else if(!a.length && b.length) {
			return 1;
		} else if(!a.length && !b.length) {
			return 0;
		}

		do {
			pa  = a[i];
			pb  = b[i];
			tpa = typeof pa;
			tpb = typeof pb;

			if(tpa === STRING_UNDEFINED && tpb === STRING_UNDEFINED) {
				return 0;
			} else if(tpb === STRING_UNDEFINED) {
				return 1;
			} else if(tpa === STRING_UNDEFINED) {
				return -1;
			} else if(pa === pb) {
				continue;
			} else {
				if(tpa === STRING_STRING && tpb !== STRING_STRING) {
					return 1;
				} else if(tpa !== STRING_STRING && tpb === STRING_STRING) {
					return -1;
				} else {
					if(pa > pb) {
						return 1;
					} else if(pa < pb) {
						return -1;
					}
				}
			}
		} while(++i);
	}

	function ClassSemver(version) {
		if(!validatorIsSemver(version)) {
			throw new TypeError('"version" must be a valid semver version string');
		}

		version = parse(version);

		this.major      = version.slice(0, 1);
		this.minor      = version.slice(1, 2);
		this.patch      = version.slice(2, 3);
		this.identifier = version.slice(3);
	}

	ClassSemver.prototype = {
		toString: function() {
			return this.major + '.' + this.minor + '.' + this.patch + (this.identifier.length ? '-' + this.identifier.join('.') : '');
		},
		compare: function(version) {
			return compareLevel(this.major, version.major)
				|| compareLevel(this.minor, version.minor)
				|| compareLevel(this.patch, version.patch)
				|| compareIdentifier(this.identifier, version.identifier);
		}
	};

	return ClassSemver;
}());
