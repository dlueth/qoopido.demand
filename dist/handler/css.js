/**! Qoopido.demand 8.0.2 | https://github.com/dlueth/qoopido.demand | (c) 2021 Dirk Lueth */
!function(e){"use strict";provide(["path","/demand/pledge","/demand/abstract/handler","/demand/function/resolveSourcemaps","/demand/validator/isObject","/demand/function/merge","/demand/function/onAnimationFrame"],(function(t,n,r,o,s,u,a){var i=e.getElementsByTagName("head")[0],c=e.createElement("a"),d=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,f=/@import\s+["'](.+?)["']/gi,m=/^\//i,l=/^data:|http(s?):|\/\//i,p=/^text\/css/,h={suffix:".css"};function g(e){return c.href=e,c}function v(e,t,n){return l.test(t[1])||(e=e.replace(t[0],n)),e}function x(){}return demand.on("postConfigure:"+t,(function(e){s(e)&&u(h,e)})),x.prototype={validate:function(e){return p.test(e)},onPreRequest:function(e,t){var n;(t="undefined"!=typeof t?t:h.suffix)&&(n=e.url.pathname,e.url.pathname=n.slice(-t.length)!==t?n+t:n)},onPostRequest:function(e){for(var t,n=g(e.url+"/.."),r=n.href,s="//"+n.host,u=e.source;t=d.exec(u);)u=v(u,t,'url("'+g(m.test(t[1])?s+t[1]:r+t[1]).href+'")');for(;t=f.exec(u);)u=v(u,t,'@import "'+g(m.test(t[1])?s+t[1]:r+t[1]).href+'"');e.source=o(e.url,u)},onPreProcess:function(e){e.enqueue=new n(a)},process:function(t){var n=e.querySelector('[demand-id="'+t.id+'"]');n||((n=e.createElement("style")).type="text/css",n.setAttribute("demand-id",t.id),i.appendChild(n)),"STYLE"===n.tagName&&(n.styleSheet?n.styleSheet.cssText=t.source:n.textContent=t.source),provide((function(){return n}))}},new(x.extends(r))}))}(document);
//# sourceMappingURL=css.js.map
