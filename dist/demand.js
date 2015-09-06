/*! Qoopido.demand 1.0.0, 2015-09-06 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e){"use strict";function t(){var e=this||{},t=p(e,w)?e:null,n=J.call(arguments);return n.forEach(function(e,n){var r=S.path(e,t),a=r.handler,u=r.path,l=ce[a]||(ce[a]={});this[n]=l[u]||(l[u]=new x(e,t).pledge)},n),m.all(n)}function n(){var e,t,n=f(arguments[0],Q)&&arguments[0]||null,r=n?arguments[1]:arguments[0];if(!n&&E.current&&(e=E.current,n=e.handler+"!"+e.path),!n)throw new g("unspecified anonymous provide");return H(function(){var a,u,o,i=S.path(n),c=ce[i.handler];!e&&c[i.path]?l("duplicate found for module "+i.path):(a=new w(n,r,t||[]),u=ce[a.handler][a.path]=a.pledge,e&&(!e.cached&&e.store(),o=e.defered,u.then(function(){o.resolve.apply(null,arguments)},function(){o.reject(new g("unable to resolve module",n,arguments))}),E.length>0&&E.next()))}),{when:function(){t=J.call(arguments)}}}function r(e){var t,n=e.cache,r=e.debug,a=e.version,u=e.timeout,l=e.lifetime,o=e.base,i=e.pattern,c=e.probes;if(M=f(n,z)?n:M,O=f(r,z)?r:O,P=f(a,Q)?a:P,h(u)&&(A=1e3*Math.min(Math.max(u,2),10),D=Math.min(Math.max(A/5,1e3),5e3)),h(l)&&(R=1e3*l),f(o,Q)&&(q=se.base=new v(_,S.url(o))),d(i))for(t in i)"base"!==t&&(se[t]=new v(t,i[t]));if(d(c))for(t in c)pe[t]=c[t];return!0}function a(e,t,n){fe[e]||(fe[e]={suffix:t,resolve:n.resolve,modify:n.modify},ce[e]={})}function u(e,t){n(e,function(){return t})}function l(e){var t=p(e,g)?"error":"warn";f(console,G)||!O&&"warn"===t||console[t](e.toString())}function o(e,t){return new RegExp(e,t)}function i(e){return e.replace(ne,"\\$&")}function c(e){return e.replace(ae,"")}function s(e){return ee.test(e)}function p(e,t){return e instanceof t}function f(e,t){return typeof e===t}function d(e){return e&&f(e,"object")}function h(e){return f(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function m(e){function t(){r(V,arguments)}function n(){r(W,arguments)}function r(e,t){a.state===K&&(a.state=e,a.value=t,u[e].forEach(function(e){e.apply(null,a.value)}))}var a=this,u={resolved:[],rejected:[]};a.then=function(e,t){if(a.state===K)e&&u[V].push(e),t&&u[W].push(t);else switch(a.state){case V:e.apply(null,a.value);break;case W:t.apply(null,a.value)}},e(t,n)}function g(e,t,n){var r=this;r.message=e,r.module=t,n&&(r.stack=J.call(n))}function v(e,t){var n=this;n.url=S.url(t),n.regexPattern=p(e,RegExp)?e:o("^"+i(e)),n.regexUrl=o("^"+i(t))}function y(){var e=this;e.current=null,e.queue=[]}function x(e,t){var n,r,a=this,u=m.defer();S.path.call(a,e,t),a.defered=u,a.pledge=u.pledge,r=fe[a.handler],parent||a.pledge.then(null,l),r?(a.retrieve(),a.cached?E.add(a):(n=b.test(a.url)?new Y:new Z,n.onprogress=function(){},n.ontimeout=n.onerror=n.onabort=function(){u.reject(new g("unable to load module",a.path))},n.onload=function(){a.source=n.responseText,E.add(a)},n.open("GET",a.url+r.suffix,!0),n.send(),H(function(){n.readyState<4&&n.abort()},A))):u.reject(new g('no handler "'+a.handler+'" for',a.path))}function w(e,n,r){var a=this,u=m.defer();S.path.call(a,e),(a.pledge=u.pledge).then(null,function(){l(new g("unable to resolve module",a.path,arguments))}),r.length>0?t.apply(a,r).then(function(){u.resolve(n.apply(null,arguments))},function(){u.reject(new g("unable to resolve dependencies for",a.path,arguments))}):u.resolve(n())}var b,j,E,S,I,T,k,q,M,O,A,D,P,R,N=e.document,H=e.setTimeout,J=Array.prototype.slice,U=Array.prototype.concat,X=N.getElementsByTagName("head")[0],$=N.createElement("a"),C=e.localStorage,L="[demand]",B="[state]",F="[value]",G="undefined",Q="string",z="boolean",K="pending",V="resolved",W="rejected",Y=e.XMLHttpRequest,Z="XDomainRequest"in e&&e.XDomainRequest||Y,_=/^/,ee=/^\//i,te=/^([-\w]+\/[-\w]+)!/,ne=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,re=/url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,ae=/^http(s?):/,ue=C&&"remainingSpace"in C,le={cache:!0,debug:!1,version:"1.0.0",lifetime:0,timeout:5,base:"/"},oe=e.demand.main,ie=e.demand.settings,ce={},se={},pe={},fe={};S={url:function(e){return $.href=e,$.href},path:function(e,t){var n,r,a=this,u=e.match(te)||"application/javascript",l=p(a,x);f(u,Q)||(e=e.replace(o("^"+i(u[0])),""),u=u[1]),s(e)||(e="/"+S.url((t&&t.path&&S.url(t.path+"/../")||"/")+e).replace(b,""));for(n in se)se[n].matches(e)&&(r=se[n]);return l||p(a,w)?(a.handler=u,a.path=e,l&&(a.url=c(S.url(r.process(e)))),void 0):{handler:u,path:e}}},I={get:function(e,t){var n,r;if(C&&M){if(n=L+"["+e+"]",r=JSON.parse(C.getItem(n+B)),r&&r.version===P&&r.url===t&&(0===r.expires||r.expires>(new Date).getTime()))return C.getItem(n+F);I.clear(e)}},set:function(e,t,n){var r,a;if(C&&M){r=L+"["+e+"]";try{if(a=ue?C.remainingSpace:null,C.setItem(r+F,t),C.setItem(r+B,JSON.stringify({version:P,expires:R>0?(new Date).getTime()+R:0,url:n})),null!==a&&C.remainingSpace===a)throw"QuotaExceedError"}catch(u){l("unable to cache module "+e)}}},clear:function(e){var t,n,r,a;if(C&&M)switch(typeof e){case Q:t=L+"["+e+"]",C.removeItem(t+B),C.removeItem(t+F);break;case z:if(e)for(n in C)r=n.match(j),r&&(a=JSON.parse(C.getItem(L+"["+r[1]+"]"+B)),a&&a.expires>0&&a.expires<=(new Date).getTime()&&I.clear(r[1]));break;case G:for(n in C)0===n.indexOf(L)&&C.removeItem(n)}}},m.prototype={constructor:m,state:K,value:null,listener:null,then:null},m.defer=function(){var e={};return e.pledge=new m(function(t,n){e.resolve=t,e.reject=n}),e},m.all=function(e){var t=m.defer(),n=t.pledge,r=[],a=[],u=e.length,l=0;return e.forEach(function(e,n){e.then(function(){r[n]=J.call(arguments),l++,l===u&&t.resolve.apply(null,U.apply([],r))},function(){a.push(J.call(arguments)),a.length+l===u&&t.reject.apply(null,U.apply([],a))})}),n},m.race=function(e){var t=m.defer();return e.forEach(function(e){e.then(t.resolve,t.reject)}),t.pledge},g.prototype={message:null,module:null,stack:null,toString:function(){var e=this,t=L+" "+e.message+" "+e.module;return e.stack&&(t=g.traverse(e.stack,t,1)),t}},g.traverse=function(e,t,n){var r=new Array(n+1).join(" ");return e.forEach(function(e){t+="\n"+r+"> "+e.message+" "+e.module,e.stack&&(t=g.traverse(e.stack,t,n+1))}),t},v.prototype={url:null,regexPattern:null,regexUrl:null,matches:function(e){return this.regexPattern.test(e)},remove:function(e){return e.replace(this.regexUrl,"")},process:function(e){var t=this;return e.replace(t.regexPattern,t.url)}},y.prototype={current:null,queue:null,length:0,add:function(e){var t=this,n=t.queue;n.push(e),t.length++,1===n.length&&t.next()},next:function(){var e,t,n,r=this,a=r.current,u=r.queue;a&&(r.current=null,u.shift(),r.length--),u.length&&(a=r.current=r.queue[0],e=a.defered,t=a.path,n=fe[a.handler],!a.cached&&n.modify&&(a.source=n.modify(a.url,a.source)),n.resolve(t,a.source),pe[t]&&a.probe(),H(function(){e.reject(new g("timeout resolving module",t))},D))}},x.prototype={handler:null,path:null,url:null,defered:null,pledge:null,cached:!1,source:null,probe:function(){var e,t=this,r=t.path,a=t.pledge.state===K;a&&((e=pe[r]())?n(function(){return e}):H(t.probe,100))},store:function(){var e=this;I.set(e.path,e.source,e.url)},retrieve:function(){var e=this,t=I.get(e.path,e.url),n=e.cached=!!t;n&&(e.source=t)}},w.prototype={handler:null,path:null,pledge:null},T={resolve:function(e,t){var n=N.createElement("script");n.type="application/javascript",n.defer=n.async=!0,n.text=t,n.setAttribute("demand-path",e),X.appendChild(n)}},k={resolve:function(e,t){var r=N.createElement("style"),a=r.styleSheet;r.type="text/css",r.media="only x",a&&(a.cssText=t)||(r.innerHTML=t),r.setAttribute("demand-path",e),X.appendChild(r),H(function(){n(function(){return r})})},modify:function(e,t){for(var n,r=S.url(e+"/..");n=re.exec(t);)t=t.replace(n[0],"url("+S.url(r+n[1])+")");return t}},b=o("^"+i(S.url("/"))),j=o("^"+i(L+"[(.+?)]"+B+"$")),E=new y,I.clear(!0),a("application/javascript",".js",T),a("text/css",".css",k),r(le)&&ie&&r(ie),t.configure=r,t.addHandler=a,t.clear=I.clear,e.demand=t,e.provide=n,u("/demand",t),u("/provide",n),u("/pledge",m),u("/validator/isTypeOf",f),u("/validator/isInstanceOf",p),u("/validator/isObject",d),u("/validator/isPositiveInteger",h),oe&&t(oe)}(this);
//# sourceMappingURL=demand.js.map