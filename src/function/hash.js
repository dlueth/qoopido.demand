/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

/**
 * hash
 *
 * Generate a hash for a given string
 *
 * @param {string} input
 *
 * @return {number}
 */
function functionHash(input){
	var value = 5381,
		i     = input.length;

	while(i) {
		value = (value * 33) ^ input.charCodeAt(--i);
	}

	return value >>> 0;
}
