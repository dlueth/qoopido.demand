/* global url, main, settings */

(function(global, document, type, target, frame, domain, script){
	global.demand = { url: url, main: main, settings: settings };
	target        = document.getElementsByTagName(type)[0];
	frame         = document.createElement('iframe');
	frame.src     = 'javascript:void(0)';
	frame.name    = 'demand-loader';
	frame.title   = '';
	frame.role    = 'presentation';

	(frame.frameElement || frame).style.cssText = 'display:none;width:0;height:0;border:0;';

	target.parentNode.insertBefore(frame, target);

	try {
		frame = frame.contentWindow.document;
	} catch(error) {
		domain    = document.domain;
		frame.src = 'javascript:var d=document.open();d.domain="' + domain + '";void(0);';
		frame     = frame.contentWindow.document;
	}

	frame.open()._ = function() {
		domain && (this.domain = domain);

		script     = this.createElement(type);
		script.src = url;

		this.body.appendChild(script);
	};

	frame.write('<body onload="document._();" />');
	frame.close();
}(this, document, 'script'))