/**! Qoopido.demand 7.0.7 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/abstract/handler","/demand/task","/demand/pledge","/demand/failure","/demand/validator/isObject","/demand/function/merge"],(function(n,e,t,a,o,d,i){var r=/^application\/json/,u={suffix:".json"},c=new t((function(n,e,t){try{n(JSON.parse(t))}catch(n){e(n)}}));function s(){}return demand.on("postConfigure:"+n,(function(n){d(n)&&i(u,n)})),s.prototype={validate:function(n){return r.test(n)},onPreRequest:function(n,e){var t;(e="undefined"!=typeof e?e:u.suffix)&&(t=n.url.pathname,n.url.pathname=t.slice(-e.length)!==e?t+e:t)},process:function(n){provide(c(n.source))}},new(s.extends(e))}))}();
//# sourceMappingURL=json.js.map
