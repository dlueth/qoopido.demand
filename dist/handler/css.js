/**! Qoopido.demand 4.2.4-alpha.1 | https://github.com/dlueth/qoopido.demand | (c) 2017 Dirk Lueth */
!function(e){"use strict";function t(t,r){function n(e){return a.href=e,a}function s(e,t,r){return f.test(t[1])||(e=e.replace(t[0],r)),e}function o(){}var u=".css",c=e.getElementsByTagName("head")[0],a=e.createElement("a"),i=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,d=/@import\s+["'](.+?)["']/gi,l=/^\//i,f=/^data:|http(s?):|\/\//i,m=/^text\/css/;return o.prototype={validate:function(e){return m.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=t.slice(-u.length)!==u?t+u:t},onPostRequest:function(e){for(var t,o=n(e.url+"/.."),u=o.href,c="//"+o.host,a=e.source;t=i.exec(a);)a=s(a,t,'url("'+n(l.test(t[1])?c+t[1]:u+t[1]).href+'")');for(;t=d.exec(a);)a=s(a,t,'@import "'+n(l.test(t[1])?c+t[1]:u+t[1]).href+'"');e.source=r(e.url,a)},process:function(t){var r=e.querySelector('[demand-id="'+t.id+'"]');r||(r=e.createElement("style"),r.type="text/css",r.setAttribute("demand-id",t.id),c.appendChild(r)),"STYLE"===r.tagName&&(r.styleSheet?r.styleSheet.cssText=t.source:r.textContent=t.source),provide(function(){return r})}},new(o.extends(t))}provide(["/demand/abstract/handler","/demand/function/resolveSourcemaps"],t)}(document);
//# sourceMappingURL=css.js.map
