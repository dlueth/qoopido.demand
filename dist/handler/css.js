/*! Qoopido.demand 1.1.1 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e,t){"use strict";function s(s){return{onPreRequest:function(){var e=this,t=e.url;e.url=".css"!==t.slice(-4)?t+".css":t},onPostRequest:function(){for(var e,t=this,n=s(t.url+"/.."),u=t.source;e=r.exec(u);)u=u.replace(e[0],"url("+s(n+e[1])+")");t.source=u},onPostProcess:function(){var s=this,r=e.createElement("style"),u=s.source;r.type="text/css",r.media="only x",r.styleSheet?r.styleSheet.cssText=u:r.innerHTML=u,r.setAttribute("demand-type",s.type),r.setAttribute("demand-path",s.path),n.appendChild(r),t(function(){provide(function(){return r})})}}}var n=e.getElementsByTagName("head")[0],r=/url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g;provide(s).when("/demand/function/resolve/url")}(document,setTimeout);
//# sourceMappingURL=../handler/css.js.map