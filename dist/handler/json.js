/**! Qoopido.demand 6.0.0 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(){"use strict";provide(["path","/demand/abstract/handler","/demand/task","/demand/failure","/demand/validator/isObject","/demand/function/merge"],(function(n,e,t,r,a,o){var i=/^application\/json/,u={suffix:".json"},c=new t((function(n,e,t){try{n(JSON.parse(t))}catch(n){e(n)}}));function d(){}return demand.on("postConfigure:"+n,(function(n){a(n)&&o(u,n)})),d.prototype={validate:function(n){return i.test(n)},onPreRequest:function(n,e){var t;(e="undefined"!=typeof e?e:u.suffix)&&(t=n.url.pathname,n.url.pathname=t.slice(-e.length)!==e?t+e:t)},process:function(n){c(n.source).then((function(n){provide((function(){return n}))})).catch((function(){n.dfd.reject(new r("error parsing",n.path))}))}},new(d.extends(e))}))}();
//# sourceMappingURL=json.js.map
