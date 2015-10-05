/*! Qoopido.demand 2.0.6 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e,t,r,n,a,c,o){"use strict";function i(){for(var e,t=this!==window?this:ne,r=H.call(arguments),n=0;e=r[n];n++)r[n]=O.dependency(e,t);return q.all(r)}function s(e){var t,r=e.cache,n=e.version,a=e.timeout,c=e.lifetime,o=e.base,i=e.pattern,s=e.modules,u=he.modules;if(u[J]?(P(r,te)||R(r))&&(u[J]=r):u[J]=he.cache,P(n,ee)&&(he.version=n),E(a)&&(he.timeout=1e3*Math.min(Math.max(a,2),12)),E(c)&&c>0&&(he.lifetime=1e3*c),P(o,ee)&&(he.pattern.base=new S("",O.url(o.replace(se,"")))),R(i))for(t in i)"base"!==t&&(he.pattern[t]=new S(t,i[t]));if(R(s))for(t in s)t!==J&&(u[t]=s[t])}function u(e){me[e]&&(!!me[e].cache&&U.clean.path(e),delete me[e],delete de[e])}function l(e,t){var r;if(P(e,ee)&&P(t,re))for(e=e.split(" ");r=e.shift();)fe.test(r)&&(ve[r]||(ve[r]=[])).push(t);return i}function p(e){var t,r,n,a=ve[e];if(a)for(t=H.call(arguments,1),r=0;n=a[r];r++)n.apply(ne,t)}function f(e){var t,r,n;if(e){t=[];for(r in me)n=me[r].pledge,(n.state===e||n.cache===e)&&t.push(r)}else t=Object.keys(me);return t}function h(){var e,t,r,n=arguments,a=P(n[0],ee)?n[0]:ne,c=j(n[a?1:0])?n[a?1:0]:ne,o=c?n[a?2:1]:n[a?1:0];if(!a&&A.current&&(a=A.current.path,A.current=ne,A.items>0&&A.process()),!a)throw"unspecified anonymous provide";a=O.path(a,this),e=me[a]||(me[a]=q.defer()),t=e.pledge,r=P(o,re),t.state===W&&(c?i.apply(a,c).then(function(){e.resolve(r?o.apply(ne,arguments):o)},function(){m(new T("error providing",a,arguments))}):e.resolve(r?o():o))}function m(e){P(console,"undefined")||console.error(e.toString())}function d(e){for(var t,r,n=[],a=0;t=e[a];a++)r=t.match(ue),t=t.replace(ue,""),e[a]=(r?"mock:"+r.slice(1).join(""):"mock:")+"!"+t,n.push((de[t]=q.defer()).pledge.then(function(e){delete de[e.path]}));return i.apply(ne,e),q.all(n)}function v(e,t){h(e,function(){return t})}function g(e){return e.replace(pe,"\\$&")}function y(e,t){return new RegExp(e,t)}function w(){return+new Date}function k(e){N.href=e;var t=N.search,r=_+"[time]="+w();return N.search+=t&&"?"!==t?"&"+r:"?"+r,N.href}function b(e){return e.replace(le,"")}function j(e){return"[object Array]"===L.call(e)}function R(e){return e&&P(e,"object")}function P(e,t){return typeof e===t}function x(e,t){return e instanceof t}function E(e){return P(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function q(e){function t(){n(Y,arguments)}function r(){n(Z,arguments)}function n(e,t){a.state===W&&(a.state=e,a.value=t,c[e].forEach(function(e){e.apply(ne,t)}))}var a=this,c={resolved:[],rejected:[]};a.then=function(e,t){if(a.state===W)e&&c[Y].push(e),t&&c[Z].push(t);else switch(a.state){case Y:e&&e.apply(ne,a.value);break;case Z:t&&t.apply(ne,a.value)}return a},e(t,r)}function S(e,t){var r=this;r.weight=e.length,r.url=O.url(t),r.matchPattern=y("^"+g(e)),r.matchUrl=y("^"+g(t))}function T(e,t,r){var n=this;n.message=e,t&&(n.module=t),r&&(n.stack=H.call(r))}function I(){var e=this;e.items=0,e.stack=[]}function M(e,t){var r,n,o=this,s=q.defer(),u=t.handler;return o.deferred=s,o.path=e,o.url=t.url,o.cache=t.cache,o.version=t.version,o.lifetime=t.lifetime,i(Q+u).then(function(e){o.handler=e,o.mock=t.mock?de[o.path]:ne,e.onPreRequest&&e.onPreRequest.call(o),o.mock?o.mock.dependencies?o.mock.dependencies.then(function(){o.mock.resolve(o)},o.mock.reject):o.mock.resolve(o):o.cache!==!1&&U.get(o)?a(function(){O.loader(o)}):(p("preRequest",o),r=C.test(o.url)?new ae:new ce,r.onprogress=function(){},r.ontimeout=r.onerror=r.onabort=function(){s.reject(new T("timeout requesting",o.path))},r.onload=function(){var t=r.getResponseHeader&&r.getResponseHeader("content-type");n=c(n),"status"in r&&200!==r.status||t&&e.matchType&&!e.matchType.test(t)?s.reject(new T("error requesting",o.path)):(o.source=r.responseText,p("postRequest",o),e.onPostRequest&&e.onPostRequest.call(o),O.loader(o),o.cache===ne&&s.pledge.then(function(){U.set(o)}))},r.open("GET",k(o.url),!0),r.send(),n=a(function(){r.readyState<4&&r.abort()},he.timeout))},s.reject),s}var O,C,A,U,D=Array.prototype,H=D.slice,$=D.concat,X=Object.prototype,L=X.toString,N=t.createElement("a"),_="demand",B="provide",F="settings",G="/"+_+"/",J=G+"storage/",Q=G+"handler/",z=G+"local",K=G+"settings",V=G+"validator/",W="pending",Y="resolved",Z="rejected",ee="string",te="boolean",re="function",ne=null,ae=n,ce="XDomainRequest"in e&&e.XDomainRequest||ae,oe=/^\//,ie=/^(http(s?):)?\/\//i,se=/\/$/,ue=/^(mock:)?(!)?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,le=/^http(s?):/i,pe=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,fe=/^cache(Miss|Hit|Clear|Exceed)|(pre|post)(Request|Process|Cache)$/,he={cache:!0,timeout:8e3,pattern:{},modules:{},handler:"module"},me={},de={},ve={};O={url:function(e){return N.href=e,N.href},path:function(e,t){return e=e.replace(ue,""),oe.test(e)||ie.test(e)||(e="/"+O.url((t&&O.url(t+"/../")||"/")+e).replace(C,"")),e},dependency:function(e,t){var r,n=O.path(e,t);if(t&&(e===_||e===B||e===F)){switch(e){case _:n=z+n,r=function(){var e,r=i.bind(t);for(e in i)r[e]=i[e];return r};break;case B:n=z+n,r=function(){return h.bind(t)};break;case F:n=K+t,r=function(){return he.modules[t]||ne}}!me[n]&&h(n,r)}return(me[n]||(me[n]=new M(n,O.parameter(e,t)))).pledge},parameter:function(e,t){var r,n,a=e.match(ue),c=he.pattern;if(e=O.path(e,t),!ie.test(e))for(r in c)c[r].matches(e)&&(!n||n.weight<c[r].weight)&&(n=c[r]);return{mock:a&&a[1]?!0:!1,cache:a&&a[2]?!1:ne,handler:a&&a[3]||he.handler,version:a&&a[4]||he.version,lifetime:a&&a[5]&&1e3*a[5]||he.lifetime,url:n?b(O.url(n.process(e))):e}},loader:function(e){var t=e.handler;p("preProcess",e),t.onPreProcess&&t.onPreProcess.call(e),t.process&&A.add(e)}},q.prototype={state:W},q.defer=function(){var e={};return e.pledge=new q(function(t,r){e.resolve=t,e.reject=r}),e},q.all=function(e){function t(){o===c?r.resolve.apply(ne,$.apply([],n)):a.length+o===c&&r.reject.apply(ne,$.apply([],a))}var r=q.defer(),n=[],a=[],c=e.length,o=0;return e.forEach(function(e,r){e.then(function(){n[r]=H.call(arguments),o++,t()},function(){a.push(H.call(arguments)),t()})}),r.pledge},q.race=function(e){var t=q.defer();return e.forEach(function(e){e.then(t.resolve,t.reject)}),t.pledge},S.prototype={matches:function(e){return this.matchPattern.test(e)},remove:function(e){return e.replace(this.matchUrl,"")},process:function(e){var t=this;return e.replace(t.matchPattern,t.url)}},T.prototype={toString:function(){var e=this,t=_+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=T.traverse(e.stack,t,1)),t}},T.traverse=function(e,t,r){var n=new Array(r+1).join(" ");return e.forEach(function(e){t+="\n"+n+"> "+e.message+" "+(e.module?'"'+e.module+'"':""),e.stack&&(t=T.traverse(e.stack,t,r+1))}),t},I.prototype={add:function(){A.stack=A.stack.concat(H.call(arguments)),A.items+=arguments.length,!A.current&&A.process()},process:function(){var e;A.items&&(A.items--,e=A.current=A.stack.shift(),e.handler.process.call(e),p("postProcess",e))}},C=y("^"+g(O.url("/"))),s({base:"/",pattern:{"/demand":O.url((o&&o.url||location.href)+"/../").slice(0,-1)}}),o&&o.settings&&s(o.settings),v(G+"queue",(A=new I).add),v(G+"mock",d),v(G+"pledge",q),v(G+"reason",T),v(G+"function/resolveUrl",O.url),v(G+"modifier/removeProtocol",b),v(V+"isArray",j),v(V+"isObject",R),v(V+"isTypeOf",P),v(V+"isInstanceOf",x),v(V+"isPositiveInteger",E),i.configure=s,i.remove=u,i.on=l,i.list=f,e.demand=i,e.provide=h,function(){function e(){var e=t.getElementsByTagName("head")[0],r=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g;return{matchType:/^(application|text)\/javascript/,onPreRequest:function(){var e=this,t=e.url;e.url=".js"!==t.slice(-3)?t+".js":t},onPostRequest:function(){var e,t,n=this,a=n.source;if(a){for(;e=r.exec(a);)oe.test(e[1])?(N.href=n.url,t="//"+N.host+e[1]):t=b(O.url(n.url+"/../"+e[1])),a=a.replace(e[0],"//# sourceMappingURL="+t+".map");n.source=a}},process:function(){var r,n=this,a=n.source;a&&(r=t.createElement("script"),r.async=!0,r.text=a,r.setAttribute("demand-path",n.path),e.appendChild(r))}}}h(Q+"module",e)}(),function(){function t(t){function n(e){for(var t,r,n=0;t=d[n];n++)0===e.indexOf(t.pattern)&&(!r||t.weight>r.weight)&&(r=t);return r?r.state:!1}function a(){}var c,o,s="["+_+"]",u="[state]",l="[value]",f=y("^"+g(s)+"\\[(.+?)\\]"+g(u)+"$"),h=function(){try{return"localStorage"in e&&e.localStorage}catch(t){return!1}}(),m=h&&"remainingSpace"in h,d=[];if(R(t))for(o in t)d.push({pattern:o,weight:o.length,state:t[o]});else P(t,te)&&(c=t);return a.prototype={get:function(e){var t,a,o,i=e.path;if(h&&(c||n(i))){if(t=s+"["+i+"]",a=r.parse(h.getItem(t+u)),o=e.deferred.pledge,a&&a.version===e.version&&a.url===e.url&&(!a.expires&&!e.lifetime||a.expires>w()))return o.cache="hit",e.source=h.getItem(t+l),p("cacheHit",e),e.source;o.cache="miss",p("cacheMiss",e),this.clear.path(i)}},set:function(e){var t,a,o,i=e.path;if(h&&(c||n(i))){p("preCache",e),t=e.lifetime,a=s+"["+i+"]",e.state={version:e.version,expires:t?w()+t:t,url:e.url};try{if(o=m?h.remainingSpace:ne,h.setItem(a+l,e.source),h.setItem(a+u,r.stringify(e.state)),o!==ne&&h.remainingSpace===o)throw"QUOTA_EXCEEDED_ERR";p("postCache",e)}catch(f){p("cacheExceed",e)}}},clear:{path:function(e){var t;h&&(t=s+"["+e+"]",h.removeItem(t+u),h.removeItem(t+l),p("cacheClear",e))},all:function(){var e,t;if(h)for(e in h)t=e.match(f),t&&this.path(t[1])},expired:function(){var e,t,n;if(h)for(e in h)t=e.match(f),t&&(n=r.parse(h.getItem(s+"["+t[1]+"]"+u)),n&&n.expires>0&&n.expires<=w()&&this.path(t[1]))}}},U=new a,U.clear.expired(),i.clear=U.clear,U}h(J,["settings"],t)}(),o&&o.main&&i(o.main)}(this,document,JSON,XMLHttpRequest,setTimeout,clearTimeout,"demand"in this&&demand);
//# sourceMappingURL=demand.js.map
