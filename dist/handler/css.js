/**! Qoopido.demand 5.1.0 | https://github.com/dlueth/qoopido.demand | (c) 2018 Dirk Lueth */
!function(m){"use strict";provide(["/demand/abstract/handler","/demand/function/resolveSourcemaps"],function(e,u){function c(e){return s.href=e,s}function a(e,t,r){return o.test(t[1])||(e=e.replace(t[0],r)),e}function t(){}var r=".css",n=m.getElementsByTagName("head")[0],s=m.createElement("a"),i=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,d=/@import\s+["'](.+?)["']/gi,l=/^\//i,o=/^data:|http(s?):|\/\//i,f=/^text\/css/;return t.prototype={validate:function(e){return f.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=t.slice(-r.length)!==r?t+r:t},onPostRequest:function(e){for(var t,r=c(e.url+"/.."),n=r.href,s="//"+r.host,o=e.source;t=i.exec(o);)o=a(o,t,'url("'+c(l.test(t[1])?s+t[1]:n+t[1]).href+'")');for(;t=d.exec(o);)o=a(o,t,'@import "'+c(l.test(t[1])?s+t[1]:n+t[1]).href+'"');e.source=u(e.url,o)},process:function(e){var t=m.querySelector('[demand-id="'+e.id+'"]');t||((t=m.createElement("style")).type="text/css",t.setAttribute("demand-id",e.id),n.appendChild(t)),"STYLE"===t.tagName&&(t.styleSheet?t.styleSheet.cssText=e.source:t.textContent=e.source),provide(function(){return t})}},new(t.extends(e))})}(document);
//# sourceMappingURL=css.js.map
