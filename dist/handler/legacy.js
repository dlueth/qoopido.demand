/**! Qoopido.demand 7.1.0 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/failure","/demand/handler/module","/demand/validator/isObject","/demand/function/merge"],(function(e,n,t,r,o){var u={suffix:".js"};function d(){var e,r=this,o=r.dfd,d=u[r.path]&&u[r.path].probe;t.process(r),d&&(e=d())?provide((function(){return e})):d?o.reject(new n("error probing",r.path)):provide((function(){return!0}))}function i(){}return demand.on("postConfigure:"+e,(function(e){r(e)&&o(u,e)})),i.prototype={onPreRequest:function(e,n){var r=u[e.path]&&u[e.path].dependencies;n="undefined"!=typeof n?n:u.suffix,t.onPreRequest(e,n||!1),r&&(e.enqueue=demand.apply(null,r))},onPreProcess:function(e){var n=u[e.path]&&u[e.path].dependencies;n&&"boolean"==typeof e.enqueue&&(e.enqueue=demand.apply(null,n))},process:function(e){var t=d.bind(e);!0===e.enqueue?t():e.enqueue.then(t,(function(){e.dfd.reject(new n("error resolving",e.path,arguments))}))}},new(i.extends(t))}))}();
//# sourceMappingURL=legacy.js.map
