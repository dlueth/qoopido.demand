/*! Qoopido.demand 3.5.0 | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(t){"use strict";function e(e,n,a){function i(t){if(n(t)){s.length=0;for(d in t)s.push({pattern:d,weight:d.length,state:t[d]})}else a(t,"boolean")&&(c=t)}function o(e,n,a){t.cookie="demand["+e+"]="+encodeURIComponent(n)+"; expires="+a+"; path=/"}function r(t){for(var e,n,a=0;e=s[a];a++)0===t.indexOf(e.pattern)&&(!n||e.weight>n.weight)&&(n=e);return n?n.state:!1}var c,d,s=[];return demand.on("postConfigure:"+e,i),demand.on("cacheMiss cacheClear",function(t){t="string"==typeof t?t:t.path,(c||r(t))&&o(t,"","Thu, 01 Jan 1970 00:00:00 GMT")}).on("postCache",function(t){(c||r(t.path))&&o(t.path,JSON.stringify(t.state),"Fri, 31 Dec 9999 23:59:59 GMT")}),!0}provide(["path","/demand/validator/isObject","/demand/validator/isTypeOf"],e)}(document);
//# sourceMappingURL=cookie.js.map
