/**! Qoopido.demand 4.0.0 (MIT OR GPL-3.0+) | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(e,t,n,r,i){"use strict";function o(e,t){return typeof e===t}function u(e){return e&&o(e,U)}function a(e){return o(e,H)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function c(e,t,n){for(var r,i=Object.keys(e),o=0;(r=i[o])!==C&&t.call(n,r,e[r])!==A;o++);}function s(e,t,n,r){return{__proto__:M,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function l(){return+new Date}function d(e){return ve.href=e,ve.href}function f(e,t){var n=e.match(Se);return(n&&n[1]?"mock:":"")+(n&&n[3]||b.handler)+"!"+Ee(e,t)}function h(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=de.call(n))}function p(e){var t;be.test(e.path)||c(b.pattern,function(n,r){r.matches(e.path)&&(!t||t.weight<r.weight)&&(t=r)}),e.url=t?d(t.process(e.path)):e.path,xe.emit(Y,e.type,e),new Ae(e.url).then(function(t,n){!e.handler.validate||e.handler.validate(n)?(e.source=t,xe.emit(Z,e.type,e)):e.deferred.reject(new h(ue+" (content-type)",e.path))},function(t){e.deferred.reject(new h(ue+(t?" (status)":""),e.path))})}function v(e){return"[object Array]"===pe.call(e)}function m(e){o(console,D)||console.error(e.toString())}function g(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}function h(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=de.call(n))}function y(e,t){provide(e,function(){return t})}var x,w,b={cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},j="demand",q="provide",R="path",S="/"+j+"/",E=S+"handler/",k=S+"function/",O=S+"validator/",P="mock:",M=null,C=void 0,A=!1,I=!0,D="undefined",T="string",$="boolean",U="object",_="function",H="number",L=function(){},N="pre",X="post",F="Configure",B=N+F,G=X+F,J="cache",Q=J+"Miss",z=J+"Hit",K=J+"Clear",V=J+"Exceed",W="Request",Y=N+W,Z=X+W,ee="Process",te=N+ee,ne=X+ee,re="queue",ie=re+"Enqueue",oe=re+"Dequeue",ue="error loading",ae="error providing",ce="error resolving",se="unspecified anonymous provide",le=Array.prototype,de=le.slice,fe=le.concat,he=Object.prototype,pe=he.toString,ve=(Object.create,Object.defineProperty,Object.getOwnPropertyNames,Object.getOwnPropertyDescriptor,Function.prototype,t.createElement("a")),me=function(){function e(e,t){var n,r=this[e];t!==C&&(u(t)?(n=u(r),r=t.length!==C?n&&r.length!==C?r:[]:n&&r.length===C?r:{},this[e]=me(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==C;r++)c(t,e,n);return n}}(),ge=function(){function e(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}function t(){}var n=Object.defineProperty,r=new RegExp("[xy]","g"),i={};return t.prototype={generate:function(){var t;do t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(r,e);while(i[t]);return i[t]=1,t},set:function(e){return o(e.uuid,D)&&n(e,"uuid",new s(this.generate())),e.uuid}},new t}(),ye=function(){var n,i,o="setImmediate"in e;return"MutationObserver"in e?function(e){n=t.createElement("div"),new MutationObserver(function(){e()}).observe(n,{attributes:I}),n.setAttribute("i","1")}:!o&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?function(){function t(t){t.source===e&&t.data&&n[t.data]&&(n[t.data](),delete n[t.data])}var n={};return e.addEventListener("message",t,A),function(t){var r=ge.generate();n[r]=t,e.postMessage(r,"*")}}():!o&&"onreadystatechange"in(n=t.createElement("script"))?function(e){n.onreadystatechange=function(){n.onreadystatechange=M,n.parentNode.removeChild(n),e()},t.body.appendChild(n)}:(i=o?setImmediate:r,function(e){i(e)})}(),xe=function(){function e(){}var t=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Configure|Request|Process|Cache)$/,n={};return e.prototype={emit:function(e,t){var r,i,o,u=n[e];if(u)for(r=de.call(arguments,2),i=0;o=u[i];i++)o.filter&&o.filter!==t||o.callback.apply(M,r);return this},on:function(e,r){var i,u;if(o(e,T)&&o(r,_))for(e=e.split(" ");i=e.shift();)i=i.split(":"),t.test(i[0])&&((n[i[0]]||(n[i[0]]=[])).push({callback:r,filter:i[1]}),i[0]===G&&(u=b.modules[i[1]])&&r(u));return this}},new e}(),we=function(){var e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;return function(t){return t.replace(e,"\\$&")}}(),be=/^(http(s?):)?\/\//i,je=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,qe=new RegExp("^"+we(d("/"))),Re=new RegExp("^"+j+"|"+q+"|"+R+"$"),Se=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,Ee=function(){var e=/^\//;return function(t,n){var r=t.replace(Se,"");return e.test(r)||be.test(r)||(r="/"+d((n&&d(n+"/../")||"/")+r).replace(qe,"")),r}}(),ke=function(t){function n(e){var t;return e.cache!==M?e.cache:(c(b.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:A)}function r(e,t){xe.emit(e,t.path,t)}function i(){}var o,u="["+j+"]",a="[state]",s="[value]",d=new RegExp("^"+we(u)+"\\[(.+?)\\]"+we(a)+"$"),h=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return A}}(),p=h&&"remainingSpace"in localStorage;return xe.on(ne,function(e){ye(function(){e.source&&o.set(e)})}).on(Q,function(e){o.clear.path(e.id)}),i.prototype={get:function(){return h?function(e){var i,o;n(e)?(i=u+"["+e.id+"]",o=t.parse(localStorage.getItem(i+a)),o&&o.version===e.version&&(!o.expires&&!e.lifetime||o.expires>l())?(e.source=localStorage.getItem(i+s),r(z,e)):r(Q,e)):r(Q,e)}:function(e){r(Q,e)}}(),set:function(){return h?function(e){n(e)&&ye(function(){var n,r=u+"["+e.id+"]";try{if(n=p?localStorage.remainingSpace:M,localStorage.setItem(r+s,e.source),localStorage.setItem(r+a,t.stringify({version:e.version,expires:e.lifetime?l()+e.lifetime:e.lifetime})),n!==M&&localStorage.remainingSpace===n)throw new Error("QUOTA_EXCEEDED_ERR");return I}catch(t){xe.emit(V,e.path,e)}})}:L}(),clear:{path:function(){return h?function e(e){ye(function(){var t=f(e),n=u+"["+t+"]";localStorage.removeItem(n+a),localStorage.removeItem(n+s),xe.emit(K,e)})}:L}(),all:function(){return h?function(){var e;c(localStorage,function(t){e=t.match(d),e&&this.path(e[1])},this)}:L}(),expired:function(){return h?function(){var e,n;c(localStorage,function(r){e=r.match(d),e&&(n=t.parse(localStorage.getItem(u+"["+e[1]+"]"+a)),n&&n.expires>0&&n.expires<=l()&&this.path(e[1]))},this)}:L}()}},o=new i}(JSON),Oe=function(){function e(){s[this.uuid].handle(a,arguments)}function t(){s[this.uuid].handle(c,arguments)}function n(e,t){var n,r,i=s[this.uuid];for(i.state===u&&(i.state=e,i.value=t);n=i[i.state].shift();)r=n.handler.apply(M,i.value),r&&"function"==typeof r.then?r.then(n.deferred.resolve,n.deferred.reject):n.deferred[i.state===a?"resolve":"reject"].apply(M,i.value);i[a].length=0,i[c].length=0}function r(e,t,n){e.then(function(){n.resolved[t]=de.call(arguments),n.count++,i(n)},function(){n.rejected.push(de.call(arguments)),i(n)})}function i(e){e.count===e.total?e.deferred.resolve.apply(M,fe.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.deferred.reject.apply(M,fe.apply([],e.rejected))}function o(r){var i=this;s[ge.set(i)]={state:u,handle:n.bind(i),value:M,resolved:[],rejected:[],count:0},r(e.bind(i),t.bind(i))}var u="pending",a="resolved",c="rejected",s={};return o.prototype={catch:function(e){return this.then(L,e)},always:function(e){return this.then(e,e)},then:function(e,t){var n=s[this.uuid],r=o.defer();return e&&n[a].push({handler:e,deferred:r}),t&&n[c].push({handler:t,deferred:r}),n.state!==u&&ye(n.handle),r.pledge},isPending:function(){return s[this.uuid].state===u},isResolved:function(){return s[this.uuid].state===a},isRejected:function(){return s[this.uuid].state===c}},o.defer=function(){var e={};return e.pledge=new o(function(t,n){e.resolve=t,e.reject=n}),e},o.all=function(e){for(var t,n=o.defer(),i=s[ge.generate()]={deferred:n,resolved:[],rejected:[],total:e.length,count:0},u=0;t=e[u];u++)r(t,u,i);return n.pledge},o.race=function(e){for(var t,n=o.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return n.pledge},o}(),Pe=function(){function e(){var e=this;t[ge.set(e)]={}}var t={};return e.prototype={get:function(e){return e?t[this.uuid][e]:t[this.uuid]},set:function(e,n){t[this.uuid][e]=n}},e}();h.prototype={toString:function(){var e=this,t=j+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=h.traverse(e.stack,t,1)),t}},h.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=h.traverse(r.stack,t,n+1));return t};var Me=function(){function e(e,n){var r=this,i=e.match(Se);return r.deferred=Oe.defer(),r.pledge=r.deferred.pledge,r.path=Ee(e,n),r.mock=i&&i[1]?I:A,r.cache=i&&i[2]?"+"===i[1]:M,r.type=i&&i[3]||b.handler,r.version=i&&i[4]||b.version,r.lifetime=i&&i[5]&&1e3*i[5]||b.lifetime,r.id=(r.mock?P:"")+r.type+"!"+r.path,r.uri=(r.mock?P:"")+r.type+"@"+r.version+(a(r.lifetime)&&r.lifetime>0?"#"+r.lifetime:"")+"!"+r.path,t.set(r.id,r),r}var t=new Pe;return e.resolve=function(n,r){var i=t.get(f(n,r));if(!i)if(i=new e(n,r),r&&Re.test(n))switch(n){case j:i.deferred.resolve(function(){var e=demand.bind(r);return c(demand,function(t,n){e[t]=n}),e}());break;case q:i.deferred.resolve(provide.bind(r));break;case R:i.deferred.resolve(r)}else demand(E+i.type).then(function(e){i.handler=e,i.mock?i.deferred.resolve(e):ke.get(i)},function(){i.deferred.reject(new h(ue+" (handler)",self.path))});return i},e.list={all:function(){return Object.keys(t.get())},pending:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isPending()&&e.push(t)}),e},resolved:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isResolved()&&e.push(t)}),e},rejected:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isRejected()&&e.push(t)}),e}},e}(),Ce=function(){function e(e,n){var r=this;r.weight=e.length,r.url=d(n).replace(t,"$1"),r.matchPattern=new RegExp("^"+we(e)),r.matchUrl=new RegExp("^"+we(n))}var t=/(.+)\/$/;return e.prototype={matches:function(e){return this.matchPattern.test(e)},remove:function(e){return e.replace(this.matchUrl,"")},process:function(e){return e.replace(this.matchPattern,this.url)}},e}(),Ae=function(t){function n(){this.readyState<4&&this.abort()}var o="XDomainRequest"in e&&e.XDomainRequest||t;return function(e){var u,a=n.bind(this),c=Oe.defer(),s=qe.test(e)?new t:new o,l=b.timeout;return s.ontimeout=s.onerror=s.onabort=function(){c.reject(s.status)},s.onprogress=s.onreadystatechange=function(){i(u),u=r(a,b.timeout)},s.onload=function(){l=i(l),"status"in s&&200!==s.status?c.reject(s.status):c.resolve(s.responseText,s.getResponseHeader&&s.getResponseHeader("content-type"))},s.open("GET",e,!0),r(function(){s.send()}),u=r(a,b.timeout),c.pledge}}(XMLHttpRequest);e.demand=function(){function t(){for(var t,n=de.call(arguments),r=this!==e?this:M,i=0;t=n[i];i++)n[i]=Me.resolve(t,r).pledge;return Oe.all(n)}return t.configure=function(e){var n,r=e.cache,i=e.version,s=e.timeout,l=e.lifetime,d=e.base,f=e.pattern,h=e.modules,p=b.modules;return o(r,$)?b.cache[""]={weight:0,state:r}:u(r)&&c(r,function(e,t){b.cache[e]={weight:e.length,state:t}}),o(i,T)&&(b.version=i),a(s)&&(b.timeout=1e3*Math.min(Math.max(s,2),12)),a(l)&&l>0&&(b.lifetime=1e3*l),o(d,T)&&""!==d&&(b.pattern.base=new Ce("",d)),u(f)&&c(f,function(e,t){"base"!==e&&(b.pattern[e]=new Ce(e,t))}),u(h)&&c(h,function(e,t){n=p[e]=p[e]||{},xe.emit(B,e,n),me(n,t),xe.emit(G,e,n)}),t},t.on=xe.on.bind(t),t.list=Me.list,t.clear=ke.clear,t.on(Q,function(e){ye(function(){new p(e)})}).on(z+" "+Z,function(e){ye(function(){xe.emit(te,M,e)})}).on(Y,function(e){var t=e.handler.onPreRequest;t&&t.call(e)}).on(Z,function(e){var t=e.handler.onPostRequest;t&&t.call(e)}).on(te,function(e){var t=e.handler.onPreProcess,n=e.handler.enqueue!==A?ye.bind(M,function(){x.enqueue(e)}):M;t&&t.call(e),e.pledge.then(function(){xe.emit(ne,e.path,e)}),n&&(e.delay?e.delay.then(n):n())}),t}(),e.provide=function(){var e,t,n=o(arguments[0],T)?arguments[0]:M,r=v(arguments[n?1:0])?arguments[n?1:0]:M,i=r?arguments[n?2:1]:arguments[n?1:0];if(!n&&w.current&&(e=w.current,n=w.current.uri,w.process()),!n)throw new h(se);e=e||new Me(n),t=o(i,_),r?demand.apply(e.path,r).then(function(){e.deferred.resolve(t?i.apply(M,arguments):i)},function(){m(new h(ae,e.path))}):e.deferred.resolve(t?i():i)};var Ie=function(){function e(){t[ge.set(this)]=[]}var t={};return e.prototype={enqueue:function(){t[this.uuid]=t[this.uuid].concat(de.call(arguments)),xe.emit(ie,this.uuid)},dequeue:function(){return xe.emit(oe,this.uuid),t[this.uuid].shift()},get current(){return t[this.uuid][0]},get length(){return t[this.uuid].length}},e}(),De=function(){function e(e){var n=this,r=t[ge.set(n)]={queue:e,current:M};xe.on(ie+":"+e.uuid,function(){!r.current&&n.process()})}var t={};return e.prototype={process:function(){var e,n=t[ge.set(this)];n.queue.length?(e=n.current=n.queue.dequeue(),e.handler.process&&e.handler.process.call(e)):n.current=M},get current(){return t[ge.set(this)].current}},e}(),Te=function(){var e=t.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/;return{validate:function(e){return n.test(e)},onPreRequest:function(){var e=this.url;this.url=".js"!==e.slice(-3)?e+".js":e},onPostRequest:function(){for(var e,t,n=this;e=je.exec(n.source);)be.test(e[1])?(ve.href=n.url,t=ve.protocol+"//"+ve.host+e[1]):t=d(n.url+"/../"+e[1]),n.source=n.source.replace(e[0],"//# sourceMappingURL="+t+".map")},process:function(){var n,r=this;r.source&&(n=t.createElement("script"),n.async=!0,n.text=r.source,n.setAttribute("demand-id",r.id),e.appendChild(n))}}}();h.prototype={toString:function(){var e=this,t=j+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=h.traverse(e.stack,t,1)),t}},h.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=h.traverse(r.stack,t,n+1));return t};var $e=function(){var e=E+"bundle",t={};return demand.on(G+":"+e,function(e){t=u(e)?e:{}}),{enqueue:A,validate:Te.validate,onPreProcess:function(){function e(){a.reject(new h(ce,o.path,arguments))}for(var n,r,i,o=this,u=o.source,a=o.deferred,s=t[o.path];n=je.exec(u);)u=u.replace(n[0],"");o.source=u,s&&(r=[],c(s,function(e,t){r.push(Me.resolve(P+t).pledge)}),Oe.all(r).then(function(){r.length=0,Te.process.call(o),c(arguments,function(e,t){i=new Me(s[e]),i.handler=t,x.enqueue(i),w.process(),r.push(i.pledge)}),Oe.all(r).then(a.resolve,e)},e))}}}();x=new Ie,w=new De(x),y(E+"module",Te),y(E+"bundle",$e),y(O+"isTypeOf",o),y(O+"isArray",v),y(O+"isObject",u),y(O+"resolveUrl",d),y(k+"merge",me),y(k+"iterate",c),y(k+"hash",g),y(k+"defer",ye),y(S+"uuid",ge),y(S+"pledge",Oe),y(S+"queue",Ie),y(S+"xhr",Ae),y(S+"failure",h),demand.configure({cache:I,base:"/",pattern:{"/demand":d((n&&n.url||location.href)+"/../").slice(0,-1)}}),n&&(n.settings&&demand.configure(n.settings),n.main&&demand(n.main))}(this,document,"demand"in this&&demand,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
