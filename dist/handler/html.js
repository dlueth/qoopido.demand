/**! Qoopido.demand 4.2.5 | https://github.com/dlueth/qoopido.demand | (c) 2018 Dirk Lueth */
!function(){"use strict";function e(e){function t(e){var t,n=document.createDocumentFragment();for(u.innerHTML=e;t=u.firstElementChild;)n.appendChild(t);return n}function n(){}var r=".html",o=/^text\/html/,u=document.createElement("body");return n.prototype={validate:function(e){return o.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=t.slice(-r.length)!==r?t+r:t},process:function(e){provide(function(){return t(e.source)})}},new(n.extends(e))}provide(["/demand/abstract/handler"],e)}();
//# sourceMappingURL=html.js.map
