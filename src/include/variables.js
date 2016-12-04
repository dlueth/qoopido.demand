/* functions */
	//=require function/escapeRegularExpression.js
	//=require function/resolveUrl.js
	/* global escapeRegularExpression, resolveUrl */

var regexIsAbsoluteUri  = /^(http(s?):)?\/\//i,
	regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,
	regexMatchBaseUrl   = new RegExp('^' + escapeRegularExpression(resolveUrl('/')));