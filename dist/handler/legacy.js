/**! Qoopido.demand 7.2.1 | https://github.com/dlueth/qoopido.demand | (c) 2021 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/failure","/demand/pledge","/demand/handler/module","/demand/validator/isObject","/demand/function/merge","/demand/function/onAnimationFrame"],(function(e,n,t,o,r,u,d){var i={suffix:".js"};function a(){var e,t=this,r=t.dfd,u=i[t.path]&&i[t.path].probe;o.process(t),u&&(e=u())?provide((function(){return e})):u?r.reject(new n("error probing",t.path)):provide((function(){return!0}))}function p(){}return demand.on("postConfigure:"+e,(function(e){r(e)&&u(i,e)})),p.prototype={onPreRequest:function(e,n){var t=i[e.path]&&i[e.path].dependencies;n="undefined"!=typeof n?n:i.suffix,o.onPreRequest(e,n||!1),t&&(e.enqueue=demand.apply(null,t).then)},onPreProcess:function(e){var n=i[e.path]&&i[e.path].dependencies;n&&"boolean"==typeof e.enqueue&&(e.enqueue=demand.apply(null,n).then((function(){return new t(d)})))},process:function(e){var t=a.bind(e);!0===e.enqueue?t():e.enqueue.then(t,(function(){e.dfd.reject(new n("error resolving",e.path,arguments))}))}},new(p.extends(o))}))}();
//# sourceMappingURL=legacy.js.map
