/**! Qoopido.demand 4.1.5 | https://github.com/dlueth/qoopido.demand | (c) 2017 Dirk Lueth */
!function(e){"use strict";function t(t,r){function n(e){return c.href=e,c}function s(e,t,r){return l.test(t[1])||(e=e.replace(t[0],r)),e}function o(){}var u=e.getElementsByTagName("head")[0],c=e.createElement("a"),i=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,a=/@import\s+["'](.+?)["']/gi,d=/^\//i,l=/^data:|http(s?):|\/\//i,f=/^text\/css/;return o.prototype={validate:function(e){return f.test(e)},onPreRequest:function(e){var t=e.url;e.url=".css"!==t.slice(-4)?t+".css":t},onPostRequest:function(e){for(var t,o=n(e.url+"/.."),u=o.href,c="//"+o.host,l=e.source;t=i.exec(l);)l=s(l,t,'url("'+n(d.test(t[1])?c+t[1]:u+t[1]).href+'")');for(;t=a.exec(l);)l=s(l,t,'@import "'+n(d.test(t[1])?c+t[1]:u+t[1]).href+'"');e.source=r(e.url,l)},process:function(t){var r=e.querySelector('[demand-id="'+t.id+'"]');r||(r=e.createElement("style"),r.type="text/css",r.setAttribute("demand-id",t.id),u.appendChild(r)),"STYLE"===r.tagName&&(r.styleSheet?r.styleSheet.cssText=t.source:r.textContent=t.source),provide(function(){return r})}},new(o.extends(t))}provide(["/demand/abstract/handler","/demand/function/resolveSourcemaps"],t)}(document);
//# sourceMappingURL=css.js.map
