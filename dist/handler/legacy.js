/**! Qoopido.demand 6.1.1 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/failure","/demand/handler/module","/demand/validator/isObject","/demand/function/merge"],(function(e,n,t,o,u){var r={suffix:".js"};function d(){var e,o=this,u=o.dfd,d=r[o.path]&&r[o.path].probe;function i(e){provide((function(){return e}))}t.process(o),d?(e=d(i,(function(){u.reject(new n("error probing",o.path))})))&&i(e):i(!0)}function i(){}return demand.on("postConfigure:"+e,(function(e){o(e)&&u(r,e)})),i.prototype={onPreRequest:function(e,n){var o=r[e.path]&&r[e.path].dependencies;n="undefined"!=typeof n?n:r.suffix,t.onPreRequest(e,n||!1),o&&(e.enqueue=demand.apply(null,o))},onPreProcess:function(e){var n=r[e.path]&&r[e.path].dependencies;n&&"boolean"==typeof e.enqueue&&(e.enqueue=demand.apply(null,n))},process:function(e){var t=d.bind(e);!0===e.enqueue?t():e.enqueue.then(t,(function(){e.dfd.reject(new n("error resolving",e.path,arguments))}))}},new(i.extends(t))}))}();
//# sourceMappingURL=legacy.js.map
