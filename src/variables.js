/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, PROVIDE_ID, PATH_ID, EXPORTS_ID,
	functionResolveUrl
*/

//=require constants.js
//=require function/resolveUrl.js

var regexIsAbsoluteUri      = /^(http(s?):)?\/\//i,
	regexIsRelativePath     = /^\.?\.\//,
	regexMatchSourcemap     = /((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,
	regexMatchLeadingSlash  = /^\//,
	regexMatchBaseUrl       = new RegExp('^' + functionResolveUrl('/')),
	regexMatchInternal      = new RegExp('^' + DEMAND_ID + '|' + PROVIDE_ID + '|' + PATH_ID + '|' + EXPORTS_ID + '$'),
	regexMatchParameter     = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;
