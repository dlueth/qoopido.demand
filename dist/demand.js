/**! Qoopido.demand 7.1.1 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(e,t,n){"use strict";var r,i,o,a,u=e.document,c="demand"in e&&e.demand,s={version:"1.0.0",cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},f="mock:",d=null,l=void 0,h=!1,p=!0,v="undefined",m="string",g="function",y="postConfigure",w="cacheMiss",x="cacheExceed",b="preResolve",j="postResolve",q="preRequest",k="postRequest",R="preProcess",P="postProcess",E="queueEnqueue",C="provide",M="reject",T="error loading",S="error providing",A="error resolving",O="unspecified anonymous provide",$=Array.prototype,I=$.slice,H=$.concat,N=Object,D=N.create,L=N.defineProperty,B=N.getOwnPropertyNames,U=N.getOwnPropertyDescriptor,z=u.createElement("a");function W(e,t,n,r){return{__proto__:d,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function _(e,t){return typeof e===t}function F(e){return e&&_(e,"object")}function X(e){return _(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function G(e,t){return e instanceof t}!function(t){function n(e,t,n,r,i){L(this,e,new W(t,n,r,i))}function r(e){for(var t,n=this,r=n.prototype,i=B(r),o={constructor:new W(n,p,p)},a=0;(t=i[a])&&!o[t];a++)o[t]=U(r,t);try{n.prototype=D(e.prototype||e,o)}catch(e){}if(n.prototype===r)throw new TypeError("Unable to extend, prototype is not writable");return n}n.call(Object.prototype,"defineProperty",n),n.call(e.Object.prototype,"defineProperty",n),Function.prototype.defineProperty("extends",r),e.Function.prototype.defineProperty("extends",r)}();var J,K=(J=/^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i,function(e){return _(e,m)&&J.test(e)});function Q(e,t,n){for(var r,i=N.keys(e),o=0;(r=i[o])!==l&&t.call(n,r,e[r])!==h;o++);return n}var V,Y,Z=function(){function e(e,t){var n,r=this[e];t!==l&&(F(t)?(n=F(r),r=t.length!==l?n&&r.length!==l?r:[]:n&&r.length===l?r:{},this[e]=Z(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==l;r++)Q(t,e,n);return n}}(),ee=function(){var e=new RegExp("[xy]","g");function t(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t)}}(),te="setImmediate"in e&&"function"==typeof e.setImmediate?e.setImmediate:"MutationObserver"in e&&"function"==typeof e.MutationObserver?(V={},Y=u.createElement("div"),new MutationObserver((function(e){e.forEach((function(e){var t=e.attributeName.substr(1);V[t]&&V[t](),delete V[t]}))})).observe(Y,{attributes:p}),function(e){var t=ee();V[t]=e,Y.setAttribute("i"+t,1)}):t;function ne(e,t,n){return I.call(e,t,n)}var re=function(){var e=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)|provide|reject$/,t={};function n(n,r,i){var o,a;if(_(r,m)&&_(i,g))for(r=r.split(" ");o=r.shift();)o=o.split(":"),e.test(o[0])&&((t[o[0]]||(t[o[0]]={on:[],after:[]}))[n].push({callback:i,filter:o[1]}),"on"===n&&o[0]===y&&(a=s.modules[o[1]])&&i(a))}function r(){}return r.prototype={emit:function(e,n){var r,i,o,a=t[e];if(a){for(r=ne(arguments,2),i=0;o=a.on[i];i++)o.filter&&o.filter!==n||o.callback.apply(d,r);for(i=0;o=a.after[i];i++)o.filter&&o.filter!==n||o.callback.apply(d,r)}return this},on:function(e,t){return n("on",e,t),this},after:function(e,t){return n("after",e,t),this}},new r}(),ie="WeakMap"in e&&!("ActiveXObject"in e)?e.WeakMap:function(e){var t=new e;function n(){t.set(this,new e)}return n.prototype={get:function(e){return t.get(this).get(e)},set:function(e,n){return t.get(this).set(e,n),this},has:function(e){return!!this.get(e)},delete:function(e){return t.get(this).delete(e)}},n}(e.WeakMap);function oe(){return _(this.uuid,v)&&this.defineProperty("uuid",ee()),this}var ae=function(){var e=new ie;function t(){var t=oe.call(this);return e.set(t,[]),t}return t.prototype={enqueue:function(){var t=ne(arguments);e.set(this,e.get(this).concat(t)),re.emit(E,this.uuid,t)},dequeue:function(){var t=e.get(this).shift();return re.emit("queueDequeue",this.uuid,t),t},get current(){return e.get(this)[0]},get length(){return e.get(this).length}},t.extends(oe)}(),ue=function(){var r,i="object"==typeof e.safari&&e.safari.pushNotification?"beforeunload":"visibilitychange",o=e.requestIdleCallback||function(e,n){var r=+new Date;return t((function(){e({didTimeout:h,timeRemaining:function(){return Math.max(0,50-(+new Date-r))}})}),n&&n.timeout)},a=e.cancelIdleCallback||function(e){n(e)},c=new ae;function s(){c.dequeue()(),r=c.length&&o(s)}return e.addEventListener(i,(function(e){var t;if(c.length&&("visibilitychange"!==e.type||"hidden"===u.visibilityState)){r=a(r);do{t&&t()}while(t=c.dequeue())}}),p),function(e,t){c.enqueue(e),!r&&c.length&&(r=o(s,{timeout:t}))}}();function ce(){return+new Date}function se(e){return z.href=e,z.href}var fe=/^(http(s?):)?\/\//i,de=/^\.?\.\//,le=/((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,he=/^\//,pe=/\.\w+$/,ve=new RegExp("^"+se("/")),me=new RegExp("^demand|provide|path|exports$"),ge=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;function ye(e,t){var n=e.replace(ge,"");return de.test(n)&&(n="/"+se((t&&se(t+"/../")||"/")+n).replace(ve,"")),n}function we(e,t){var n=e.match(ge);return(n&&n[1]?"mock:":"")+(n&&n[3]||s.handler)+"!"+ye(e,t)}var xe=function(){function e(e,t){return e<t?-1:e>t?1:0}function t(e){if(!K(e))throw new TypeError('"version" must be a valid semver version string');e=function(e){var t,n=e.split("-"),r=0;for(n=n[1]?Array.prototype.concat(n[0].split("."),n[1].split(".")):n[0].split(".");t=n[r];r++)n[r]=parseInt(t,10).toString()===t?parseInt(t,10):t;return n}(e),this.major=e.shift(),this.minor=e.shift(),this.patch=e.shift(),this.identifier=e}return t.prototype={toString:function(){return this.major+"."+this.minor+"."+this.patch+(this.identifier.length?"-"+this.identifier.join("."):"")},compare:function(t){return e(this.major,t.major)||e(this.minor,t.minor)||e(this.patch,t.patch)||function(e,t){var n,r,i,o,a=0;if(e.length&&!t.length)return-1;if(!e.length&&t.length)return 1;if(!e.length&&!t.length)return 0;do{if(n=e[a],o=typeof(r=t[a]),(i=typeof n)===v&&o===v)return 0;if(o===v)return 1;if(i===v)return-1;if(n===r);else{if(i===m&&o!==m)return 1;if(i!==m&&o===m)return-1;if(n>r)return 1;if(n<r)return-1}}while(++a)}(this.identifier,t.identifier)}},t}(),be=function(){var t,n="[state]",i="[value]",o=new RegExp("^[demand]\\[(.+?)\\][state]$"),a=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/,u=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return h}}(),c=u?e.localStorage:d,f=u&&"remainingSpace"in c,l={};function v(e){var t;return e.cache!==d?e.cache:(Q(s.cache,(function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)})),t?t.state:h)}function m(e){return c.getItem(e)}function g(e,t){c[t?"setItem":"removeItem"](e,t)}function y(e){var t,n=m(e);if(n&&(t=n.match(a)))return ne(t,1)}function b(e,t){t[4]=ce(),g(e,t.join(","))}function j(e,t,n){re.emit(e,t.id,t,n)}function q(){ue(this.clear.expired.bind(this.clear),s.delay)}return re.on(w,(function(e){ue((function(){t.clear(e.id)}))})).on(x,(function(e){r("-!/demand/cache/dispose").then((function(n){ue((function(){n(e.source.length),t.set(e)}),s.delay)}))})).on(k,(function(e){e.source&&v(e)&&(l[e.id]=p)})).after(P,(function(e){l[e.id]&&ue((function(){t.set(e)}),s.delay)})),q.prototype={get:u?function(e){var t,r;if(v(e)){if(t="[demand]["+e.id+"]",!(r=y(t+n)))return;return 1===e.version.compare(new xe(r[0]))||r[2]&&e.lifetime&&r[2]<=ce()?void(e.invalid=!0):(e.source=m(t+i),ue((function(){b(t+n,r)}),s.delay),p)}}:function(){},resolve:u?function(e){this.get(e)?j("cacheHit",e):j(w,e)}:function(e){j(w,e)},set:u?function(e){var t,o,a;if(v(e)){t=[e.version,e.source.length,e.lifetime?ce()+e.lifetime:d,r.version],o="[demand]["+e.id+"]",j("preCache",e,t);try{if(a=f?c.remainingSpace:d,g(o+i,e.source),b(o+n,t),a!==d&&c.remainingSpace===a)throw new Error;j("postCache",e,t)}catch(t){j(x,e)}}}:function(){},clear:u?function(e){var t=we(e),r="[demand]["+t+"]";m(r+n)&&(g(r+n),g(r+i),j("cacheClear",Ee.get(t)||new Ee(t,d,h)))}:function(){}},q.prototype.clear.all=u?function(){var e;Q(c,(function(t){(e=t.match(o))&&this(e[1])}),this)}:function(){},q.prototype.clear.expired=u?function(){var e,t;Q(c,(function(r){(e=r.match(o))&&(t=y("[demand]["+e[1]+"]"+n))&&t[2]>0&&t[2]<=ce()&&this(e[1])}),this)}:function(){},t=new q}();function je(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=ne(n)),r}je.prototype={toString:function(){var e=this,t=e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=je.traverse(e.stack,t,1)),t}},je.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=je.traverse(r.stack,t,n+1));return t};var qe,ke,Re=function(){var e="pending",t="resolved",n="rejected",r=new ie;function i(){var e=this,n=arguments;te((function(){r.get(e).handle(t,n)}))}function o(){var e=this,t=arguments;te((function(){r.get(e).handle(n,t)}))}function a(n,i){var o,a,u=r.get(this);for(u.state===e&&(u.state=n,u.value=i);o=u[u.state].shift();)try{if(G(a=o.handler.apply(d,u.value),s)){a.then(o.dfd.resolve,o.dfd.reject);continue}if(u.state===t&&_(a,v)){o.dfd.resolve.apply(d,u.value);continue}o.dfd.resolve(a)}catch(e){o.dfd.reject(e)}u.resolved.length=0,u.rejected.length=0}function u(e,t,n){e.then((function(){n.resolved[t]=ne(arguments),n.count++,c(n)}),(function(){n.rejected.push(ne(arguments)),c(n)}))}function c(e){e.count===e.total?e.dfd.resolve.apply(d,H.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.dfd.reject.apply(d,H.apply([],e.rejected))}function s(t){var n=this;return r.set(n,{state:e,handle:a.bind(n),value:d,resolved:[],rejected:[],count:0}),t(i.bind(n),o.bind(n)),n}return s.prototype={isPending:function(){return r.get(this).state===e},isResolved:function(){return r.get(this).state===t},isRejected:function(){return r.get(this).state===n},then:function(t,n){var i=r.get(this),o=s.defer();return i.resolved.push({handler:t||s.resolve,dfd:o}),i.rejected.push({handler:n||s.reject,dfd:o}),i.state!==e&&te(i.handle),o.pledge},catch:function(e){return this.then(l,e)},always:function(e){return this.then(e,e)}},s.prototype.finally=s.prototype.always,s.defer=function(){var e={};return e.pledge=new s((function(t,n){e.resolve=t,e.reject=n})),e},s.all=function(e){var t,n,r=s.defer(),i=0;if(e.length)for(t={dfd:r,resolved:[],rejected:[],total:e.length,count:0};n=e[i];i++)u(n,i,t);else r.resolve();return r.pledge},s.race=function(e){for(var t,n=s.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},s.resolve=function(){var e=s.defer();return e.resolve.apply(d,arguments),e.pledge},s.reject=function(){var e=s.defer();return e.reject.apply(d,arguments),e.pledge},s}(),Pe=function(){var e=new ie;function t(){e.set(this,{})}return t.prototype={get:function(t){return t?e.get(this)[t]:e.get(this)},set:function(t,n){e.get(this)[t]=n},remove:function(t){delete e.get(this)[t]}},t}(),Ee=function(){var e="internal!",t=new Pe,n=/^(?:mock:|internal!)/i,o=[];function a(e,t){this[e]=t}function c(e){n.test(e)||this.push(e)}function l(e,t){!n.test(e)&&t.pledge.isPending()&&this.push(e)}function v(e,t){!n.test(e)&&t.pledge.isResolved()&&this.push(e)}function m(e,t){!n.test(e)&&t.pledge.isRejected()&&this.push(e)}function g(){return Q(t.get(),c,[])}function y(e,n,r){var i=this,a=e.match(ge)||o;return i.path=ye(e,n),i.mock=a[1]?p:h,i.cache=a[2]?"+"===a[1]:d,i.type=a[3]||s.handler,i.version=new xe(a[4]||s.version),i.lifetime=a[5]&&1e3*a[5]||s.lifetime,i.id=(i.mock?f:"")+i.type+"!"+i.path,i.uri=(i.mock?f:"")+i.type+"@"+i.version+(X(i.lifetime)&&i.lifetime>0?"#"+i.lifetime:"")+"!"+i.path,i.dfd=Re.defer(),i.pledge=i.dfd.pledge,i.invalid=!1,i.pledge.then((function(){i.value=ne(arguments)})),r!==h&&t.set(i.id,i),i}return g.pending=function(){return Q(t.get(),l,[])},g.resolved=function(){return Q(t.get(),v,[])},g.rejected=function(){return Q(t.get(),m,[])},y.prototype={enqueue:!0},y.get=function(e,n){return t.get(we(e,n))},y.resolve=function(t,n){var o,u=n&&me.test(t),c=u?this.get(e+n+"/"+t):this.get(t,n);if(!c)if(u){switch(c=new y(e+n+"/"+t),t){case"demand":o=Q(r,a,r.bind(n));break;case"provide":o=i.bind(n);break;case"path":o=n;break;case"exports":o={},c.dfd.pledge.then(this.get(n).dfd.resolve)}c.dfd.resolve(o)}else c=new y(t,n),r("/demand/handler/"+c.type).then((function(e){c.handler=e,c.mock?c.dfd.resolve(e):be.resolve(c)}),(function(){c.dfd.reject(new je(T+" (handler)",self.id))}));return c},y.remove=function(e,n,r){var i=we(e,n),o=u.querySelector('[demand-id="'+i+'"]');t.remove(i),t.remove(f+i),o&&o.parentNode.removeChild(o),r!==h&&be.clear(i)},y.list=g,y}(),Ce=function(){var e=/(.+)\/$/;function t(t,n){this[t]={url:se(n).replace(e,"$1"),match:new RegExp("^"+n)}}function n(e,n){var r=this;r.weight=e.length,r.match=new RegExp("^"+e),r.location=[].concat(n),Q(r.location,t,r.location)}return n.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},n}(),Me=function(){var e={};function t(e){return e instanceof ArrayBuffer||e instanceof MessagePort||"ImageBitmap"in self&&e instanceof ImageBitmap}return function(n){var r,i;return r="$task = "+n+"; $isTransferable = "+t+"; onmessage = "+function(e){var t,n=Array.prototype.slice,r=e.data;function i(e){t||(t=!0,postMessage([r[0],0,e.toString()]))}try{$task.apply($task,[function(){var e;t||(t=!0,e=n.call(arguments),postMessage([r[0],1,e],e.filter($isTransferable)))},i].concat(r[1]))}catch(e){i(e)}},(i=new Worker(URL.createObjectURL(new Blob([r],{type:"application/javascript"})))).onmessage=function(t){var n=t.data[0],r=n?e[n]:null;n&&r&&(t.data[1]?r.resolve.apply(null,t.data[2]):r.reject(t.data[2]),delete e[n])},function(){var n=Re.defer(),r=ee(),o=ne(arguments);return e[r]=n,i.postMessage([r,o],o.filter(t)),n.pledge}}}(),Te=(qe=/^(?:\?|)$/,ke=new Me((function(e,t,n){var r,i,o=new XMLHttpRequest;r=function(){this.readyState<4&&this.abort()}.bind(o),o.ontimeout=o.onerror=o.onabort=function(){t(o.statusText)},o.onprogress=o.onreadystatechange=function(){self.clearTimeout(i),i=self.setTimeout(r,1e4)},o.onload=function(){i=self.clearTimeout(i),"status"in o&&200!==o.status?t(o.statusText):e(o.responseText,o.getResponseHeader&&o.getResponseHeader("content-type"))},o.open("GET",n,!0),o.send(),i=self.setTimeout(r,1e4)})),function(e){var t;function n(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.dfd.reject(new je(T+" (content-type)",e.id)):(e.source=t,re.emit(k,e.type,e))}fe.test(e.path)||Q(s.pattern,(function(n,r){r.matches(e.path)&&(!t||t.weight<r.weight)&&(t=r)})),function r(i){i=i||0,e.url=u.createElement("a"),e.url.href=t?se(t.process(e.path,i)):e.path,re.emit(q,e.type,e),(e.invalid||!1===e.cache)&&(e.url.search+=(qe.test(e.url.search)?"":"&")+ce()),ke(e.url.href).then(n,(function(n){var o;i++,t&&t.location[i]?r(i):(o=n,e.dfd.reject(new je(T+(o?" (status)":""),e.id)))}))}()});function Se(e){return Array.isArray(e)}function Ae(e){return e&&_(e.then,g)}function Oe(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}r=function(){function t(e,t){this[e]={weight:e.length,state:t}}function n(e,t){"base"!==e&&(this[e]=new Ce(e,t))}function r(e,t){var n=this[e]=this[e]||{};re.emit("preConfigure",e,n),Z(n,t),re.emit(y,e,n)}function i(){var t,n,r,i=ne(arguments),o=this!==e?this:d,a=[],u=0;for(re.emit(b,d,i,o);t=i[u];u++)_(t,m)?i[u]=Ee.resolve(t,o):(i[u]=n=Re.defer(),n.resolve(t)),a.push(i[u].pledge);return(r=i.length>1?Re.all(a):a[0]).always((function(){if(re.emit(j,d,a,o),r.isRejected())return Q(i,(function(e,t){t.pledge.isRejected()&&re.emit(M,t.path,t)})),Re.reject.apply(null,arguments)}))}return i.configure=function(e){var o=e.cache,a=e.version,u=e.delay,c=e.timeout,f=e.lifetime,d=e.base,l=e.pattern,h=e.modules,p=s.modules;return _(o,"boolean")?s.cache[""]={weight:0,state:o}:F(o)&&Q(o,t,s.cache),K(a)&&(s.version=a),X(u)&&(s.delay=1e3*u),X(c)&&(s.timeout=1e3*Math.min(Math.max(c,2),20)),X(f)&&f>0&&(s.lifetime=1e3*f),_(d,m)&&""!==d&&(s.pattern.base=new Ce("",d)),F(l)&&Q(l,n,s.pattern),F(h)&&Q(h,r,p),i},i.version="7.1.1",i.on=re.on.bind(i),i.get=function(e,t){var n=Ee.get(e,t);return n&&n.value},i.list=Ee.list,i.remove=Ee.remove,i.cache={clear:be.clear},re.after(w,(function(e){new Te(e)})).after(k,(function(e){var t=e.handler.onPostRequest;t&&t(e)})).after("cacheHit postRequest",(function(e){re.emit(R,e.id,e)})).after(q,(function(e){var t=e.handler.onPreRequest;t&&t(e)})).after(R,(function(e){var t=e.handler.onPreProcess;t&&t(e),e.pledge.then((function(){re.emit(P,e.id,e)})),!0===e.enqueue?o.enqueue(e):G(e.enqueue,Re)&&e.enqueue.then((function(){o.enqueue(e)}))})),i}(),e.defineProperty("demand",r),(i=function(){var t,n,i,o=_(arguments[0],m)?arguments[0]:d,u=this!==e?this:d,c=Se(arguments[o?1:0])?arguments[o?1:0]:d,s=c?arguments[o?2:1]:arguments[o?1:0];if(a.current&&(o=(t=a.current).uri,a.process()),o)return t=t||new Ee(o,u),n=Ae(s),i=_(s,g),c&&c.length?r.apply(t.path,c).then((function(){var e;if(i)try{Ae(e=s.apply(d,arguments))?e.then(t.dfd.resolve,(function(){t.dfd.reject(new je(S,t.id,arguments))})):t.dfd.resolve(e)}catch(e){t.dfd.reject(new je(S,t.id,arguments))}else t.dfd.resolve(s)}),(function(){t.dfd.reject(new je(S,t.id,arguments))})):n?s.then(t.dfd.resolve,t.dfd.reject):t.dfd.resolve(i?s():s),t.dfd.pledge.then((function(){re.emit(C,t.path,t)})),t.dfd.pledge;throw new Error(O)}).amd=!0,e.defineProperty("provide",i),r.configure({cache:p,base:"/",pattern:{"/demand":se((c&&c.url||location.href)+"/../").slice(0,-1)}}),c&&c.settings&&r.configure(c.settings);var $e=function(){var e=new ie;function t(t){var n=this,i={queue:t,current:d};e.set(n,i),r.on("queueEnqueue:"+t.uuid,(function(){!i.current&&n.process()}))}return t.prototype={process:function(){var t,n=e.get(this);n.queue.length&&(t=n.current=n.queue.dequeue()).pledge.isPending()?t.handler.process&&t.handler.process(t):n.current=d},get current(){return e.get(this).current}},t}();function Ie(e,t){for(var n,r;n=le.exec(t);)fe.test(n[3])?r=e.protocol+"//"+e.host+n[3]:(e.pathname+=(pe.test(e.pathname)?"/../":"/")+n[3].replace(he,""),r=e.protocol+"//"+e.host+e.pathname),t=t.replace(n[0],n[1]+" "+n[2]+"="+r+".map"+(n[4]?" "+n[4]:""));return t}function He(){}He.prototype={validate:d,onPreRequest:d,onPostRequest:d,onPreProcess:d,process:d};var Ne=function(){var t=u.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/,o={umd:!1,suffix:".js"};function a(){}return r.on("postConfigure:/demand/handler/module",(function(e){F(e)&&Z(o,e)})),a.prototype={validate:function(e){return n.test(e)},onPreRequest:function(e,t){var n;(t=typeof t!==v?t:o.suffix)&&0!==e.path.indexOf("@")&&(n=e.url.pathname,e.url.pathname=n.slice(-t.length)!==t?n+t:n)},onPostRequest:function(e){e.source=Ie(e.url,e.source)},process:function(n){var r,a;n.source&&((r=u.createElement("script")).async=p,r.text=n.source,r.setAttribute("demand-id",n.id),o.umd&&(a=e.define,e.define=i),t.appendChild(r),o.umd&&(e.define=a))}},new(a.extends(He))}();function je(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=ne(n)),r}je.prototype={toString:function(){var e=this,t=e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=je.traverse(e.stack,t,1)),t}},je.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=je.traverse(r.stack,t,n+1));return t};var De=function(){var e={};function t(e,t){var n,r;for(n=0;r=t[n];n++)_(r,m)&&(t[n]=we(r))}function n(){}return r.on("postConfigure:/demand/handler/bundle",(function(n){F(n)&&Q(e=n,t)})),n.prototype={validate:Ne.validate,onPreProcess:function(t){var n,r,i,a,u,c=t.source,s=t.dfd,d=e[t.path];function l(){s.reject(new je(A,t.id,arguments))}if(t.enqueue=h,d&&(n=function(t){for(var n,r,i=0;r=t[i];i++)if(r=(r=r.match(ge))&&r[3]||e.handler,n){if(r!==n)return h}else n=r;return n}(d))){for(;r=le.exec(c);)c=c.replace(r[0],"");for(t.source=c,i=[],u=0;a=d[u];u++)i.push(Ee.resolve(f+a).pledge);Re.all(i).then((function(){for(i.length=0,u=0;a=d[u];u++)(a=d[u]=Ee.get(a)||new Ee(a)).handler=arguments[u],i.push(a.pledge);"module"===n?(o.enqueue.apply(o,d),Ne.process(t)):(Ne.process(t),o.enqueue.apply(o,d)),Re.all(i).then(s.resolve,l)}),l)}else l()}},new(n.extends(He))}(),Le=function(){var e=/^text\/.+$/,t={suffix:".html"};function n(){}return r.on("postConfigure:/demand/handler/component",(function(e){F(e)&&Z(t,e)})),n.prototype={validate:function(t){return e.test(t)},onPreRequest:function(e,n){var r;(n=typeof n!==v?n:t.suffix)&&(r=e.url.pathname,e.url.pathname=r.slice(-n.length)!==n?r+n:r)},onPostRequest:function(e){e.source=Ie(e.url,e.source)},onPreProcess:function(e){var t,n,r,i,a=e.path,c=e.dfd,s=u.createElement("body"),f=[],d=[];function l(){c.reject(new je(A,e.id,arguments))}for(e.enqueue=h,s.innerHTML=e.source;t=s.firstElementChild;)(n=t.getAttribute("type"))&&(i=n+"!"+a+((r=t.getAttribute("path"))?"/"+r:""),t.parentNode.removeChild(t),f.push({source:t.textContent,uri:i}),d.push(Ee.resolve("mock:"+i).pledge));Re.all(d).then((function(){var t,n,r,i=[];for(d.length=0,t=0;n=f[t];t++)(r=Ee.get(n.uri)||new Ee(n.uri)).source=Ie(r.url,n.source),r.handler=arguments[t],i.push(r),d.push(r.pledge),o.enqueue(r);Re.all(d).then((function(){var r=e.path.length+1,o={};for(t=0;n=arguments[t];t++)o[i[t].path.substr(r)||"main"]=n;c.resolve(o)}),l)}),l)}},new(n.extends(He))}(),Be=function(){var e="/demand/plugin/genie",t=[];function n(e){for(var n,r,i=0;n=t[i];i++)n.prefix.test(e)&&(!r||n.weight>r.weight)&&(r=n);return r}function i(){for(var e,t=0;e=this[t];t++)e.dfd.resolve(arguments[t])}function o(){for(var e,t=0;e=this[t];t++)e.dfd.reject(new je(A,e.id))}function a(e,n){t.push({prefix:new RegExp("^"+e),weight:e.length,fn:n})}function u(t,n){var a,u=n.matches,c=0;if(u.length>1){for(n.id=e+"/"+Oe(JSON.stringify(n.matches));a=u[c];c++)u[c]=new Ee(a.uri);r.configure(function(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules["/demand/handler/bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}(n)),r("bundle!"+n.id).then(i.bind(u),o.bind(u))}}return r.on("postConfigure:"+e,(function(e){F(e)&&(t.length=0,Q(e,a))})).on(b,(function(e,t){for(var r,i,o={},a=0;r=e[a];a++)!_(r,m)||me.test(r)||Ee.get(r,t)||"module"===(r=new Ee(r,t,h)).type&&(i=n(r.path))&&!be.get(r)&&(o[i.prefix]||(o[i.prefix]={fn:i.fn,matches:[]})).matches.push(r);Q(o,u)})),p}();function Ue(e,t){i(e,(function(){return t}))}if(o=new ae,a=new $e(o),Ue("/demand/abstract/uuid",oe),Ue("/demand/abstract/handler",He),Ue("/demand/handler/module",Ne),Ue("/demand/handler/bundle",De),Ue("/demand/handler/component",Le),Ue("/demand/plugin/genie",Be),Ue("/demand/validator/isTypeOf",_),Ue("/demand/validator/isArray",Se),Ue("/demand/validator/isObject",F),Ue("/demand/validator/isInstanceOf",G),Ue("/demand/validator/isSemver",K),Ue("/demand/validator/isThenable",Ae),Ue("/demand/function/resolveUrl",se),Ue("/demand/function/resolveSourcemaps",Ie),Ue("/demand/function/merge",Z),Ue("/demand/function/iterate",Q),Ue("/demand/function/hash",Oe),Ue("/demand/function/defer",te),Ue("/demand/function/idle",ue),Ue("/demand/function/uuid",ee),Ue("/demand/function/toArray",ne),Ue("/demand/task",Me),Ue("/demand/weakmap",ie),Ue("/demand/descriptor",W),Ue("/demand/pledge",Re),Ue("/demand/queue",ae),Ue("/demand/failure",je),Ue("/demand/semver",xe),c&&c.main)switch(typeof c.main){case m:r(c.main);break;case g:i("main",c.main())}}("demand-loader"===this.name?parent:this,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
