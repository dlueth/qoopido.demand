/*! Qoopido.demand 2.0.9 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e){"use strict";function n(n,t,r){function d(){var d,o,s=this,i=r[s.path]&&r[s.path].probe;t.process.call(s),i&&e(function(){d=s.deferred,"pending"===d.pledge.state&&((o=i())?provide(function(){return o}):d.reject(new n("error probing",s.path)))})}return{matchType:t.matchType,onPreRequest:function(){var e=this,d=e.deferred,o=r[e.path]&&r[e.path].dependencies;o&&(e.dependencies=o=demand.apply(null,o).then(null,function(){d.reject(new n("error resolving",e.path,arguments))})),o&&e.mock&&(e.mock.dependencies=o),t.onPreRequest.call(this)},onPostRequest:t.onPostRequest,process:function(){var e=this,n=d.bind(e);e.dependencies?e.dependencies.then(n,e.deferred.reject):n()}}}provide(["/demand/reason","/demand/handler/module","settings"],n)}(setTimeout);
//# sourceMappingURL=legacy.js.map
