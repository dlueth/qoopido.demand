/**! Qoopido.demand 5.3.1 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/abstract/handler","/demand/validator/isObject","/demand/function/merge"],(function(n,e,t,r){var o=/^text\/.+/,u={};function i(){}return demand.on("postConfigure:"+n,(function(n){t(n)&&r(u,n)})),i.prototype={validate:function(n){return o.test(n)},onPreRequest:function(n,e){var t;(e="undefined"!=typeof e?e:u.suffix)&&(t=n.url.pathname,n.url.pathname=t.slice(-e.length)!==e?t+e:t)},process:function(n){provide((function(){return n.source}))}},new(i.extends(e))}))}();
//# sourceMappingURL=text.js.map
