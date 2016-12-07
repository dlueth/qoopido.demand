/* global 
	global, document, demand, provide, queue, processor, settings,
	DEMAND_ID, PROVIDE_ID, PATH_ID,
	functionEscapeRegex, functionResolveUrl
*/

var regexIsAbsoluteUri  = /^(http(s?):)?\/\//i,
	regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,
	regexMatchBaseUrl   = new RegExp('^' + functionEscapeRegex(functionResolveUrl('/'))),
	regexMatchInternal  = new RegExp('^' + DEMAND_ID + '|' + PROVIDE_ID + '|' + PATH_ID + '$'),
	regexMatchParameter = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/;