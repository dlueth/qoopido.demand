/**! Qoopido.demand 7.1.8 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(n){"use strict";provide(["path","/demand/function/iterate","/demand/validator/isObject","/demand/validator/isTypeOf"],(function(t,e,o,i){var a,c="Thu, 01 Jan 1970 00:00:00 GMT",r=[];function u(t,e,o){(a||function(n){for(var t,e,o=0;t=r[o];o++)0===n.indexOf(t.pattern)&&(!e||t.weight>e.weight)&&(e=t);return!!e&&e.state}(t.path))&&(n.cookie="demand["+t.type+"]["+t.path+"]="+encodeURIComponent(e)+"; expires="+o+"; path=/")}return demand.on("postConfigure:"+t,(function(n){o(n)?(r.length=0,e(n,(function(n,t){r.push({pattern:n,weight:n.length,state:t})}))):i(n,"boolean")&&(a=n)})).on("cacheMiss",(function(n){u(n,"",c)})).on("cacheClear",(function(n){u(n,"",c)})).on("postCache",(function(n,t){u(n,JSON.stringify(t),"Fri, 31 Dec 9999 23:59:59 GMT")})),!0}))}(document);
//# sourceMappingURL=cookie.js.map
