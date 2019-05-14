/**! Qoopido.demand 5.2.2 | https://github.com/dlueth/qoopido.demand | (c) 2019 Dirk Lueth */
!function(e,t,n){"use strict";var r,i,o,a,u=e.document,c="demand"in e&&e.demand,s={version:"1.0.0",cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},f="/demand/handler/",d="mock:",l=null,h=void 0,p=!1,v=!0,m="undefined",g="string",y="object",w="function",x="number",b="preConfigure",j="postConfigure",q="preResolve",k="postResolve",R="preRequest",E="postRequest",P="queueEnqueue",M="error loading",S="error resolving",C=Array.prototype,O=C.slice,A=C.concat,$=Object,I=$.prototype.toString,T=$.create,D=$.defineProperty,H=$.getOwnPropertyNames,N=$.getOwnPropertyDescriptor,L=u.createElement("a");function W(e,t,n,r){return{__proto__:l,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function z(e,t){return typeof e===t}function _(e){return e&&z(e,y)}function F(e){return z(e,x)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function U(e,t){return e instanceof t}!function(t){function n(e,t,n,r,i){D(this,e,new W(t,n,r,i))}function r(e){for(var n,r=this[t],i=H(r),o={constructor:new W(this,v,v)},a=0;(n=i[a])&&!o[n];a++)o[n]=N(r,n);try{this[t]=T(e[t]||e,o)}catch(e){}if(this[t]===r)throw new TypeError("Unable to extend, prototype is not writable");return this}n.call(Object.prototype,"define",n),n.call(e.Object.prototype,"define",n),Function.prototype.define("extends",r),e.Function.prototype.define("extends",r)}("prototype");var X,B=(X=/^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i,function(e){return z(e,g)&&X.test(e)});function G(e,t,n){for(var r,i=$.keys(e),o=0;(r=i[o])!==h&&t.call(n,r,e[r])!==p;o++);return n}var J,K,Q,V,Y=function(){function e(e,t){var n,r=this[e];t!==h&&(_(t)?(n=_(r),r=t.length!==h?n&&r.length!==h?r:[]:n&&r.length===h?r:{},this[e]=Y(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==h;r++)G(t,e,n);return n}}(),Z=function(){var e=new RegExp("[xy]","g");function t(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t)}}(),ee=(V="setImmediate"in e,"MutationObserver"in e?function(e){K=u.createElement("div"),new MutationObserver(function(){e()}).observe(K,{attributes:v}),K.setAttribute("i","1")}:!V&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?(J={},e.addEventListener("message",function(t){var n;t.source===e&&t.data&&(n=J[t.data])&&(n(),delete J[t.data])},p),function(t){var n=Z();J[n]=t,e.postMessage(n,"*")}):!V&&"onreadystatechange"in(K=u.createElement("script"))?function(e){K.onreadystatechange=function(){K.onreadystatechange=l,K.parentNode.removeChild(K),e()},u.body.appendChild(K)}:(Q=V?setImmediate:t,function(e){Q(e)}));function te(e,t,n){return O.call(e,t,n)}var ne=function(){var e="on",t=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,n={};function r(r,i,o){var a,u;if(z(i,g)&&z(o,w))for(i=i.split(" ");a=i.shift();)a=a.split(":"),t.test(a[0])&&((n[a[0]]||(n[a[0]]={on:[],after:[]}))[r].push({callback:o,filter:a[1]}),r===e&&a[0]===j&&(u=s.modules[a[1]])&&o(u))}function i(){}return i.prototype={emit:function(t,r){var i,o,a,u=n[t];if(u){for(i=te(arguments,2),o=0;a=u[e][o];o++)a.filter&&a.filter!==r||a.callback.apply(l,i);for(o=0;a=u.after[o];o++)a.filter&&a.filter!==r||a.callback.apply(l,i)}return this},on:function(t,n){return r(e,t,n),this},after:function(e,t){return r("after",e,t),this}},new i}(),re="WeakMap"in e?(new e.WeakMap).set(function(){},!1)instanceof e.WeakMap?e.WeakMap:function(){var t=new e.WeakMap;return t.set=function(){return e.WeakMap.prototype.set.apply(this,arguments),this},t}:function(){var e="weakmap-";function t(e,t){var n;if((n=t[e.id])&&n[0]===t)return n}function n(){this.define("id",e+Z())}return n.prototype={set:function(e,n){var r=t(this,e);return r?r[1]=n:e.define(this.id,[e,n]),this},get:function(e){var n=t(this,e);if(n)return n[1]},delete:function(e){var n=t(this,e);n&&(n.length=0,delete e[this.id])},has:function(e){return!!t(this,e)}},n}();function ie(){return z(this.uuid,m)&&this.define("uuid",Z()),this}var oe=function(){var e=new re;function t(){var t=ie.call(this);return e.set(t,[]),t}return t.prototype={enqueue:function(){var t=te(arguments);e.set(this,e.get(this).concat(t)),ne.emit(P,this.uuid,t)},dequeue:function(){var t=e.get(this).shift();return ne.emit("queueDequeue",this.uuid,t),t},get current(){return e.get(this)[0]},get length(){return e.get(this).length}},t.extends(ie)}(),ae=function(){var r,i="object"==typeof e.safari&&e.safari.pushNotification?"beforeunload":"visibilitychange",o=e.requestIdleCallback||function(e,n){var r=+new Date;return t(function(){e({didTimeout:p,timeRemaining:function(){return Math.max(0,50-(+new Date-r))}})},n&&n.timeout)},a=e.cancelIdleCallback||function(e){n(e)},c=new oe;function s(){c.dequeue()(),r=c.length&&o(s)}return e.addEventListener(i,function(e){var t;if(c.length&&("visibilitychange"!==e.type||"hidden"===u.visibilityState)){r=a(r);do{t&&t()}while(t=c.dequeue())}},v),function(e,t){c.enqueue(e),!r&&c.length&&(r=o(s,{timeout:t}))}}();function ue(){return+new Date}var ce,se=(ce=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,function(e){return e.replace(ce,"\\$&")});function fe(e){return L.href=e,L.href}var de=/^(http(s?):)?\/\//i,le=/^\//,he=/((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,pe=new RegExp("^"+se(fe("/"))),ve=new RegExp("^demand|provide|path$"),me=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;function ge(e,t){var n=e.replace(me,"");return le.test(n)||de.test(n)||(n="/"+fe((t&&fe(t+"/../")||"/")+n).replace(pe,"")),n}function ye(e,t){var n=e.match(me);return(n&&n[1]?"mock:":"")+(n&&n[3]||s.handler)+"!"+ge(e,t)}var we=function(){function e(e,t){return e<t?-1:e>t?1:0}function t(e){if(!B(e))throw new TypeError('"version" must be a valid semver version string');e=function(e){var t,n=e.split("-"),r=0;for(n=n[1]?Array.prototype.concat(n[0].split("."),n[1].split(".")):n[0].split(".");t=n[r];r++)n[r]=parseInt(t,10).toString()===t?parseInt(t,10):t;return n}(e),this.major=e.slice(0,1),this.minor=e.slice(1,2),this.patch=e.slice(2,3),this.identifier=e.slice(3)}return t.prototype={toString:function(){return this.major+"."+this.minor+"."+this.patch+(this.identifier.length?"-"+this.identifier.join("."):"")},compare:function(t){return e(this.major,t.major)||e(this.minor,t.minor)||e(this.patch,t.patch)||function(e,t){var n,r,i,o,a=0;if(e.length&&!t.length)return-1;if(!e.length&&t.length)return 1;if(!e.length&&!t.length)return 0;do{if(n=e[a],o=typeof(r=t[a]),(i=typeof n)===m&&o===m)return 0;if(o===m)return 1;if(i===m)return-1;if(n===r);else{if(i===g&&o!==g)return 1;if(i!==g&&o===g)return-1;if(n>r)return 1;if(n<r)return-1}}while(++a)}(this.identifier,t.identifier)}},t}(),xe=function(){var t,n=new RegExp("^"+se("[demand]")+"\\[(.+?)\\]"+se("[state]")+"$"),i=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/,o=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return p}}(),a=o?e.localStorage:l,u=o&&"remainingSpace"in a,c={};function f(e){var t;return e.cache!==l?e.cache:(G(s.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:p)}function d(e){return a.getItem(e)}function h(e,t){a[t?"setItem":"removeItem"](e,t)}function m(e){var t,n=d(e);if(n&&(t=n.match(i)))return te(t,1)}function g(e,t){t[4]=ue(),h(e,t.join(","))}function y(e,t,n){ne.emit(e,t.id,t,n)}function w(){ae(this.clear.expired.bind(this.clear),s.delay)}return ne.on("cacheMiss",function(e){ae(function(){t.clear(e.id)})}).on("cacheExceed",function(e){r("-!/demand/cache/dispose").then(function(n){ae(function(){n(e.source.length),t.set(e)},s.delay)})}).on(E,function(e){e.source&&f(e)&&(c[e.id]=v)}).after("postProcess",function(e){c[e.id]&&ae(function(){t.set(e)},s.delay)}),w.prototype={get:o?function(e){var t,n;if(f(e)){if(t="[demand]["+e.id+"]",!(n=m(t+"[state]")))return;return 1===e.version.compare(new we(n[0]))||n[2]&&e.lifetime&&n[2]<=ue()?void(e.invalid=!0):(e.source=d(t+"[value]"),ae(function(){g(t+"[state]",n)},s.delay),v)}}:function(){},resolve:o?function(e){this.get(e)?y("cacheHit",e):y("cacheMiss",e)}:function(e){y("cacheMiss",e)},set:o?function(e){var t,n,i;if(f(e)){t=[e.version,e.source.length,e.lifetime?ue()+e.lifetime:l,r.version],n="[demand]["+e.id+"]",y("preCache",e,t);try{if(i=u?a.remainingSpace:l,h(n+"[value]",e.source),g(n+"[state]",t),i!==l&&a.remainingSpace===i)throw new Error;y("postCache",e,t)}catch(t){y("cacheExceed",e)}}}:function(){},clear:o?function(e){var t=ye(e),n="[demand]["+t+"]";d(n+"[state]")&&(h(n+"[state]"),h(n+"[value]"),y("cacheClear",ke.get(t)||new ke(t,l,p)))}:function(){}},w.prototype.clear.all=o?function(){var e;G(a,function(t){(e=t.match(n))&&this(e[1])},this)}:function(){},w.prototype.clear.expired=o?function(){var e,t;G(a,function(r){(e=r.match(n))&&(t=m("[demand]["+e[1]+"][state]"))&&t[2]>0&&t[2]<=ue()&&this(e[1])},this)}:function(){},t=new w}(),be=function(){var e="pending",t="resolved",n="rejected",r=new re;function i(i,o){var a,u,c=r.get(this);for(c.state===e&&(c.state=i,c.value=o);a=c[c.state].shift();)(u=a.handler.apply(l,c.value))&&"function"==typeof u.then?u.then(a.dfd.resolve,a.dfd.reject):a.dfd[c.state===t?"resolve":"reject"].apply(l,c.value);c[t].length=0,c[n].length=0}function o(e,t,n){e.then(function(){n.resolved[t]=te(arguments),n.count++,a(n)},function(){n.rejected.push(te(arguments)),a(n)})}function a(e){e.count===e.total?e.dfd.resolve.apply(l,A.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.dfd.reject.apply(l,A.apply([],e.rejected))}function u(o){return r.set(this,{state:e,handle:i.bind(this),value:l,resolved:[],rejected:[],count:0}),o(function(){r.get(this).handle(t,arguments)}.bind(this),function(){r.get(this).handle(n,arguments)}.bind(this)),this}return u.prototype={catch:function(e){return this.then(function(){},e)},always:function(e){return this.then(e,e)},then:function(i,o){var a=r.get(this),c=u.defer();return i&&a[t].push({handler:i,dfd:c}),o&&a[n].push({handler:o,dfd:c}),a.state!==e&&ee(a.handle),c.pledge},isPending:function(){return r.get(this).state===e},isResolved:function(){return r.get(this).state===t},isRejected:function(){return r.get(this).state===n}},u.defer=function(){var e={};return e.pledge=new u(function(t,n){e.resolve=t,e.reject=n}),e},u.all=function(e){var t,n,r=u.defer(),i=0;if(e.length)for(t={dfd:r,resolved:[],rejected:[],total:e.length,count:0};n=e[i];i++)o(n,i,t);else r.resolve();return r.pledge},u.race=function(e){for(var t,n=u.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},u}(),je=function(){var e=new re;function t(){e.set(this,{})}return t.prototype={get:function(t){return t?e.get(this)[t]:e.get(this)},set:function(t,n){e.get(this)[t]=n},remove:function(t){delete e.get(this)[t]}},t}();function qe(e,t,n){return this.message=e,t&&(this.module=t),n&&(this.stack=te(n)),this}qe.prototype={toString:function(){var e="demand: "+this.message+" "+(this.module?'"'+this.module+'"':"");return this.stack&&(e=qe.traverse(this.stack,e,1)),e}},qe.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=qe.traverse(r.stack,t,n+1));return t};var ke=function(){var e=new je,t=/^(?:mock:|internal!)/i,n=[];function o(e,t){this[e]=t}function a(e){t.test(e)||this.push(e)}function c(e,n){!t.test(e)&&n.pledge.isPending()&&this.push(e)}function h(e,n){!t.test(e)&&n.pledge.isResolved()&&this.push(e)}function m(e,n){!t.test(e)&&n.pledge.isRejected()&&this.push(e)}function g(){return G(e.get(),a,[])}function y(t,r,i){var o=this,a=t.match(me)||n;return o.path=ge(t,r),o.mock=a[1]?v:p,o.cache=a[2]?"+"===a[1]:l,o.type=a[3]||s.handler,o.version=new we(a[4]||s.version),o.lifetime=a[5]&&1e3*a[5]||s.lifetime,o.id=(o.mock?d:"")+o.type+"!"+o.path,o.uri=(o.mock?d:"")+o.type+"@"+o.version+(F(o.lifetime)&&o.lifetime>0?"#"+o.lifetime:"")+"!"+o.path,o.dfd=be.defer(),o.pledge=o.dfd.pledge,o.invalid=!1,o.pledge.then(function(){o.value=te(arguments)}),i!==p&&e.set(o.id,o),o}return g.pending=function(){return G(e.get(),c,[])},g.resolved=function(){return G(e.get(),h,[])},g.rejected=function(){return G(e.get(),m,[])},y.prototype={enqueue:!0},y.get=function(t,n){return e.get(ye(t,n))},y.resolve=function(e,t){var n,a=t&&ve.test(e),u=a?this.get("internal!"+t+"/"+e):this.get(e,t);if(!u)if(a){switch(u=new y("internal!"+t+"/"+e),e){case"demand":n=G(r,o,r.bind(t));break;case"provide":n=i.bind(t);break;case"path":n=t}u.dfd.resolve(n)}else u=new y(e,t),r(f+u.type).then(function(e){u.handler=e,u.mock?u.dfd.resolve(e):xe.resolve(u)},function(){u.dfd.reject(new qe(M+" (handler)",self.id))});return u},y.remove=function(t,n,r){var i=ye(t,n),o=u.querySelector('[demand-id="'+i+'"]');e.remove(i),e.remove(d+i),o&&o.parentNode.removeChild(o),r!==p&&xe.clear(i)},y.list=g,y}(),Re=function(){var e=/(.+)\/$/;function t(t,n){this[t]={url:fe(n).replace(e,"$1"),match:new RegExp("^"+se(n))}}function n(e,n){this.weight=e.length,this.match=new RegExp("^"+se(e)),this.location=[].concat(n),G(this.location,t,this.location)}return n.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},n}(),Ee=function(r){var i="XDomainRequest"in e&&e.XDomainRequest||r;return function(e){var o,a=be.defer(),u=pe.test(e)?new r:new i,c=function(){this.readyState<4&&this.abort()}.bind(u),f=s.timeout;return u.ontimeout=u.onerror=u.onabort=function(){a.reject(u.status)},u.onprogress=u.onreadystatechange=function(){n(o),o=t(c,f)},u.onload=function(){o=n(o),"status"in u&&200!==u.status?a.reject(u.status):a.resolve(u.responseText,u.getResponseHeader&&u.getResponseHeader("content-type"))},u.open("GET",e,v),u.send(),o=t(c,f),a.pledge}}(XMLHttpRequest);function Pe(e){var t,n=/^(?:\?|)$/;function r(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.dfd.reject(new qe(M+" (content-type)",e.id)):(e.source=t,ne.emit(E,e.type,e))}function i(t){e.dfd.reject(new qe(M+(t?" (status)":""),e.id))}de.test(e.path)||G(s.pattern,function(n,r){r.matches(e.path)&&(!t||t.weight<r.weight)&&(t=r)}),function o(a){a=a||0,e.url=u.createElement("a"),e.url.href=t?fe(t.process(e.path,a)):e.path,e.invalid&&(e.url.search+=(n.test(e.url.search)?"":"&")+ue()),ne.emit(R,e.type,e),new Ee(e.url).then(r,t?function(){a++,t.location[a]?o(a):i()}:i)}()}function Me(e){return"[object Array]"===I.call(e)}function Se(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}r=function(){function t(e,t){this[e]={weight:e.length,state:t}}function n(e,t){"base"!==e&&(this[e]=new Re(e,t))}function r(e,t){var n=this[e]=this[e]||{};ne.emit(b,e,n),Y(n,t),ne.emit(j,e,n)}function i(){var t,n,r=te(arguments),i=this!==e?this:l,o=0;for(ne.emit(q,l,r,i);t=r[o];o++)z(t,g)?r[o]=ke.resolve(t,i).pledge:(r[o]=(n=be.defer()).pledge,n.resolve(t));return(r.length>1?be.all(r):r[0]).always(function(){ne.emit(k,l,r,i)})}return i.configure=function(e){var o=e.cache,a=e.version,u=e.delay,c=e.timeout,f=e.lifetime,d=e.base,l=e.pattern,h=e.modules,p=s.modules;return z(o,"boolean")?s.cache[""]={weight:0,state:o}:_(o)&&G(o,t,s.cache),B(a)&&(s.version=a),F(u)&&(s.delay=1e3*u),F(c)&&(s.timeout=1e3*Math.min(Math.max(c,2),20)),F(f)&&f>0&&(s.lifetime=1e3*f),z(d,g)&&""!==d&&(s.pattern.base=new Re("",d)),_(l)&&G(l,n,s.pattern),_(h)&&G(h,r,p),i},i.version="5.2.2",i.on=ne.on.bind(i),i.get=function(e,t){var n=ke.get(e,t);return n&&n.value},i.list=ke.list,i.remove=ke.remove,i.cache={clear:xe.clear},ne.after("cacheMiss",function(e){new Pe(e)}).after(E,function(e){var t=e.handler.onPostRequest;t&&t(e)}).after("cacheHit "+E,function(e){ne.emit("preProcess",e.id,e)}).after(R,function(e){var t=e.handler.onPreRequest;t&&t(e)}).after("preProcess",function(e){var t=e.handler.onPreProcess;t&&t(e),e.pledge.then(function(){ne.emit("postProcess",e.id,e)}),!0===e.enqueue?o.enqueue(e):U(e.enqueue,be)&&e.enqueue.then(function(){o.enqueue(e)})}),i}(),e.define("demand",r),i=function(){var t,n,i=z(arguments[0],g)?arguments[0]:l,o=this!==e?this:l,u=Me(arguments[i?1:0])?arguments[i?1:0]:l,c=u?arguments[i?2:1]:arguments[i?1:0];if(!i&&a.current&&(i=(t=a.current).uri,a.process()),i)return t=t||new ke(i,o),n=z(c,w),u?r.apply(t.path,u).then(function(){t.dfd.resolve(n?c.apply(l,arguments):c)},function(){t.dfd.reject(new qe("error providing",t.id,arguments))}):t.dfd.resolve(n?c():c),t.dfd.pledge;!z(console,m)&&console.error(new qe("unspecified anonymous provide"))},e.define("provide",i),r.configure({cache:v,base:"/",pattern:{"/demand":fe((c&&c.url||location.href)+"/../").slice(0,-1)}}),c&&c.settings&&r.configure(c.settings);var Ce=function(){var e=new re;function t(t){var n=this,i={queue:t,current:l};e.set(n,i),r.on(P+":"+t.uuid,function(){!i.current&&n.process()})}return t.prototype={process:function(){var t,n=e.get(this);!n.queue.length||(t=n.current=n.queue.dequeue()).pledge.isRejected()?n.current=l:t.handler.process&&t.handler.process(t)},get current(){return e.get(this).current}},t}();function Oe(e,t){for(var n,r;n=he.exec(t);)L.href=e,de.test(n[2])?r=L.protocol+"//"+L.host+n[3]:(L.pathname+="/../"+n[3],r=L.protocol+"//"+L.host+L.pathname),t=t.replace(n[0],n[1]+" "+n[2]+"="+r+".map"+(n[4]?" "+n[4]:""));return t}function Ae(){}Ae.prototype={validate:l,onPreRequest:l,onPostRequest:l,onPreProcess:l,process:l};var $e=function(){var e=u.getElementsByTagName("head")[0],t=/^(application|text)\/(x-)?javascript/;function n(){}return n.prototype={validate:function(e){return t.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=".js"!==t.slice(-".js".length)?t+".js":t},onPostRequest:function(e){e.source=Oe(e.url,e.source)},process:function(t){var n;t.source&&((n=u.createElement("script")).async=v,n.text=t.source,n.setAttribute("demand-id",t.id),e.appendChild(n))}},new(n.extends(Ae))}();function qe(e,t,n){return this.message=e,t&&(this.module=t),n&&(this.stack=te(n)),this}qe.prototype={toString:function(){var e="demand: "+this.message+" "+(this.module?'"'+this.module+'"':"");return this.stack&&(e=qe.traverse(this.stack,e,1)),e}},qe.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=qe.traverse(r.stack,t,n+1));return t};var Ie=function(){var e=f+"bundle",t={};function n(e,t){var n,r;for(n=0;r=t[n];n++)z(r,g)&&(t[n]=ye(r))}function i(){}return r.on(j+":"+e,function(e){_(e)&&G(t=e,n)}),i.prototype={validate:$e.validate,onPreProcess:function(e){var n,r,i,a,u,c=e.source,s=e.dfd,f=t[e.path];function l(){s.reject(new qe(S,e.id,arguments))}if(e.enqueue=p,f&&(n=function(e){for(var n,r,i=0;r=e[i];i++)if(r=(r=r.match(me))&&r[3]||t.handler,n){if(r!==n)return p}else n=r;return n}(f))){for(;r=he.exec(c);)c=c.replace(r[0],"");for(e.source=c,i=[],u=0;a=f[u];u++)i.push(ke.resolve(d+a).pledge);be.all(i).then(function(){for(i.length=0,u=0;a=f[u];u++)(a=f[u]=ke.get(a)||new ke(a)).handler=arguments[u],i.push(a.pledge);"module"===n?(o.enqueue.apply(o,f),$e.process(e)):($e.process(e),o.enqueue.apply(o,f)),be.all(i).then(s.resolve,l)},l)}else l()}},new(i.extends(Ae))}(),Te=function(){var e=/^text\/.+$/;function t(){}return t.prototype={validate:function(t){return e.test(t)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=".html"!==t.slice(-".html".length)?t+".html":t},onPostRequest:function(e){e.source=Oe(e.url,e.source)},onPreProcess:function(e){var t,n,r,i,a=e.path,c=e.dfd,s=u.createElement("body"),f=[],d=[];function l(){c.reject(new qe(S,e.id,arguments))}for(e.enqueue=p,s.innerHTML=e.source;t=s.firstElementChild;)(n=t.getAttribute("type"))&&(i=n+"!"+a+((r=t.getAttribute("path"))?"/"+r:""),t.parentNode.removeChild(t),f.push({source:t.textContent,uri:i}),d.push(ke.resolve("mock:"+i).pledge));be.all(d).then(function(){var e,t,n=0;for(d.length=0;e=f[n];n++)(t=ke.get(e.uri)||new ke(e.uri)).source=Oe(t.url,e.source),t.handler=arguments[n],d.push(t.pledge),o.enqueue(t);be.all(d).then(c.resolve,l)},l)}},new(t.extends(Ae))}(),De=function(){var e="/demand/plugin/genie",t=[];function n(e){for(var n,r,i=0;n=t[i];i++)0===e.indexOf(n.prefix)&&(!r||n.weight>r.weight)&&(r=n);return r}function i(e,n){t.push({prefix:e,weight:e.length,fn:n})}function o(t,n){var i,o=n.matches,a=0;if(o.length>1){for(n.id=e+"/"+Se(JSON.stringify(n.matches));i=o[a];a++)o[a]=new ke(i.uri);r.configure(function(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules[f+"bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}(n)),r("bundle!"+n.id).then(function(){for(var e,t=0;e=this[t];t++)e.dfd.resolve(arguments[t])}.bind(o),function(){for(var e,t=0;e=this[t];t++)e.dfd.reject(new qe(S,e.id))}.bind(o))}}return r.on(j+":"+e,function(e){_(e)&&(t.length=0,G(e,i))}).on(q,function(e,t){for(var r,i,a={},u=0;r=e[u];u++)!z(r,g)||ve.test(r)||ke.get(r,t)||"module"===(r=new ke(r,t,p)).type&&(i=n(r.path))&&!xe.get(r)&&(a[i.prefix]||(a[i.prefix]={fn:i.fn,matches:[]})).matches.push(r);G(a,o)}),v}();function He(e,t){i(e,function(){return t})}if(o=new oe,a=new Ce(o),He("/demand/abstract/uuid",ie),He("/demand/abstract/handler",Ae),He(f+"module",$e),He(f+"bundle",Ie),He(f+"component",Te),He("/demand/plugin/genie",De),He("/demand/validator/isTypeOf",z),He("/demand/validator/isArray",Me),He("/demand/validator/isObject",_),He("/demand/validator/isInstanceOf",U),He("/demand/validator/isSemver",B),He("/demand/function/resolveUrl",fe),He("/demand/function/resolveSourcemaps",Oe),He("/demand/function/merge",Y),He("/demand/function/iterate",G),He("/demand/function/hash",Se),He("/demand/function/defer",ee),He("/demand/function/idle",ae),He("/demand/function/uuid",Z),He("/demand/weakmap",re),He("/demand/descriptor",W),He("/demand/pledge",be),He("/demand/queue",oe),He("/demand/xhr",Ee),He("/demand/failure",qe),He("/demand/semver",we),c&&c.main)switch(typeof c.main){case g:r(c.main);break;case w:i("main",c.main())}}("demand-loader"===this.name?parent:this,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
