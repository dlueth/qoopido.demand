/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
*/

var ClassLogger = (function() {
	var level   = [ 'info', 'warning',  'error' ],
		mapping = {
			warning: 'warn'
		};

	function process(level, prefix, message, color) {
		typeof console !== 'undefined' && console[mapping[level] || level]('%c' + prefix + '%c' + message.toString(), 'display:inline-block;padding:0.5em;line-height:1;font-weight:bold;color:#fff;background-color:' + color + ';border-radius:3px;', 'display:inline-block;padding:0.5em;line-height:1;color:#666');
	}

	return function(prefix, colors) {
		var self = this;

		colors  = {
			info:    (colors && colors.info)    || '#95ba00',
			warning: (colors && colors.warning) || '#f49d0c',
			error:   (colors && colors.error)   || '#af0032',
		}

		level.forEach(function(level) {
			self[level] = function(message) {
				process(level, prefix, message, colors[level]);
			}
		});
	}
}());
