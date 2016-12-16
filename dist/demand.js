/**! Qoopido.demand 4.0.0 (MIT OR GPL-3.0+) | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(e,t,n,r,i){"use strict";function o(e,t){return typeof e===t}function u(e){return e&&o(e,L)}function a(e){return o(e,U)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function c(e,t,n){for(var r,i=Object.keys(e),o=0;(r=i[o])!==A&&t.call(n,r,e[r])!==D;o++);}function s(e,t,n,r){return{__proto__:I,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function f(e,t){return e instanceof t}function l(){return+new Date}function d(e){return je.href=e,je.href}function h(e,t){var n=e.match(Ie);return(n&&n[1]?"mock:":"")+(n&&n[3]||j.handler)+"!"+Ae(e,t)}function p(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=ye.call(n))}function v(e){function t(t,n){!e.handler.validate||e.handler.validate(n)?(e.source=t,Ee.emit(ue,e.type,e)):e.deferred.reject(new p(he+" (content-type)",e.id))}function n(t){e.deferred.reject(new p(he+(t?" (status)":""),e.id))}function r(o){o=o||0,e.url=i?d(i.process(e.path,o)):e.path,Ee.emit(oe,e.type,e),new Le(e.url).then(t,i?function(){o++,i.location[o]?r(o):n()}:n)}var i;Oe.test(e.path)||c(j.pattern,function(t,n){n.matches(e.path)&&(!i||i.weight<n.weight)&&(i=n)}),r()}function g(e){return"[object Array]"===be.call(e)}function m(e){o(console,$)||console.error(e.toString())}function y(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}function p(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=ye.call(n))}function x(e,t){provide(e,function(){return t})}var w,b,j={cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},R="demand",S="provide",q="path",E="/"+R+"/",k=E+"handler/",O=E+"plugin/",P=E+"function/",M=E+"validator/",C="mock:",I=null,A=void 0,D=!1,T=!0,$="undefined",_="string",H="boolean",L="object",N="function",U="number",X=function(){},F="pre",J="post",B="Configure",G=F+B,Q=J+B,z="cache",K=z+"Miss",V=z+"Hit",W=z+"Clear",Y=z+"Exceed",Z=F+"Cache",ee=J+"Cache",te="Resolve",ne=F+te,re=J+te,ie="Request",oe=F+ie,ue=J+ie,ae="Process",ce=F+ae,se=J+ae,fe="queue",le=fe+"Enqueue",de=fe+"Dequeue",he="error loading",pe="error providing",ve="error resolving",ge="unspecified anonymous provide",me=Array.prototype,ye=me.slice,xe=me.concat,we=Object.prototype,be=we.toString,je=(Object.create,Object.defineProperty,Object.getOwnPropertyNames,Object.getOwnPropertyDescriptor,Function.prototype,t.createElement("a")),Re=function(){function e(e,t){var n,r=this[e];t!==A&&(u(t)?(n=u(r),r=t.length!==A?n&&r.length!==A?r:[]:n&&r.length===A?r:{},this[e]=Re(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==A;r++)c(t,e,n);return n}}(),Se=function(){function e(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}function t(){}var n=Object.defineProperty,r=new RegExp("[xy]","g"),i={};return t.prototype={generate:function(){var t;do t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(r,e);while(i[t]);return i[t]=1,t},set:function(e){return o(e.uuid,$)&&n(e,"uuid",new s(this.generate())),e.uuid}},new t}(),qe=function(){var n,i,o="setImmediate"in e;return"MutationObserver"in e?function(e){n=t.createElement("div"),new MutationObserver(function(){e()}).observe(n,{attributes:T}),n.setAttribute("i","1")}:!o&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?function(){function t(t){t.source===e&&t.data&&n[t.data]&&(n[t.data](),delete n[t.data])}var n={};return e.addEventListener("message",t,D),function(t){var r=Se.generate();n[r]=t,e.postMessage(r,"*")}}():!o&&"onreadystatechange"in(n=t.createElement("script"))?function(e){n.onreadystatechange=function(){n.onreadystatechange=I,n.parentNode.removeChild(n),e()},t.body.appendChild(n)}:(i=o?setImmediate:r,function(e){i(e)})}(),Ee=function(){function e(){}var t=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,n={};return e.prototype={emit:function(e,t){var r,i,o,u=n[e];if(u)for(r=ye.call(arguments,2),i=0;o=u[i];i++)o.filter&&o.filter!==t||o.callback.apply(I,r);return this},on:function(e,r){var i,u;if(o(e,_)&&o(r,N))for(e=e.split(" ");i=e.shift();)i=i.split(":"),t.test(i[0])&&((n[i[0]]||(n[i[0]]=[])).push({callback:r,filter:i[1]}),i[0]===Q&&(u=j.modules[i[1]])&&r(u));return this}},new e}(),ke=function(){var e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;return function(t){return t.replace(e,"\\$&")}}(),Oe=/^(http(s?):)?\/\//i,Pe=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,Me=new RegExp("^"+ke(d("/"))),Ce=new RegExp("^"+R+"|"+S+"|"+q+"$"),Ie=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,Ae=function(){var e=/^\//;return function(t,n){var r=t.replace(Ie,"");return e.test(r)||Oe.test(r)||(r="/"+d((n&&d(n+"/../")||"/")+r).replace(Me,"")),r}}(),De=function(t){function n(e){var t;return e.cache!==I?e.cache:(c(j.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:D)}function r(e,t,n){Ee.emit(e,t.id,t,n)}function i(){}var o,u="["+R+"]",a="[state]",s="[value]",f=new RegExp("^"+ke(u)+"\\[(.+?)\\]"+ke(a)+"$"),d=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return D}}(),p=d&&"remainingSpace"in localStorage;return Ee.on(se,function(e){qe(function(){e.source&&o.set(e)})}).on(K,function(e){qe(function(){o.clear.path(e.id)})}),i.prototype={get:function(){return d?function(e){var r,i;if(n(e)&&(r=u+"["+e.id+"]",i=t.parse(localStorage.getItem(r+a)),i&&i.version===e.version&&(!i.expires&&!e.lifetime||i.expires>l())))return e.source=localStorage.getItem(r+s),T}:X}(),resolve:function(){return d?function(e){this.get(e)?r(V,e):r(K,e)}:function(e){r(K,e)}}(),set:function(){return d?function(e){var i;n(e)&&(i={version:e.version,expires:e.lifetime?l()+e.lifetime:e.lifetime},r(Z,e,i),qe(function(){var n,o=u+"["+e.id+"]";try{if(n=p?localStorage.remainingSpace:I,localStorage.setItem(o+s,e.source),localStorage.setItem(o+a,t.stringify(i)),n!==I&&localStorage.remainingSpace===n)throw new Error("QUOTA_EXCEEDED_ERR");r(ee,e,i)}catch(t){r(Y,e)}}))}:X}(),clear:{path:function(){return d?function e(e){var t=h(e),n=u+"["+t+"]";localStorage[n+a]&&qe(function(){localStorage.removeItem(n+a),localStorage.removeItem(n+s),r(W,_e.get(t)||new _e(t,I,D))})}:X}(),all:function(){return d?function(){var e;c(localStorage,function(t){e=t.match(f),e&&this.path(e[1])},this)}:X}(),expired:function(){return d?function(){var e,n;c(localStorage,function(r){e=r.match(f),e&&(n=t.parse(localStorage.getItem(u+"["+e[1]+"]"+a)),n&&n.expires>0&&n.expires<=l()&&this.path(e[1]))},this)}:X}()}},o=new i}(JSON),Te=function(){function e(){s[this.uuid].handle(a,arguments)}function t(){s[this.uuid].handle(c,arguments)}function n(e,t){var n,r,i=s[this.uuid];for(i.state===u&&(i.state=e,i.value=t);n=i[i.state].shift();)r=n.handler.apply(I,i.value),r&&"function"==typeof r.then?r.then(n.deferred.resolve,n.deferred.reject):n.deferred[i.state===a?"resolve":"reject"].apply(I,i.value);i[a].length=0,i[c].length=0}function r(e,t,n){e.then(function(){n.resolved[t]=ye.call(arguments),n.count++,i(n)},function(){n.rejected.push(ye.call(arguments)),i(n)})}function i(e){e.count===e.total?e.deferred.resolve.apply(I,xe.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.deferred.reject.apply(I,xe.apply([],e.rejected))}function o(r){var i=this;s[Se.set(i)]={state:u,handle:n.bind(i),value:I,resolved:[],rejected:[],count:0},r(e.bind(i),t.bind(i))}var u="pending",a="resolved",c="rejected",s={};return o.prototype={catch:function(e){return this.then(X,e)},always:function(e){return this.then(e,e)},then:function(e,t){var n=s[this.uuid],r=o.defer();return e&&n[a].push({handler:e,deferred:r}),t&&n[c].push({handler:t,deferred:r}),n.state!==u&&qe(n.handle),r.pledge},isPending:function(){return s[this.uuid].state===u},isResolved:function(){return s[this.uuid].state===a},isRejected:function(){return s[this.uuid].state===c}},o.defer=function(){var e={};return e.pledge=new o(function(t,n){e.resolve=t,e.reject=n}),e},o.all=function(e){for(var t,n=o.defer(),i=s[Se.generate()]={deferred:n,resolved:[],rejected:[],total:e.length,count:0},u=0;t=e[u];u++)r(t,u,i);return n.pledge},o.race=function(e){for(var t,n=o.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return n.pledge},o}(),$e=function(){function e(){var e=this;t[Se.set(e)]={}}var t={};return e.prototype={get:function(e){return e?t[this.uuid][e]:t[this.uuid]},set:function(e,n){t[this.uuid][e]=n}},e}();p.prototype={toString:function(){var e=this,t=R+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=p.traverse(e.stack,t,1)),t}},p.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=p.traverse(r.stack,t,n+1));return t};var _e=function(){function e(e,n,r){var i=this,o=e.match(Ie);return i.path=Ae(e,n),i.mock=o&&o[1]?T:D,i.cache=o&&o[2]?"+"===o[1]:I,i.type=o&&o[3]||j.handler,i.version=o&&o[4]||j.version,i.lifetime=o&&o[5]&&1e3*o[5]||j.lifetime,i.id=(i.mock?C:"")+i.type+"!"+i.path,i.uri=(i.mock?C:"")+i.type+"@"+i.version+(a(i.lifetime)&&i.lifetime>0?"#"+i.lifetime:"")+"!"+i.path,i.deferred=Te.defer(),i.pledge=i.deferred.pledge,r!==D&&t.set(i.id,i),i}var t=new $e;return e.get=function(e,n){return t.get(h(e,n))},e.resolve=function(t,n){var r=this.get(t,n);if(!r)if(r=new e(t,n),n&&Ce.test(t))switch(t){case R:r.deferred.resolve(function(){var e=demand.bind(n);return c(demand,function(t,n){e[t]=n}),e}());break;case S:r.deferred.resolve(provide.bind(n));break;case q:r.deferred.resolve(n)}else demand(k+r.type).then(function(e){r.handler=e,r.mock?r.deferred.resolve(e):De.resolve(r)},function(){r.deferred.reject(new p(he+" (handler)",self.id))});return r},e.list={all:function(){return Object.keys(t.get())},pending:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isPending()&&e.push(t)}),e},resolved:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isResolved()&&e.push(t)}),e},rejected:function(){var e=[];return c(t.get(),function(t,n){n.pledge.isRejected()&&e.push(t)}),e}},e}(),He=function(){function e(e,n){var r=this;r.weight=e.length,r.match=new RegExp("^"+ke(e)),r.location=[].concat(n),c(r.location,function(e,n){r.location[e]={url:d(n).replace(t,"$1"),match:new RegExp("^"+ke(n))}})}var t=/(.+)\/$/;return e.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},e}(),Le=function(t){function n(){this.readyState<4&&this.abort()}var o="XDomainRequest"in e&&e.XDomainRequest||t;return function(e){var u,a=n.bind(this),c=Te.defer(),s=Me.test(e)?new t:new o,f=j.timeout;return s.ontimeout=s.onerror=s.onabort=function(){c.reject(s.status)},s.onprogress=s.onreadystatechange=function(){i(u),u=r(a,j.timeout)},s.onload=function(){f=i(f),"status"in s&&200!==s.status?c.reject(s.status):c.resolve(s.responseText,s.getResponseHeader&&s.getResponseHeader("content-type"))},s.open("GET",e,T),s.send(),u=r(a,j.timeout),c.pledge}}(XMLHttpRequest);e.demand=function(){function t(){var t,n=ye.call(arguments),r=this!==e?this:I,i=0;for(Ee.emit(ne,I,n,r);t=n[i];i++)n[i]=_e.resolve(t,r).pledge;return Te.all(n).always(function(){Ee.emit(re,I,n,r)})}return t.configure=function(e){var n,r=e.cache,i=e.version,s=e.timeout,f=e.lifetime,l=e.base,d=e.pattern,h=e.modules,p=j.modules;return o(r,H)?j.cache[""]={weight:0,state:r}:u(r)&&c(r,function(e,t){j.cache[e]={weight:e.length,state:t}}),o(i,_)&&(j.version=i),a(s)&&(j.timeout=1e3*Math.min(Math.max(s,2),12)),a(f)&&f>0&&(j.lifetime=1e3*f),o(l,_)&&""!==l&&(j.pattern.base=new He("",l)),u(d)&&c(d,function(e,t){"base"!==e&&(j.pattern[e]=new He(e,t))}),u(h)&&c(h,function(e,t){n=p[e]=p[e]||{},Ee.emit(G,e,n),Re(n,t),Ee.emit(Q,e,n)}),t},t.on=Ee.on.bind(t),t.list=_e.list,t.clear=De.clear,t.on(K,function(e){qe(function(){new v(e)})}).on(V+" "+ue,function(e){qe(function(){Ee.emit(ce,e.id,e)})}).on(oe,function(e){var t=e.handler.onPreRequest;t&&t.call(e)}).on(ue,function(e){var t=e.handler.onPostRequest;t&&t.call(e)}).on(ce,function(e){var t=e.handler.onPreProcess,n=e.handler.enqueue!==D?qe.bind(I,function(){w.enqueue(e)}):I;t&&t.call(e),e.pledge.then(function(){Ee.emit(se,e.id,e)}),n&&(e.delay?e.delay.then(n):n())}),t}(),e.provide=function(){var t,n,r=o(arguments[0],_)?arguments[0]:I,i=this!==e?this:I,u=g(arguments[r?1:0])?arguments[r?1:0]:I,a=u?arguments[r?2:1]:arguments[r?1:0];if(!r&&b.current&&(t=b.current,r=t.uri,b.process()),!r)throw new p(ge);t=t||new _e(r,i),n=o(a,N),u?demand.apply(t.path,u).then(function(){t.deferred.resolve(n?a.apply(I,arguments):a)},function(){m(new p(pe,t.id))}):t.deferred.resolve(n?a():a)},demand.configure({cache:T,base:"/",pattern:{"/demand":d((n&&n.url||location.href)+"/../").slice(0,-1)}}),n&&n.settings&&demand.configure(n.settings);var Ne=function(){function e(){t[Se.set(this)]=[]}var t={};return e.prototype={enqueue:function(){t[this.uuid]=t[this.uuid].concat(ye.call(arguments)),Ee.emit(le,this.uuid)},dequeue:function(){return Ee.emit(de,this.uuid),t[this.uuid].shift()},get current(){return t[this.uuid][0]},get length(){return t[this.uuid].length}},e}(),Ue=function(){function e(e){var n=this,r=t[Se.set(n)]={queue:e,current:I};Ee.on(le+":"+e.uuid,function(){!r.current&&n.process()})}var t={};return e.prototype={process:function(){var e,n=t[Se.set(this)];n.queue.length?(e=n.current=n.queue.dequeue(),e.handler.process&&e.handler.process.call(e)):n.current=I},get current(){return t[Se.set(this)].current}},e}(),Xe=function(){var e=t.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/;return{validate:function(e){return n.test(e)},onPreRequest:function(){var e=this.url;this.url=".js"!==e.slice(-3)?e+".js":e},onPostRequest:function(){for(var e,t,n=this;e=Pe.exec(n.source);)Oe.test(e[1])?(je.href=n.url,t=je.protocol+"//"+je.host+e[1]):t=d(n.url+"/../"+e[1]),n.source=n.source.replace(e[0],"//# sourceMappingURL="+t+".map")},process:function(){var n,r=this;r.source&&(n=t.createElement("script"),n.async=T,n.text=r.source,n.setAttribute("demand-id",r.id),e.appendChild(n))}}}();p.prototype={toString:function(){var e=this,t=R+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=p.traverse(e.stack,t,1)),t}},p.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=p.traverse(r.stack,t,n+1));return t};var Fe=function(){function e(e){for(var t,r,i=0;r=e[i];i++)if(r=r.match(Ie),r=r&&r[3]||n.handler,t){if(r!==t)return D}else t=r;return t}var t=k+"bundle",n={};return demand.on(Q+":"+t,function(e){var t,r;n=u(e)?e:{},c(n,function(e,n){for(t=0;r=n[t];t++)o(r,_)&&(n[t]=h(r))})}),{enqueue:D,validate:Xe.validate,onPreProcess:function(){function t(){f.reject(new p(ve,c.id,arguments))}var r,i,o,u,a,c=this,s=c.source,f=c.deferred,l=n[c.path];if(l&&(r=e(l))){for(;i=Pe.exec(s);)s=s.replace(i[0],"");for(c.source=s,o=[],a=0;u=l[a];a++)o.push(_e.resolve(C+u).pledge);Te.all(o).then(function(){for(o.length=0,a=0;u=l[a];a++)u=l[a]=_e.get(u)||new _e(u),u.handler=arguments[a],o.push(u.pledge);"module"===r?(w.enqueue.apply(w,l),Xe.process.call(c)):(Xe.process.call(c),w.enqueue.apply(w,l)),Te.all(o).then(f.resolve,t)},t)}else t()}}}();!function(){function e(e){for(var t,n,r=0;t=a[r];r++)0===e.indexOf(t.prefix)&&(!n||t.weight>n.weight)&&(n=t);return n}function t(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules[k+"bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}function n(){for(var e,t=0;e=this[t];t++)e.deferred.resolve(arguments[t])}function r(){for(var e,t=0;e=this[t];t++)e.deferred.reject(new p(ve,e.id))}var i=O+"genie",a=[];demand.on(Q+":"+i,function(e){u(e)&&(a.length=0,c(e,function(e,t){a.push({prefix:e,weight:e.length,fn:t})}))}).on(ne,function(u,a){var s,f,l,d,h={};for(s=0;f=u[s];s++)!o(f,_)||Ce.test(f)||_e.get(f,a)||(f=new _e(f,a,D),"module"===f.type&&!De.get(f)&&(l=e(f.path))&&(f.index=s,(h[l.prefix]||(h[l.prefix]={fn:l.fn,matches:[]})).matches.push(f)));c(h,function(e,o){if(d=o.matches,d.length>1){for(o.id=i+"/"+y(JSON.stringify(o.matches)),s=0;f=d[s];s++)!_e.get(f.uri)&&new _e(f.uri);demand.configure(t(o)),demand("bundle!"+o.id).then(n.bind(d),r.bind(d))}})})}(),w=new Ne,b=new Ue(w),x(k+"module",Xe),x(k+"bundle",Fe),x(M+"isTypeOf",o),x(M+"isArray",g),x(M+"isObject",u),x(M+"resolveUrl",d),x(M+"isInstanceOf",f),x(P+"merge",Re),x(P+"iterate",c),x(P+"hash",y),x(P+"defer",qe),x(E+"uuid",Se),x(E+"pledge",Te),x(E+"queue",Ne),x(E+"xhr",Le),x(E+"failure",p),n&&n.main&&demand(n.main)}(this,document,"demand"in this&&demand,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
