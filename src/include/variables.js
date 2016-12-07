/* global 
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, PROVIDE_ID, PATH_ID,
	functionEscapeRegex, functionResolveUrl
*/

//=require constants.js
//=require function/escapeRegex.js
//=require function/resolveUrl.js

var regexIsAbsoluteUri  = /^(http(s?):)?\/\//i,
	regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,
	regexMatchBaseUrl   = new RegExp('^' + functionEscapeRegex(functionResolveUrl('/'))),
	regexMatchInternal  = new RegExp('^' + DEMAND_ID + '|' + PROVIDE_ID + '|' + PATH_ID + '$'),
	regexMatchParameter = /^([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/;