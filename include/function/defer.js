var defer = (function() {
	var hasSetImmediate = 'setImmediate' in global,
		element, fallback;
	
	if('MutationObserver' in global) {
		return function defer(fn) {
			element = document.createElement('div');
			
			new MutationObserver(function() { fn(); })
				.observe(element, { attributes: true });
			
			element.setAttribute('i', '1');
		};
	}
	
	if(!hasSetImmediate && 'postMessage' in global && 'addEventListener' in global) {
		return (function() {
			var prefix  = 'com.async',
				regex   = new RegExp('^com\\.async\\[([a-f0-9]{8,8}-[a-f0-9]{4,4}-4[a-f0-9]{3,3}-[a-f0-9]{4,4}-[a-f0-9]{12,12})\\]$', 'g'),
				storage = {},
				matches;
			
			function onMessage(event) {
				if(event.source === global && (matches = regex.exec(event.data))) {
					storage[matches[1]]();
					
					delete storage[matches[1]];
				}
			}
			
			global.addEventListener('message', onMessage, false);
			
			return function defer(fn) {
				var uuid = Uuid.generate();
				
				storage[uuid] = fn;
				
				global.postMessage(prefix + '[' + uuid + ']', '*');
			}
		}());
	}
	
	if(!hasSetImmediate && 'onreadystatechange' in (element = document.createElement('script'))) {
		return function defer(fn) {
			element.onreadystatechange = function onreadystatechange() {
				element.onreadystatechange = NULL;
				element.parentNode.removeChild(element);
				
				fn();
			};
			
			document.body.appendChild(element);
		};
	}
	
	fallback = hasSetImmediate ? setImmediate : setTimeout;
	
	return function defer(fn) {
		fallback(fn);
	}
}());