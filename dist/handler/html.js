/**! Qoopido.demand 8.0.2 | https://github.com/dlueth/qoopido.demand | (c) 2021 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/abstract/handler","/demand/validator/isObject","/demand/function/merge"],(function(e,n,t,r){var o=/^text\/html/,u=document.createElement("body"),i={suffix:".html"};function a(){}return demand.on("postConfigure:"+e,(function(e){t(e)&&r(i,e)})),a.prototype={validate:function(e){return o.test(e)},onPreRequest:function(e,n){var t;(n="undefined"!=typeof n?n:i.suffix)&&(t=e.url.pathname,e.url.pathname=t.slice(-n.length)!==n?t+n:t)},process:function(e){provide((function(){return function(e){var n,t=document.createDocumentFragment();for(u.innerHTML=e;n=u.firstElementChild;)t.appendChild(n);return t}(e.source)}))}},new(a.extends(n))}))}();
//# sourceMappingURL=html.js.map
