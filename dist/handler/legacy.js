/*! Qoopido.demand 3.5.7 | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(){"use strict";function e(e,n,t,r){function d(e){i=r(e)?e:{}}function o(){var e,r,d=this,o=i[d.path]&&i[d.path].probe;t.process.call(d),o&&(e=d.deferred,e.pledge.isPending()&&((r=o())?provide(function(){return r}):e.reject(new n("error probing",d.path))))}var i;return demand.on("postConfigure:"+e,d),{matchType:t.matchType,onPreRequest:function(){var e=this,r=e.deferred,d=i[e.path]&&i[e.path].dependencies;d&&(e.dependencies=d=demand.apply(null,d).catch(function(){r.reject(new n("error resolving",e.path,arguments))})),d&&e.mock&&(e.mock.dependencies=d),t.onPreRequest.call(this)},onPostRequest:t.onPostRequest,process:function(){var e=this,n=o.bind(e);e.dependencies?e.dependencies.then(n,e.deferred.reject):n()}}}provide(["path","/demand/failure","/demand/handler/module","/demand/validator/isObject"],e)}();
//# sourceMappingURL=legacy.js.map
