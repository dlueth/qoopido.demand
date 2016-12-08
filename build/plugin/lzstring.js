/**
 * Based on lz-string:
 *   Repo:    https://github.com/pieroxy/lz-string
 *   License: https://github.com/pieroxy/lz-string/blob/master/LICENSE.txt
 */

(function() {
	'use strict';

	function definition(path, iterate, isObject, isTypeOf) {
		var stringFormCharCode            = String.fromCharCode,
			objectPrototypeHasOwnProperty = Object.prototype.hasOwnProperty,
			mathPow22                     = Math.pow(2, 2),
			mathPow28                     = Math.pow(2, 8),
			mathPow216                    = Math.pow(2, 16),
			pattern                       = [ { pattern: path, weight: path.length, state: false }],
			enabled;
		
		function onPostConfigure(options) {
			if(isObject(options)) {
				pattern.length = 0;
				
				iterate(options, function(key, value) {
					pattern.push({ pattern: key, weight: key.length, state: value });
				});
			} else if(isTypeOf(options, 'boolean')) {
				enabled = options;
			}
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);

		function compressUTF16(uncompressed, bitsPerChar) {
			var contextDictionary         = {},
				contextDictionaryToCreate = {},
				contextC                  = '',
				contextWc                 = '',
				contextW                  = '',
				contextEnlargeIn          = 2,
				contextDictSize           = 3,
				contextNumBits            = 2,
				contextData               = [],
				contextDataVal            = 0,
				contextDataPosition       = 0,
				ii = 0, i, value;

			bitsPerChar -= 1;

			function subprocess() {
				if(contextDataPosition === bitsPerChar) {
					contextData.push(getCharFromInt(contextDataVal));

					contextDataPosition = 0;
					contextDataVal      = 0;
				} else {
					contextDataPosition++;
				}
			}

			function process() {
				if(objectPrototypeHasOwnProperty.call(contextDictionaryToCreate, contextW)) {
					if(contextW.charCodeAt(0) < 256) {
						for(i = 0; i < contextNumBits; i++) {
							contextDataVal = (contextDataVal << 1);

							subprocess();
						}

						value = contextW.charCodeAt(0);

						for(i = 0; i < 8; i++) {
							contextDataVal = (contextDataVal << 1) | (value & 1);

							subprocess();

							value = value >> 1;
						}
					} else {
						value = 1;

						for(i = 0; i < contextNumBits; i++) {
							contextDataVal = (contextDataVal << 1) | value;

							subprocess();

							value = 0;
						}

						value = contextW.charCodeAt(0);

						for(i = 0; i < 16; i++) {
							contextDataVal = (contextDataVal << 1) | (value & 1);

							subprocess();

							value = value >> 1;
						}
					}

					contextEnlargeIn--;

					if(contextEnlargeIn === 0) {
						contextEnlargeIn = Math.pow(2, contextNumBits);

						contextNumBits++;
					}

					delete contextDictionaryToCreate[contextW];
				} else {
					value = contextDictionary[contextW];

					for(i = 0; i < contextNumBits; i++) {
						contextDataVal = (contextDataVal << 1) | (value & 1);

						subprocess();

						value = value >> 1;
					}
				}

				contextEnlargeIn--;
			}

			for(; uncompressed[ii]; ii++) {
				contextC = uncompressed.charAt(ii);

				if(!objectPrototypeHasOwnProperty.call(contextDictionary, contextC)) {
					contextDictionary[contextC]         = contextDictSize++;
					contextDictionaryToCreate[contextC] = true;
				}

				contextWc = contextW + contextC;

				if(objectPrototypeHasOwnProperty.call(contextDictionary, contextWc)) {
					contextW = contextWc;
				} else {
					process();

					if(contextEnlargeIn === 0) {
						contextEnlargeIn = Math.pow(2, contextNumBits);

						contextNumBits++;
					}

					contextDictionary[contextWc] = contextDictSize++;
					contextW                      = String(contextC);
				}
			}

			if (contextW !== '') {
				process();

				if(contextEnlargeIn === 0) {
					contextNumBits++;
				}
			}

			value = 2;

			for(i = 0 ; i < contextNumBits ; i++) {
				contextDataVal = (contextDataVal << 1) | (value&1);

				subprocess();

				value = value >> 1;
			}

			while(true) { // eslint-disable-line no-constant-condition
				contextDataVal = (contextDataVal << 1);

				if(contextDataPosition === bitsPerChar) {
					contextData.push(getCharFromInt(contextDataVal));

					break;
				} else {
					contextDataPosition++;
				}
			}

			return contextData.join('');
		}

		function decompressUTF16(compressed, length, resetValue) {
			var dictionary = [],
				enlargeIn  = 4,
				dictSize   = 4,
				numBits    = 3,
				entry      = '',
				result     = [],
				data       = { val: getNextValue(compressed, 0), position: resetValue, index: 1 },
				bits       = 0,
				maxpower   = mathPow22,
				power      = 1,
				next, i, w, resb, c;

			function process(maxpower) {
				bits  = 0;
				power = 1;

				while(power !== maxpower) {
					resb = data.val & data.position;

					data.position >>= 1;

					if(data.position === 0) {
						data.position = resetValue;
						data.val      = getNextValue(compressed, data.index++);
					}

					bits |= (resb > 0 ? 1 : 0) * power;
					power <<= 1;
				}
			}

			for(i = 0; i < 3; i++) {
				dictionary[i] = i;
			}

			process(maxpower);

			next = bits;

			switch(next) {
				case 0:
					process(mathPow28);

					c = stringFormCharCode(bits);

					break;
				case 1:
					process(mathPow216);

					c = stringFormCharCode(bits);

					break;
				case 2:
					return '';
			}

			dictionary[3] = c;
			w             = c;

			result.push(c);

			while(true) { // eslint-disable-line no-constant-condition
				if(data.index > length) {
					return '';
				}

				process(Math.pow(2, numBits));

				switch(c = bits) {
					case 0:
						process(mathPow28);

						dictionary[dictSize++] = stringFormCharCode(bits);
						c                      = dictSize - 1;

						enlargeIn--;

						break;
					case 1:
						process(mathPow216);

						dictionary[dictSize++] = stringFormCharCode(bits);
						c                      = dictSize - 1;

						enlargeIn--;

						break;
					case 2:
						return result.join('');
				}

				if(enlargeIn === 0) {
					enlargeIn = Math.pow(2, numBits);

					numBits++;
				}

				if(dictionary[c]) {
					entry = dictionary[c];
				} else {
					if(c === dictSize) {
						entry = w + w.charAt(0);
					} else {
						return null;
					}
				}

				result.push(entry);

				dictionary[dictSize++] = w + entry.charAt(0);

				enlargeIn--;

				w = entry;

				if(enlargeIn === 0) {
					enlargeIn = Math.pow(2, numBits);

					numBits++;
				}

			}
		}

		function getCharFromInt(a) {
			return stringFormCharCode(a + 32);
		}

		function getNextValue(compressed, index) {
			return compressed.charCodeAt(index) - 32;
		}

		function compress(input) {
			return input ? compressUTF16(input, 15) + ' ' : '';
		}

		function decompress(compressed) {
			return compressed ? decompressUTF16(compressed, compressed.length, 16384) : '';
		}

		function isEnabled(path) {
			var i = 0, pointer, match;

			for(; (pointer = pattern[i]); i++) {
				if(path.indexOf(pointer.pattern) === 0 && (!match || pointer.weight > match.weight)) {
					match = pointer;
				}
			}

			return match ? match.state : false;
		}

		demand
			.on('preCache', function(loader) {
				if(enabled || isEnabled(loader.path)) {
					loader.source = compress(loader.source);
				}
			})
			.on('preProcess', function(loader) {
				if(loader.deferred.pledge.cache === 'hit' && (enabled || isEnabled(loader.path))) {
					loader.source = decompress(loader.source);
				}
			});

		return {
			compress:   compress,
			decompress: decompress
		};
	}

	provide([ 'path', '/demand/function/iterate', '/demand/validator/isObject', '/demand/validator/isTypeOf' ], definition);
}());