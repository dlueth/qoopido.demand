/**
 * Qoopido.demand plugin/lzstring
 *
 * Based on lz-string:
 *   Repo:    https://github.com/pieroxy/lz-string
 *   License: https://github.com/pieroxy/lz-string/blob/master/LICENSE.txt
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function() {
	'use strict';

	function definition(path, isObject, isTypeOf) {
		var stringFormCharCode            = String.fromCharCode,
			objectPrototypeHasOwnProperty = Object.prototype.hasOwnProperty,
			mathPow22                     = Math.pow(2, 2),
			mathPow28                     = Math.pow(2, 8),
			mathPow216                    = Math.pow(2, 16),
			pattern                       = [ { pattern: path, weight: path.length, state: false }],
			enabled, key;
		
		function onPostConfigure(options) {
			if(isObject(options)) {
				pattern.length = 0;
				
				for(key in options) {
					pattern.push({ pattern: key, weight: key.length, state: options[key] });
				}
			} else if(isTypeOf(options, 'boolean')) {
				enabled = options;
			}
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);

		function compressUTF16(uncompressed, bitsPerChar) {
			var context_dictionary         = {},
				context_dictionaryToCreate = {},
				context_c                  = '',
				context_wc                 = '',
				context_w                  = '',
				context_enlargeIn          = 2,
				context_dictSize           = 3,
				context_numBits            = 2,
				context_data               = [],
				context_data_val           = 0,
				context_data_position      = 0,
				ii = 0, i, value;

			bitsPerChar -= 1;

			for(; uncompressed[ii]; ii++) {
				context_c = uncompressed.charAt(ii);

				if(!objectPrototypeHasOwnProperty.call(context_dictionary, context_c)) {
					context_dictionary[context_c]         = context_dictSize++;
					context_dictionaryToCreate[context_c] = true;
				}

				context_wc = context_w + context_c;

				if(objectPrototypeHasOwnProperty.call(context_dictionary, context_wc)) {
					context_w = context_wc;
				} else {
					if(objectPrototypeHasOwnProperty.call(context_dictionaryToCreate, context_w)) {
						if(context_w.charCodeAt(0) < 256) {
							for(i = 0 ; i < context_numBits ; i++) {
								context_data_val = (context_data_val << 1);

								if(context_data_position === bitsPerChar) {
									context_data.push(getCharFromInt(context_data_val));

									context_data_position = 0;
									context_data_val      = 0;
								} else {
									context_data_position++;
								}
							}

							value = context_w.charCodeAt(0);

							for(i = 0 ; i < 8 ; i++) {
								context_data_val = (context_data_val << 1) | (value&1);

								if(context_data_position === bitsPerChar) {
									context_data.push(getCharFromInt(context_data_val));

									context_data_position = 0;
									context_data_val      = 0;
								} else {
									context_data_position++;
								}

								value = value >> 1;
							}
						} else {
							value = 1;

							for(i = 0 ; i < context_numBits ; i++) {
								context_data_val = (context_data_val << 1) | value;

								if(context_data_position === bitsPerChar) {
									context_data.push(getCharFromInt(context_data_val));

									context_data_position = 0;
									context_data_val      = 0;
								} else {
									context_data_position++;
								}

								value = 0;
							}

							value = context_w.charCodeAt(0);

							for(i = 0 ; i < 16 ; i++) {
								context_data_val = (context_data_val << 1) | (value&1);

								if(context_data_position === bitsPerChar) {
									context_data.push(getCharFromInt(context_data_val));

									context_data_position = 0;
									context_data_val      = 0;
								} else {
									context_data_position++;
								}

								value = value >> 1;
							}
						}

						context_enlargeIn--;

						if(context_enlargeIn === 0) {
							context_enlargeIn = Math.pow(2, context_numBits);

							context_numBits++;
						}

						delete context_dictionaryToCreate[context_w];
					} else {
						value = context_dictionary[context_w];

						for(i = 0 ; i < context_numBits ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);

							if(context_data_position === bitsPerChar) {
								context_data.push(getCharFromInt(context_data_val));

								context_data_position = 0;
								context_data_val      = 0;
							} else {
								context_data_position++;
							}

							value = value >> 1;
						}
					}

					context_enlargeIn--;

					if(context_enlargeIn === 0) {
						context_enlargeIn = Math.pow(2, context_numBits);

						context_numBits++;
					}

					context_dictionary[context_wc] = context_dictSize++;
					context_w                      = String(context_c);
				}
			}

			if (context_w !== '') {
				if(objectPrototypeHasOwnProperty.call(context_dictionaryToCreate, context_w)) {
					if(context_w.charCodeAt(0) < 256) {
						for(i = 0 ; i < context_numBits ; i++) {
							context_data_val = (context_data_val << 1);

							if(context_data_position === bitsPerChar) {
								context_data.push(getCharFromInt(context_data_val));

								context_data_position = 0;
								context_data_val      = 0;
							} else {
								context_data_position++;
							}
						}

						value = context_w.charCodeAt(0);

						for(i = 0 ; i < 8 ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);

							if(context_data_position === bitsPerChar) {
								context_data.push(getCharFromInt(context_data_val));

								context_data_position = 0;
								context_data_val      = 0;
							} else {
								context_data_position++;
							}

							value = value >> 1;
						}
					} else {
						value = 1;

						for(i = 0 ; i < context_numBits ; i++) {
							context_data_val = (context_data_val << 1) | value;

							if(context_data_position === bitsPerChar) {
								context_data.push(getCharFromInt(context_data_val));

								context_data_position = 0;
								context_data_val      = 0;
							} else {
								context_data_position++;
							}

							value = 0;
						}

						value = context_w.charCodeAt(0);

						for(i = 0 ; i < 16 ; i++) {
							context_data_val = (context_data_val << 1) | (value&1);

							if(context_data_position === bitsPerChar) {
								context_data.push(getCharFromInt(context_data_val));

								context_data_position = 0;
								context_data_val      = 0;
							} else {
								context_data_position++;
							}

							value = value >> 1;
						}
					}

					context_enlargeIn--;

					if(context_enlargeIn === 0) {
						context_enlargeIn = Math.pow(2, context_numBits);

						context_numBits++;
					}

					delete context_dictionaryToCreate[context_w];
				} else {
					value = context_dictionary[context_w];

					for(i = 0 ; i < context_numBits ; i++) {
						context_data_val = (context_data_val << 1) | (value&1);

						if(context_data_position === bitsPerChar) {
							context_data.push(getCharFromInt(context_data_val));

							context_data_position = 0;
							context_data_val      = 0;
						} else {
							context_data_position++;
						}

						value = value >> 1;
					}
				}

				context_enlargeIn--;

				if(context_enlargeIn === 0) {
					context_numBits++;
				}
			}

			value = 2;

			for(i = 0 ; i < context_numBits ; i++) {
				context_data_val = (context_data_val << 1) | (value&1);

				if(context_data_position === bitsPerChar) {
					context_data.push(getCharFromInt(context_data_val));

					context_data_position = 0;
					context_data_val      = 0;
				} else {
					context_data_position++;
				}

				value = value >> 1;
			}

			while(true) { // eslint-disable-line no-constant-condition
				context_data_val = (context_data_val << 1);

				if(context_data_position === bitsPerChar) {
					context_data.push(getCharFromInt(context_data_val));

					break;
				} else {
					context_data_position++;
				}
			}

			return context_data.join('');
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

			for(i = 0; i < 3; i++) {
				dictionary[i] = i;
			}

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

			next = bits;

			switch(next) {
				case 0:
					bits     = 0;
					maxpower = mathPow28;
					power    = 1;

					while(power !== maxpower) {
						resb = data.val & data.position;

						data.position >>= 1;

						if(data.position === 0) {
							data.position = resetValue;
							data.val      = getNextValue(compressed, data.index++);
						}

						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					}

					c = stringFormCharCode(bits);

					break;
				case 1:
					bits     = 0;
					maxpower = mathPow216;
					power    = 1;

					while(power !== maxpower) {
						resb = data.val & data.position;

						data.position >>= 1;

						if(data.position === 0) {
							data.position = resetValue;
							data.val      = getNextValue(compressed, data.index++);
						}

						bits |= (resb>0 ? 1 : 0) * power;
						power <<= 1;
					}

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

				bits     = 0;
				maxpower = Math.pow(2, numBits);
				power    = 1;

				while(power !== maxpower) {
					resb = data.val & data.position;

					data.position >>= 1;

					if(data.position === 0) {
						data.position = resetValue;
						data.val      = getNextValue(compressed, data.index++);
					}

					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}

				switch(c = bits) {
					case 0:
						bits     = 0;
						maxpower = mathPow28;
						power    = 1;

						while(power !== maxpower) {
							resb = data.val & data.position;

							data.position >>= 1;

							if(data.position === 0) {
								data.position = resetValue;
								data.val      = getNextValue(compressed, data.index++);
							}

							bits |= (resb>0 ? 1 : 0) * power;
							power <<= 1;
						}

						dictionary[dictSize++] = stringFormCharCode(bits);
						c                      = dictSize - 1;

						enlargeIn--;

						break;
					case 1:
						bits     = 0;
						maxpower = mathPow216;
						power    = 1;

						while(power !== maxpower) {
							resb = data.val & data.position;

							data.position >>= 1;

							if(data.position === 0) {
								data.position = resetValue;
								data.val      = getNextValue(compressed, data.index++);
							}

							bits |= (resb>0 ? 1 : 0) * power;

							power <<= 1;
						}

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

	provide([ 'path', '/demand/validator/isObject', '/demand/validator/isTypeOf' ], definition);
}());