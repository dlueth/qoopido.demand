/**! Qoopido.demand 7.0.3 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/failure","/demand/handler/module","/demand/validator/isObject","/demand/function/merge"],(function(e,n,t,r,o){var u={suffix:".js"};function i(){var e,r=this.dfd,o=u[this.path]&&u[this.path].probe;t.process(this),o&&(e=o())?provide((function(){return e})):o?r.reject(new n("error probing",this.path)):provide((function(){return!0}))}function d(){}return demand.on("postConfigure:"+e,(function(e){r(e)&&o(u,e)})),d.prototype={onPreRequest:function(e,n){var r=u[e.path]&&u[e.path].dependencies;n="undefined"!=typeof n?n:u.suffix,t.onPreRequest(e,n||!1),r&&(e.enqueue=demand.apply(null,r))},onPreProcess:function(e){var n=u[e.path]&&u[e.path].dependencies;n&&"boolean"==typeof e.enqueue&&(e.enqueue=demand.apply(null,n))},process:function(e){var t=i.bind(e);!0===e.enqueue?t():e.enqueue.then(t,(function(){e.dfd.reject(new n("error resolving",e.path,arguments))}))}},new(d.extends(t))}))}();
//# sourceMappingURL=legacy.js.map
