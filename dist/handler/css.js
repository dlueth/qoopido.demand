/*! Qoopido.demand 2.0.9 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e,t){"use strict";function s(e){return c.href=e,c}function r(){return{matchType:/^text\/css/,onPreRequest:function(){var e=this,t=e.url;e.url=".css"!==t.slice(-4)?t+".css":t},onPostRequest:function(){for(var e,t=this,r=s(t.url+"/.."),n=r.href,c="//"+r.host,h=t.source;e=o.exec(h);)a.test(e[1])||(h=h.replace(e[0],'url("'+s(i.test(e[1])?c+e[1]:n+e[1]).href+'")'));for(;e=u.exec(h);)a.test(e[1])||(h=h.replace(e[0],'@import "'+s(i.test(e[1])?c+e[1]:n+e[1]).href+'"'));t.source=h},process:function(){var s=this,r=e.createElement("style"),c=s.source;r.type="text/css",r.styleSheet?r.styleSheet.cssText=c:r.textContent=c,r.setAttribute("demand-path",s.path),n.appendChild(r),t(function(){provide(function(){return r})})}}}var n=e.getElementsByTagName("head")[0],c=e.createElement("a"),o=/url\s*\(\s*["']?(.+?)["']?\s*\)/gi,u=/@import\s+["'](.+?)["']/gi,i=/^\//i,a=/^data:|http(s?):|\/\//i;provide(r)}(document,setTimeout);
//# sourceMappingURL=css.js.map
