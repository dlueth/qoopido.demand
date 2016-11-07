var Uuid = (function() {
	var objectDefineProperty = Object.defineProperty,
		regex                = new RegExp('[xy]', 'g'),
		storage              = {};
	
	function randomize(character) {
		var r = Math.random() * 16 | 0;
		
		return ((character === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
	}
	
	function Uuid() {}
	
	Uuid.prototype = {
		generate: function() {
			var result;
			
			do {
				result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, randomize);
			} while(storage[result]);
			
			storage[result] = 1;
			
			return result;
		},
		set: function(target) {
			if(typeof target.uuid === 'undefined') {
				objectDefineProperty(target, 'uuid', {
					__proto__:    NULL,
					value:        this.generate(),
					enumerable:   false,
					configurable: false,
					writable:     false
				});
			}
			
			return target.uuid;
		}
	};
	
	return new Uuid();
}());