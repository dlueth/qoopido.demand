/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, PROVIDE_ID, PATH_ID,
	functionEscapeRegex, functionResolveUrl
*/

//=require constants.js
//=require function/escapeRegex.js
//=require function/resolveUrl.js

var regexIsAbsoluteUri      = /^(http(s?):)?\/\//i,
	regexIsAbsolutePath     = /^\//,
	regexMatchSourcemap     = /((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,
	regexMatchBaseUrl       = new RegExp('^' + functionEscapeRegex(functionResolveUrl('/'))),
	regexMatchInternal      = new RegExp('^' + DEMAND_ID + '|' + PROVIDE_ID + '|' + PATH_ID + '$'),
	regexMatchParameter     = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/,
	regexMatchSemver        = /^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i;
