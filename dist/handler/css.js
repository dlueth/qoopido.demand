/**! Qoopido.demand 5.2.9 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(e){"use strict";provide(["path","/demand/abstract/handler","/demand/function/resolveSourcemaps","/demand/validator/isObject","/demand/function/merge"],(function(t,n,r,s,o){var u=e.getElementsByTagName("head")[0],a=e.createElement("a"),i=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,c=/@import\s+["'](.+?)["']/gi,d=/^\//i,f=/^data:|http(s?):|\/\//i,l=/^text\/css/,m={suffix:".css"};function p(e){return a.href=e,a}function h(e,t,n){return f.test(t[1])||(e=e.replace(t[0],n)),e}function v(){}return demand.on("postConfigure:"+t,(function(e){s(e)&&o(m,e)})),v.prototype={validate:function(e){return l.test(e)},onPreRequest:function(e,t){var n;(t="undefined"!=typeof t?t:m.suffix)&&(n=e.url.pathname,e.url.pathname=n.slice(-t.length)!==t?n+t:n)},onPostRequest:function(e){for(var t,n=p(e.url+"/.."),s=n.href,o="//"+n.host,u=e.source;t=i.exec(u);)u=h(u,t,'url("'+p(d.test(t[1])?o+t[1]:s+t[1]).href+'")');for(;t=c.exec(u);)u=h(u,t,'@import "'+p(d.test(t[1])?o+t[1]:s+t[1]).href+'"');e.source=r(e.url,u)},process:function(t){var n=e.querySelector('[demand-id="'+t.id+'"]');n||((n=e.createElement("style")).type="text/css",n.setAttribute("demand-id",t.id),u.appendChild(n)),"STYLE"===n.tagName&&(n.styleSheet?n.styleSheet.cssText=t.source:n.textContent=t.source),provide((function(){return n}))}},new(v.extends(n))}))}(document);
//# sourceMappingURL=css.js.map
