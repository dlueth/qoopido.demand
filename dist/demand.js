/*! Qoopido.demand 2.0.4 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(e,t,r,n,a,o,c,i){"use strict";function s(){for(var e,t=this!==window?this:ue,r=G.call(arguments),n=0;e=r[n];n++)r[n]=U.dependency(e,t);return q.all(r)}function u(e){var t,r=e.cache,n=e.debug,a=e.cookie,o=e.version,c=e.timeout,i=e.lifetime,s=e.base,u=e.pattern,l=e.modules;if(be.cache=E(r,ie)?r:be.cache,be.debug=E(n,ie)?n:be.debug,be.cookie=E(a,ie)?a:be.cookie,E(o,ce)&&(be.version=o),T(c)&&(be.timeout=1e3*Math.min(Math.max(c,2),12)),T(i)&&i>0&&(be.lifetime=1e3*i),E(s,ce)&&(be.pattern.base=new S("",U.url(s.replace(me,"")))),x(u))for(t in u)"base"!==t&&(be.pattern[t]=new S(t,u[t]));if(x(l))for(t in l)be.modules[t]=l[t]}function l(e,t){return E(e,ce)&&E(t,se)&&ye.test(e)&&(xe[e]||(xe[e]=[])).push(t),s}function p(e){var t,r,n=xe[e],a=0;if(n)for(t=G.call(arguments,1);r=n[a];a++)r.apply(ue,t)}function f(e){var t,r,n;if(e){t=[];for(r in je)n=je[r].pledge,(n.state===e||n.cache===e)&&t.push(r)}else t=Object.keys(je);return t}function h(){var e,t,r,n=arguments,a=E(n[0],ce)?n[0]:ue,o=R(n[a?1:0])?n[a?1:0]:ue,c=o?n[a?2:1]:n[a?1:0];if(!a&&$.current&&(a=$.current.path,$.current=ue,$.items>0&&$.process()),!a)throw"unspecified anonymous provide";a=U.path(a,this),e=je[a]||(je[a]=q.defer()),t=e.pledge,r=E(c,se),t.state===ne&&(o?s.apply(a,o).then(function(){e.resolve(r?c.apply(ue,arguments):c)},function(){m(new I("error providing",a,arguments))}):e.resolve(r?c():c))}function m(e){var t=P(e,I)?"error":"warn";E(console,"undefined")||!be.debug&&"warn"===t||console[t](e.toString())}function d(e){for(var t,r,n=[],a=0;t=e[a];a++)r=t.match(de),t=t.replace(de,""),e[a]=(r?"mock:"+r.slice(1).join(""):"mock:")+"!"+t,n.push((Re[t]=q.defer()).pledge);return s.apply(ue,e),q.all(n)}function g(e,t){h(e,function(){return t})}function v(e){return e.replace(ke,"\\$&")}function k(e,t){return new RegExp(e,t)}function y(){return+new Date}function w(e){_.href=e;var t=_.search,r=B+"[timestamp]="+y();return _.search+=t&&"?"!==t?"&"+r:"?"+r,_.href}function b(e){return e.replace(ge,"")}function j(e,r,n){t.cookie=B+"["+e+"]="+encodeURIComponent(r)+"; expires="+n+"; path=/"}function R(e){return"[object Array]"===J.call(e)}function x(e){return e&&E(e,"object")}function E(e,t){return typeof e===t}function P(e,t){return e instanceof t}function T(e){return E(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function q(e){function t(){n(ae,arguments)}function r(){n(oe,arguments)}function n(e,t){a.state===ne&&(a.state=e,a.value=t,o[e].forEach(function(e){e.apply(ue,t)}))}var a=this,o={resolved:[],rejected:[]};a.then=function(e,t){if(a.state===ne)e&&o[ae].push(e),t&&o[oe].push(t);else switch(a.state){case ae:e&&e.apply(ue,a.value);break;case oe:t&&t.apply(ue,a.value)}return a},e(t,r)}function S(e,t){var r=this;r.weight=e.length,r.url=U.url(t),r.matchPattern=k("^"+v(e)),r.matchUrl=k("^"+v(t))}function I(e,t,r){var n=this;n.message=e,t&&(n.module=t),r&&(n.stack=G.call(r))}function M(){var e=this;e.items=0,e.stack=[]}function O(e,t){var r,n,a=this,i=q.defer(),u=t.handler;return a.deferred=i,a.path=e,a.url=t.url,a.cache=t.cache,a.version=t.version,a.lifetime=t.lifetime,a.cookie=t.cookie,s(V+u).then(function(e){a.handler=e,a.mock=t.mock?Re[a.path]:ue,e.onPreRequest&&e.onPreRequest.call(a),a.mock?a.mock.dependencies?a.mock.dependencies.then(function(){a.mock.resolve(a)},a.mock.reject):a.mock.resolve(a):a.cache&&(a.source=X.get(a))?(i.pledge.cache="hit",o(function(){p("cacheHit",a),U.loader(a,e)})):(a.cache&&p("cacheMiss",a),i.pledge.cache="miss",r=D.test(a.url)?new le:new pe,r.onprogress=function(){},r.ontimeout=r.onerror=r.onabort=function(){i.reject(new I("timeout requesting",a.path))},r.onload=function(){var t=r.getResponseHeader&&r.getResponseHeader("content-type");n=c(n),"status"in r&&200!==r.status||t&&e.matchType&&!e.matchType.test(t)?i.reject(new I("error requesting",a.path)):(a.source=r.responseText,e.onPostRequest&&e.onPostRequest.call(a),U.loader(a,e),a.cache&&i.pledge.then(function(){p("cacheStore",a),X.set(a)}))},r.open("GET",w(a.url),!0),r.send(),n=o(function(){r.readyState<4&&r.abort()},be.timeout))},i.reject),i}var U,A,D,H,$,X,C=Array.prototype,G=C.slice,L=C.concat,F=Object.prototype,J=F.toString,N=t.getElementsByTagName("head")[0],_=t.createElement("a"),B="demand",Q="provide",z="settings",K="/"+B+"/",V=K+"handler/",W=K+"local",Y=K+"settings",Z=K+"validator/",ee="["+B+"]",te="[state]",re="[value]",ne="pending",ae="resolved",oe="rejected",ce="string",ie="boolean",se="function",ue=null,le=a,pe="XDomainRequest"in e&&e.XDomainRequest||le,fe=/^\//,he=/^(http(s?):)?\/\//i,me=/\/$/,de=/^(mock:)?(!)?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?(\+cookie)?!/,ge=/^http(s?):/i,ve=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,ke=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,ye=/^cache(Miss|Store|Hit|Exceed)$/,we=r&&"remainingSpace"in r,be={cache:!0,debug:!1,cookie:!1,timeout:8e3,pattern:{},modules:{},handler:"module",storage:"localstorage"},je={},Re={},xe={};U={url:function(e){return _.href=e,_.href},path:function(e,t){return e=e.replace(de,""),fe.test(e)||he.test(e)||(e="/"+U.url((t&&U.url(t+"/../")||"/")+e).replace(D,"")),e},dependency:function(e,t){var r,n=U.path(e,t);if(t&&(e===B||e===Q||e===z)){switch(e){case B:n=W+n,r=function(){var e,r=s.bind(t);for(e in s)r[e]=s[e];return r};break;case Q:n=W+n,r=function(){return h.bind(t)};break;case z:n=Y+t,r=function(){return be.modules[t]||ue}}!je[n]&&h(n,r)}return(je[n]||(je[n]=new O(n,U.parameter(e,t)))).pledge},parameter:function(e,t){var r,n,a=e.match(de),o=be.pattern;if(e=U.path(e,t),!he.test(e))for(r in o)o[r].matches(e)&&(!n||n.weight<o[r].weight)&&(n=o[r]);return{mock:a&&a[1]?!0:!1,cache:a&&a[2]?!1:be.cache,handler:a&&a[3]||be.handler,version:a&&a[4]||be.version,lifetime:a&&a[5]&&1e3*a[5]||be.lifetime,cookie:a&&a[6]?!0:be.cookie,url:n?b(U.url(n.process(e))):e}},loader:function(e,t){t.onPreProcess&&t.onPreProcess.call(e),t.process&&$.add(e)}},A={handler:{matchType:/^(application|text)\/javascript/,onPreRequest:function(){var e=this,t=e.url;e.url=".js"!==t.slice(-3)?t+".js":t},onPostRequest:function(){var e,t,r=this,n=r.source;if(n){for(;e=ve.exec(n);)fe.test(e[1])?(_.href=r.url,t="//"+_.host+e[1]):t=b(U.url(r.url+"/../"+e[1])),n=n.replace(e[0],"//# sourceMappingURL="+t+".map");r.source=n}},process:function(){var e,r=this,n=r.source;n&&(e=t.createElement("script"),e.async=!0,e.text=n,e.setAttribute("demand-path",r.path),N.appendChild(e))}},storage:{get:function(e){var t,a,o;if(r){if(t=e.path,a=ee+"["+t+"]",o=n.parse(r.getItem(a+te)),o&&o.version===e.version&&o.url===e.url&&(!o.expires&&!e.lifetime||o.expires>y()))return r.getItem(a+re);A.storage.clear.path(t)}},set:function(e){var t,a,o,c,i;if(r){t=e.path,a=e.lifetime,o=ee+"["+t+"]",c=n.stringify({version:e.version,expires:a?y()+a:a,url:e.url});try{if(i=we?r.remainingSpace:ue,r.setItem(o+re,e.source),r.setItem(o+te,c),i!==ue&&r.remainingSpace===i)throw"QUOTA_EXCEEDED_ERR";e.cookie&&j(t,c,"Fri, 31 Dec 9999 23:59:59 GMT")}catch(s){p("cacheExceed",e),m('error caching "'+t+'"')}}},clear:{path:function(e){var t;r&&(t=ee+"["+e+"]",r.removeItem(t+te),r.removeItem(t+re),j(e,"","Thu, 01 Jan 1970 00:00:00 GMT"))},all:function(){var e,t;if(r)for(e in r)t=e.match(H),t&&A.storage.clear.path(t[1])},expired:function(){var e,t,a;if(r)for(e in r)t=e.match(H),t&&(a=n.parse(r.getItem(ee+"["+t[1]+"]"+te)),a&&a.expires>0&&a.expires<=y()&&A.storage.clear.path(t[1]))}}}},q.prototype={state:ne},q.defer=function(){var e={};return e.pledge=new q(function(t,r){e.resolve=t,e.reject=r}),e},q.all=function(e){function t(){c===o?r.resolve.apply(ue,L.apply([],n)):a.length+c===o&&r.reject.apply(ue,L.apply([],a))}var r=q.defer(),n=[],a=[],o=e.length,c=0;return e.forEach(function(e,r){e.then(function(){n[r]=G.call(arguments),c++,t()},function(){a.push(G.call(arguments)),t()})}),r.pledge},q.race=function(e){var t=q.defer();return e.forEach(function(e){e.then(t.resolve,t.reject)}),t.pledge},S.prototype={matches:function(e){return this.matchPattern.test(e)},remove:function(e){return e.replace(this.matchUrl,"")},process:function(e){var t=this;return e.replace(t.matchPattern,t.url)}},I.prototype={toString:function(){var e=this,t=B+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=I.traverse(e.stack,t,1)),t}},I.traverse=function(e,t,r){var n=new Array(r+1).join(" ");return e.forEach(function(e){t+="\n"+n+"> "+e.message+" "+(e.module?'"'+e.module+'"':""),e.stack&&(t=I.traverse(e.stack,t,r+1))}),t},M.prototype={add:function(){$.stack=$.stack.concat(G.call(arguments)),$.items+=arguments.length,!$.current&&$.process()},process:function(){var e;$.items&&($.items--,e=$.current=$.stack.shift(),e.handler.process.call(e))}},D=k("^"+v(U.url("/"))),H=k("^"+v(ee)+"\\[(.+?)\\]"+v(te)+"$"),u({base:"/",pattern:{"/demand":U.url((i&&i.url||location.href)+"/../").slice(0,-1)}}),i&&i.settings&&u(i.settings),g(K+"queue",($=new M).add),g(K+"mock",d),g(K+"pledge",q),g(K+"reason",I),g(K+"handler/"+be.handler,A.handler),g(K+"storage/"+be.storage,X=A.storage),g(K+"function/resolveUrl",U.url),g(K+"modifier/removeProtocol",b),g(Z+"isArray",R),g(Z+"isObject",x),g(Z+"isTypeOf",E),g(Z+"isInstanceOf",P),g(Z+"isPositiveInteger",T),s.configure=u,s.on=l,s.list=f,s.clear=X.clear,e.demand=s,e.provide=h,X.clear.expired(),i&&i.main&&s(i.main),e.registry=je,e.mocks=Re}(this,document,function(){try{return"localStorage"in this&&localStorage}catch(e){return!1}}(),JSON,XMLHttpRequest,setTimeout,clearTimeout,"demand"in this&&demand);
//# sourceMappingURL=demand.js.map