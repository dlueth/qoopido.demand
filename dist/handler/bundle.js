/*! Qoopido.demand 2.1.4 | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(){"use strict";function e(e,n,t,o,r){return{matchType:t.matchType,onPostRequest:t.onPostRequest,onPreProcess:function(){var c=this,s=c.deferred,u=r[c.path];e(u).then(function(){o.apply(null,arguments),t.process.call(c),demand.apply(null,u).then(s.resolve,function(){s.reject(new n("error resolving",c.path,arguments))})},function(){s.reject(new n("error mocking",null,arguments))})}}}provide(["/demand/mock","/demand/reason","/demand/handler/module","/demand/queue","settings"],e)}();
//# sourceMappingURL=bundle.js.map
