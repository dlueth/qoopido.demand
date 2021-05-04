/**! Qoopido.demand 7.2.0 | https://github.com/dlueth/qoopido.demand | (c) 2021 Dirk Lueth */
!function(e,t,n){"use strict";var r,i,o,a,u=e.document,c="demand"in e&&e.demand,s={version:"1.0.0",cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},f="mock:",d=null,l=void 0,h=!1,p=!0,v="undefined",m="string",g="function",y="postConfigure",w="cacheMiss",b="cacheExceed",x="preResolve",j="postResolve",q="preRequest",k="postRequest",R="preProcess",P="postProcess",E="queueEnqueue",M="provide",C="reject",T="error loading",A="error providing",S="error resolving",$="unspecified anonymous provide",I=Array.prototype,O=I.slice,H=I.concat,N=Object,D=N.create,L=N.defineProperty,B=N.getOwnPropertyNames,U=N.getOwnPropertyDescriptor,z=u.createElement("a"),F=e.requestAnimationFrame;function W(e,t){return typeof e===t}function _(e){return e&&W(e,"object")}function X(e){return W(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function G(e){return e&&W(e.then,g)}L(e.Function.prototype,"extends",{value:function(e){for(var t,n=this,r=n.prototype,i=B(r),o={constructor:{value:n}},a=0;(t=i[a])&&!o[t];a++)o[t]=U(r,t);try{n.prototype=D(e.prototype||e,o)}catch(e){}if(n.prototype===r)throw new TypeError("Unable to extend, prototype is not writable");return n},configurable:h,writable:h});var J,K=(J=/^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i,function(e){return W(e,m)&&J.test(e)});function Q(e,t,n){for(var r,i=N.keys(e),o=0;(r=i[o])!==l&&t.call(n,r,e[r])!==h;o++);return n}var V=function(){function e(e,t){var n,r=this[e];t!==l&&(_(t)?(n=_(r),r=t.length!==l?n&&r.length!==l?r:[]:n&&r.length===l?r:{},this[e]=V(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==l;r++)Q(t,e,n);return n}}();function Y(e,t,n){return O.call(e,t,n)}var Z=function(){var e=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)|provide|reject$/,t={};function n(n,r,i){var o,a;if(W(r,m)&&W(i,g))for(r=r.split(" ");o=r.shift();)o=o.split(":"),e.test(o[0])&&((t[o[0]]||(t[o[0]]={on:[],after:[]}))[n].push({callback:i,filter:o[1]}),"on"===n&&o[0]===y&&(a=s.modules[o[1]])&&i(a))}function r(){}return r.prototype={emit:function(e,n){var r,i,o,a=t[e];if(a){for(r=Y(arguments,2),i=0;o=a.on[i];i++)o.filter&&o.filter!==n||o.callback.apply(d,r);for(i=0;o=a.after[i];i++)o.filter&&o.filter!==n||o.callback.apply(d,r)}return this},on:function(e,t){return n("on",e,t),this},after:function(e,t){return n("after",e,t),this}},new r}();function ee(){return+new Date}var te,ne,re=function(){var e=new RegExp("[xy]","g");function t(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t)}}(),ie="setImmediate"in e&&"function"==typeof e.setImmediate?e.setImmediate:"MutationObserver"in e&&"function"==typeof e.MutationObserver?(te={},ne=u.createElement("div"),new MutationObserver((function(e){e.forEach((function(e){var t=e.attributeName.substr(1);te[t]&&te[t](),delete te[t]}))})).observe(ne,{attributes:p}),function(e){var t=re();te[t]=e,ne.setAttribute("i"+t,1)}):t,oe="WeakMap"in e&&!("ActiveXObject"in e)?e.WeakMap:function(e){var t=new e;function n(){t.set(this,new e)}return n.prototype={get:function(e){return t.get(this).get(e)},set:function(e,n){return t.get(this).set(e,n),this},has:function(e){return!!this.get(e)},delete:function(e){return t.get(this).delete(e)}},n}(e.WeakMap);function ae(){return W(this.uuid,v)&&L(this,"uuid",{value:re(),configurable:h,writable:h}),this}var ue=function(){var e=new oe;function t(){var t=ae.call(this);return e.set(t,[]),t}return t.prototype={enqueue:function(){var t=Y(arguments);e.set(this,e.get(this).concat(t)),Z.emit(E,this.uuid,t)},dequeue:function(){var t=e.get(this).shift();return t&&Z.emit("queueDequeue",this.uuid,t),t},get current(){return e.get(this)[0]},get length(){return e.get(this).length}},t.extends(ae)}(),ce=function(){var r,i="object"==typeof e.safari&&e.safari.pushNotification?"beforeunload":"visibilitychange",o=e.requestIdleCallback||function(e,n){var r=+new Date;return t((function(){e({didTimeout:h,timeRemaining:function(){return Math.max(0,50-(+new Date-r))}})}),n&&n.timeout)},a=e.cancelIdleCallback||function(e){n(e)},c=new ue;function s(){c.dequeue()(),r=c.length&&o(s)}return e.addEventListener(i,(function(e){var t;if(c.length&&("visibilitychange"!==e.type||"hidden"===u.visibilityState))for(r=a(r);t=c.dequeue();)t()}),p),function(e){c.enqueue(e),!r&&c.length&&(r=o(s))}}();function se(e){return z.href=e,z.href}var fe=/^(http(s?):)?\/\//i,de=/^\.?\.\//,le=/((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,he=/^\//,pe=/\.\w+$/,ve=new RegExp("^"+se("/")),me=new RegExp("^demand|provide|path|exports$"),ge=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;function ye(e,t){var n=e.replace(ge,"");return de.test(n)&&(n="/"+se((t&&se(t+"/../")||"/")+n).replace(ve,"")),n}function we(e,t){var n=e.match(ge);return(n&&n[1]?"mock:":"")+(n&&n[3]||s.handler)+"!"+ye(e,t)}var be=function(){function e(e,t){return e<t?-1:e>t?1:0}function t(e){if(!K(e))throw new TypeError('"version" must be a valid semver version string');e=function(e){var t,n=e.split("-"),r=0;for(n=n[1]?Array.prototype.concat(n[0].split("."),n[1].split(".")):n[0].split(".");t=n[r];r++)n[r]=parseInt(t,10).toString()===t?parseInt(t,10):t;return n}(e),this.major=e.shift(),this.minor=e.shift(),this.patch=e.shift(),this.identifier=e}return t.prototype={toString:function(){return this.major+"."+this.minor+"."+this.patch+(this.identifier.length?"-"+this.identifier.join("."):"")},compare:function(t){return e(this.major,t.major)||e(this.minor,t.minor)||e(this.patch,t.patch)||function(e,t){var n,r,i,o,a=0;if(e.length&&!t.length)return-1;if(!e.length&&t.length)return 1;if(!e.length&&!t.length)return 0;do{if(n=e[a],o=typeof(r=t[a]),(i=typeof n)===v&&o===v)return 0;if(o===v)return 1;if(i===v)return-1;if(n===r);else{if(i===m&&o!==m)return 1;if(i!==m&&o===m)return-1;if(n>r)return 1;if(n<r)return-1}}while(++a)}(this.identifier,t.identifier)}},t}(),xe=function(){var t,n="[state]",i="[value]",o=new RegExp("^[demand]\\[(.+?)\\][state]$"),a=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/,u=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return h}}(),c=u?e.localStorage:d,f=u&&"remainingSpace"in c,l={};function v(e){var t;return e.cache!==d?e.cache:(Q(s.cache,(function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)})),t?t.state:h)}function m(e){return c.getItem(e)}function g(e,t){c[t?"setItem":"removeItem"](e,t)}function y(e){var t,n=m(e);if(n&&(t=n.match(a)))return Y(t,1)}function x(e,t){t[4]=ee(),g(e,t.join(","))}function j(e,t,n){Z.emit(e,t.id,t,n)}function q(){ce(this.clear.expired.bind(this.clear),s.delay)}return Z.on(w,(function(e){ce((function(){t.clear(e.id)}))})).on(b,(function(e){r("-!/demand/cache/dispose").then((function(n){ce((function(){n(e.source.length),t.set(e)}),s.delay)}))})).on(k,(function(e){e.source&&v(e)&&(l[e.id]=p)})).after(P,(function(e){l[e.id]&&ce((function(){t.set(e)}),s.delay)})),q.prototype={get:u?function(e){var t,r;if(v(e)){if(t="[demand]["+e.id+"]",!(r=y(t+n)))return;return 1===e.version.compare(new be(r[0]))||r[2]&&e.lifetime&&r[2]<=ee()?void(e.invalid=!0):(e.source=m(t+i),ce((function(){x(t+n,r)}),s.delay),p)}}:function(){},resolve:u?function(e){this.get(e)?j("cacheHit",e):j(w,e)}:function(e){j(w,e)},set:u?function(e){var t,o,a;if(v(e)){t=[e.version,e.source.length,e.lifetime?ee()+e.lifetime:d,r.version],o="[demand]["+e.id+"]",j("preCache",e,t);try{if(a=f?c.remainingSpace:d,g(o+i,e.source),x(o+n,t),a!==d&&c.remainingSpace===a)throw new Error;j("postCache",e,t)}catch(t){j(b,e)}}}:function(){},clear:u?function(e){var t=we(e),r="[demand]["+t+"]";m(r+n)&&(g(r+n),g(r+i),j("cacheClear",Ee.get(t)||new Ee(t,d,h)))}:function(){}},q.prototype.clear.all=u?function(){var e;Q(c,(function(t){(e=t.match(o))&&this(e[1])}),this)}:function(){},q.prototype.clear.expired=u?function(){var e,t;Q(c,(function(r){(e=r.match(o))&&(t=y("[demand]["+e[1]+"]"+n))&&t[2]>0&&t[2]<=ee()&&this(e[1])}),this)}:function(){},t=new q}();function G(e){return e&&W(e.then,g)}function je(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=Y(n)),r}je.prototype={toString:function(){var e=this,t=e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=je.traverse(e.stack,t,1)),t}},je.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=je.traverse(r.stack,t,n+1));return t};var qe,ke,Re=function(){var e="pending",t="resolved",n="rejected",r=new oe;function i(){var e=this,n=arguments;ie((function(){r.get(e).handle(t,n)}))}function o(){var e=this,t=arguments;ie((function(){r.get(e).handle(n,t)}))}function a(n,i){var o,a,u=r.get(this);for(u.state===e&&(u.state=n,u.value=i);o=u[u.state].shift();)try{if(a=o.handler.apply(d,u.value),G(a)){a.then(o.dfd.resolve,o.dfd.reject);continue}if(u.state===t&&W(a,v)){o.dfd.resolve.apply(d,u.value);continue}o.dfd.resolve(a)}catch(e){o.dfd.reject(e)}u.resolved.length=0,u.rejected.length=0}function u(e,t,n){e.then((function(){n.resolved[t]=Y(arguments),n.count++,c(n)}),(function(){n.rejected.push(Y(arguments)),c(n)}))}function c(e){e.count===e.total?e.dfd.resolve.apply(d,H.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.dfd.reject.apply(d,H.apply([],e.rejected))}function s(t){var n=this;return r.set(n,{state:e,handle:a.bind(n),value:d,resolved:[],rejected:[],count:0}),t(i.bind(n),o.bind(n)),n}return s.prototype={isPending:function(){return r.get(this).state===e},isResolved:function(){return r.get(this).state===t},isRejected:function(){return r.get(this).state===n},then:function(t,n){var i=r.get(this),o=s.defer();return i.resolved.push({handler:t||s.resolve,dfd:o}),i.rejected.push({handler:n||s.reject,dfd:o}),i.state!==e&&ie(i.handle),o.pledge},catch:function(e){return this.then(l,e)},always:function(e){return this.then(e,e)}},s.prototype.finally=s.prototype.always,s.defer=function(){var e={};return e.pledge=new s((function(t,n){e.resolve=t,e.reject=n})),e},s.all=function(e){var t,n,r=s.defer(),i=0;if(e.length)for(t={dfd:r,resolved:[],rejected:[],total:e.length,count:0};n=e[i];i++)u(n,i,t);else r.resolve();return r.pledge},s.race=function(e){for(var t,n=s.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},s.resolve=function(){var e=s.defer();return e.resolve.apply(d,arguments),e.pledge},s.reject=function(){var e=s.defer();return e.reject.apply(d,arguments),e.pledge},s}(),Pe=function(){var e=new oe;function t(){e.set(this,{})}return t.prototype={get:function(t){return t?e.get(this)[t]:e.get(this)},set:function(t,n){e.get(this)[t]=n},remove:function(t){delete e.get(this)[t]}},t}(),Ee=function(){var e="internal!",t=new Pe,n=/^(?:mock:|internal!)/i,o=[];function c(e,t){this[e]=t}function l(e){n.test(e)||this.push(e)}function v(e,t){!n.test(e)&&t.pledge.isPending()&&this.push(e)}function m(e,t){!n.test(e)&&t.pledge.isResolved()&&this.push(e)}function g(e,t){!n.test(e)&&t.pledge.isRejected()&&this.push(e)}function y(){return Q(t.get(),l,[])}function w(e,n,r){var i=this,u=e.match(ge)||o;return i.path=ye(e,n),i.mock=u[1]?p:h,i.cache=u[2]?"+"===u[1]:d,i.type=u[3]||s.handler,i.version=new be(u[4]||s.version),i.lifetime=u[5]&&1e3*u[5]||s.lifetime,i.id=(i.mock?f:"")+i.type+"!"+i.path,i.uri=(i.mock?f:"")+i.type+"@"+i.version+(X(i.lifetime)&&i.lifetime>0?"#"+i.lifetime:"")+"!"+i.path,i.dfd=Re.defer(),i.pledge=i.dfd.pledge,i.invalid=!1,i.pledge.then((function(){i.value=Y(arguments)}),(function(){a.current&&a.process()})),r!==h&&t.set(i.id,i),i}return y.pending=function(){return Q(t.get(),v,[])},y.resolved=function(){return Q(t.get(),m,[])},y.rejected=function(){return Q(t.get(),g,[])},w.prototype={enqueue:!0},w.get=function(e,n){return t.get(we(e,n))},w.resolve=function(t,n){var o,a=n&&me.test(t),u=a?this.get(e+n+"/"+t):this.get(t,n);if(!u)if(a){switch(u=new w(e+n+"/"+t),t){case"demand":o=Q(r,c,r.bind(n));break;case"provide":o=i.bind(n);break;case"path":o=n;break;case"exports":o=this.get(n).value={}}u.dfd.resolve(o)}else u=new w(t,n),r("/demand/handler/"+u.type).then((function(e){u.handler=e,u.mock?u.dfd.resolve(e):xe.resolve(u)}),(function(){u.dfd.reject(new je(T+" (handler)",self.id))}));return u},w.remove=function(e,n,r){var i=we(e,n),o=u.querySelector('[demand-id="'+i+'"]');t.remove(i),t.remove(f+i),o&&o.parentNode.removeChild(o),r!==h&&xe.clear(i)},w.list=y,w}(),Me=function(){var e=/(.+)\/$/;function t(t,n){this[t]={url:se(n).replace(e,"$1"),match:new RegExp("^"+n)}}function n(e,n){var r=this;r.weight=e.length,r.match=new RegExp("^"+e),r.location=[].concat(n),Q(r.location,t,r.location)}return n.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},n}(),Ce=function(){var e={};function t(e){return e instanceof ArrayBuffer||e instanceof MessagePort||"ImageBitmap"in self&&e instanceof ImageBitmap}return function(n){var r,i;return r="$task = "+n+"; $isTransferable = "+t+"; onmessage = "+function(e){var t,n=Array.prototype.slice,r=e.data;function i(e){t||(t=!0,postMessage([r[0],0,e.toString()]))}try{$task.apply($task,[function(){var e;t||(t=!0,e=n.call(arguments),postMessage([r[0],1,e],e.filter($isTransferable)))},i].concat(r[1]))}catch(e){i(e)}},(i=new Worker(URL.createObjectURL(new Blob([r],{type:"application/javascript"})))).onmessage=function(t){var n=t.data[0],r=n?e[n]:null;n&&r&&(t.data[1]?r.resolve.apply(null,t.data[2]):r.reject(t.data[2]),delete e[n])},function(){var n=Re.defer(),r=re(),o=Y(arguments);return e[r]=n,i.postMessage([r,o],o.filter(t)),n.pledge}}}(),Te=(qe=/^(?:\?|)$/,ke=new Ce((function(e,t,n){var r,i,o=new XMLHttpRequest;r=function(){this.readyState<4&&this.abort()}.bind(o),o.ontimeout=o.onerror=o.onabort=function(){t(o.statusText)},o.onprogress=o.onreadystatechange=function(){self.clearTimeout(i),i=self.setTimeout(r,1e4)},o.onload=function(){i=self.clearTimeout(i),"status"in o&&200!==o.status?t(o.statusText):e(o.responseText,o.getResponseHeader&&o.getResponseHeader("content-type"))},o.open("GET",n,!0),o.send(),i=self.setTimeout(r,1e4)})),function(e){var t;function n(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.dfd.reject(new je(T+" (content-type)",e.id)):(e.source=t,Z.emit(k,e.type,e))}fe.test(e.path)||Q(s.pattern,(function(n,r){r.matches(e.path)&&(!t||t.weight<r.weight)&&(t=r)})),function r(i){i=i||0,e.url=u.createElement("a"),e.url.href=t?se(t.process(e.path,i)):e.path,Z.emit(q,e.type,e),(e.invalid||!1===e.cache)&&(e.url.search+=(qe.test(e.url.search)?"":"&")+ee()),ke(e.url.href).then(n,(function(n){var o;i++,t&&t.location[i]?r(i):(o=n,e.dfd.reject(new je(T+(o?" (status)":""),e.id)))}))}()});function Ae(e){return Array.isArray(e)}function Se(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}r=function(){function t(e,t){this[e]={weight:e.length,state:t}}function n(e,t){"base"!==e&&(this[e]=new Me(e,t))}function r(e,t){var n=this[e]=this[e]||{};Z.emit("preConfigure",e,n),V(n,t),Z.emit(y,e,n)}function i(){var t,n,r,i=Y(arguments),o=this!==e?this:d,a=[],u=0;for(Z.emit(x,d,i,o);t=i[u];u++)W(t,m)?i[u]=Ee.resolve(t,o):(i[u]=n=Re.defer(),n.resolve(t)),a.push(i[u].pledge);return(r=i.length>1?Re.all(a):a[0]).always((function(){if(Z.emit(j,d,a,o),r.isRejected())return Q(i,(function(e,t){t.pledge.isRejected()&&Z.emit(C,t.path,t)})),Re.reject.apply(null,arguments)}))}return i.configure=function(e){var o=e.cache,a=e.version,u=e.delay,c=e.timeout,f=e.lifetime,d=e.base,l=e.pattern,h=e.modules,p=s.modules;return W(o,"boolean")?s.cache[""]={weight:0,state:o}:_(o)&&Q(o,t,s.cache),K(a)&&(s.version=a),X(u)&&(s.delay=1e3*u),X(c)&&(s.timeout=1e3*Math.min(Math.max(c,2),20)),X(f)&&f>0&&(s.lifetime=1e3*f),W(d,m)&&""!==d&&(s.pattern.base=new Me("",d)),_(l)&&Q(l,n,s.pattern),_(h)&&Q(h,r,p),i},i.version="7.2.0",i.on=Z.on.bind(i),i.get=function(e,t){var n=Ee.get(e,t);return n&&n.value},i.list=Ee.list,i.remove=Ee.remove,i.cache={clear:xe.clear},Z.after(w,(function(e){new Te(e)})).after(k,(function(e){var t=e.handler.onPostRequest;t&&t(e)})).after("cacheHit postRequest",(function(e){Z.emit(R,e.id,e)})).after(q,(function(e){var t=e.handler.onPreRequest;t&&t(e)})).after(R,(function(e){var t=e.handler.onPreProcess;t&&t(e),e.pledge.then((function(){Z.emit(P,e.id,e)})),!0===e.enqueue?o.enqueue(e):G(e.enqueue)&&e.enqueue.then((function(){o.enqueue(e)}))})),i}(),L(e,"demand",{value:r,configurable:h,writable:h}),(i=function(){var t,n,i,o,u=W(arguments[0],m)?arguments[0]:d,c=this!==e?this:d,s=Ae(arguments[u?1:0])?arguments[u?1:0]:d,f=s?arguments[u?2:1]:arguments[u?1:0];if(a.current&&(u=(t=a.current).uri,a.process()),u){if(t=t||new Ee(u,c),n=G(f),i=W(f,g),s&&s.length)r.apply(t.path,s).then((function(){if(i)try{o=f.apply(d,arguments),!t.value&&G(o)?o.then(t.dfd.resolve,(function(){t.dfd.reject(new je(A,t.id,arguments))})):t.dfd.resolve(t.value||o)}catch(e){console.error(e),t.dfd.reject(new je(A,t.id,e))}else t.dfd.resolve(f)}),(function(){t.dfd.reject(new je(A,t.id,arguments))}));else if(n)f.then(t.dfd.resolve,t.dfd.reject);else if(i)try{t.dfd.resolve(f())}catch(e){console.error(e),t.dfd.reject(new je(A,t.id,e))}else t.dfd.resolve(f);return t.dfd.pledge.then((function(){Z.emit(M,t.path,t)})),t.dfd.pledge}throw new Error($)}).amd=p,L(e,"provide",{value:i,configurable:h,writable:h}),r.configure({cache:p,base:"/",pattern:{"/demand":se((c&&c.url||location.href)+"/../").slice(0,-1)}}),c&&c.settings&&r.configure(c.settings);var $e=function(){var e=new oe;function t(t){var n=this,i={queue:t,current:d};e.set(n,i),r.on("queueEnqueue:"+t.uuid,(function(){!i.current&&n.process()}))}return t.prototype={process:function(){var t,n=e.get(this);n.queue.length&&(t=n.current=n.queue.dequeue()).pledge.isPending()?t.handler.process&&t.handler.process(t):n.current=d},get current(){return e.get(this).current}},t}();function Ie(e,t){for(var n,r;n=le.exec(t);)fe.test(n[3])?r=e.protocol+"//"+e.host+n[3]:(e.pathname+=(pe.test(e.pathname)?"/../":"/")+n[3].replace(he,""),r=e.protocol+"//"+e.host+e.pathname),t=t.replace(n[0],n[1]+" "+n[2]+"="+r+".map"+(n[4]?" "+n[4]:""));return t}var Oe,He,Ne=(Oe=performance.now(),He=[Oe],F((function e(){Oe=performance.now(),He.push(Oe),He=He.slice(-300),F(e)})),function(){return Math.floor(He.length/((Oe-He[0])/1e3))}),De=function(){var e,t,n=new ue,r=1e3/60*(Math.min(60,Ne())/60*.2),i=0;function o(){t=performance.now(),e(),i+=performance.now()-t,e=e=n.dequeue(),i<r?e&&o():(i=0,e&&a())}function a(){F(o)}return function(t){n.enqueue(t),!e&&(e=n.dequeue())&&a()}}();function Le(){}Le.prototype={validate:d,onPreRequest:d,onPostRequest:d,onPreProcess:d,process:d};var Be=function(){var t=u.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/,o={umd:!1,suffix:".js"};function a(){}return r.on("postConfigure:/demand/handler/module",(function(e){_(e)&&V(o,e)})),a.prototype={validate:function(e){return n.test(e)},onPreRequest:function(e,t){var n;(t=typeof t!==v?t:o.suffix)&&0!==e.path.indexOf("@")&&(n=e.url.pathname,e.url.pathname=n.slice(-t.length)!==t?n+t:n)},onPostRequest:function(e){e.source=Ie(e.url,e.source)},onPreProcess:function(e){e.enqueue=new Re(De)},process:function(n){var r,a;n.source&&((r=u.createElement("script")).async=p,r.text=n.source,r.setAttribute("demand-id",n.id),o.umd&&(a=e.define,e.define=i),t.appendChild(r),o.umd&&(e.define=a))}},new(a.extends(Le))}();function je(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=Y(n)),r}je.prototype={toString:function(){var e=this,t=e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=je.traverse(e.stack,t,1)),t}},je.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=je.traverse(r.stack,t,n+1));return t};var Ue=function(){var e={};function t(e,t){var n,r;for(n=0;r=t[n];n++)W(r,m)&&(t[n]=we(r))}function n(){}return r.on("postConfigure:/demand/handler/bundle",(function(n){_(n)&&Q(e=n,t)})),n.prototype={validate:Be.validate,onPreProcess:function(t){var n,r,i,a,u,c=t.source,s=t.dfd,d=e[t.path];function l(){s.reject(new je(S,t.id,arguments))}if(t.enqueue=h,d&&(n=function(t){for(var n,r,i=0;r=t[i];i++)if(r=(r=r.match(ge))&&r[3]||e.handler,n){if(r!==n)return h}else n=r;return n}(d))){for(;r=le.exec(c);)c=c.replace(r[0],"");for(t.source=c,i=[],u=0;a=d[u];u++)i.push(Ee.resolve(f+a).pledge);Re.all(i).then((function(){for(i.length=0,u=0;a=d[u];u++)(a=d[u]=Ee.get(a)||new Ee(a)).handler=arguments[u],i.push(a.pledge);"module"===n?(o.enqueue.apply(o,d),Be.process(t)):(Be.process(t),o.enqueue.apply(o,d)),Re.all(i).then(s.resolve,l)}),l)}else l()}},new(n.extends(Le))}(),ze=function(){var e=/^text\/.+$/,t={suffix:".html"};function n(){}return r.on("postConfigure:/demand/handler/component",(function(e){_(e)&&V(t,e)})),n.prototype={validate:function(t){return e.test(t)},onPreRequest:function(e,n){var r;(n=typeof n!==v?n:t.suffix)&&(r=e.url.pathname,e.url.pathname=r.slice(-n.length)!==n?r+n:r)},onPostRequest:function(e){e.source=Ie(e.url,e.source)},onPreProcess:function(e){var t,n,r,i,a=e.path,c=e.dfd,s=u.createElement("body"),f=[],d=[];function l(){c.reject(new je(S,e.id,arguments))}for(e.enqueue=h,s.innerHTML=e.source;t=s.firstElementChild;)(n=t.getAttribute("type"))&&(i=n+"!"+a+((r=t.getAttribute("path"))?"/"+r:""),t.parentNode.removeChild(t),f.push({source:t.textContent,uri:i}),d.push(Ee.resolve("mock:"+i).pledge));Re.all(d).then((function(){var t,n,r,i=[];for(d.length=0,t=0;n=f[t];t++)(r=Ee.get(n.uri)||new Ee(n.uri)).source=Ie(r.url,n.source),r.handler=arguments[t],i.push(r),d.push(r.pledge),o.enqueue(r);Re.all(d).then((function(){var r=e.path.length+1,o={};for(t=0;n=arguments[t];t++)o[i[t].path.substr(r)||"main"]=n;c.resolve(o)}),l)}),l)}},new(n.extends(Le))}(),Fe=function(){var e="/demand/plugin/genie",t=[];function n(e){for(var n,r,i=0;n=t[i];i++)n.prefix.test(e)&&(!r||n.weight>r.weight)&&(r=n);return r}function i(){for(var e,t=0;e=this[t];t++)e.dfd.resolve(arguments[t])}function o(){for(var e,t=0;e=this[t];t++)e.dfd.reject(new je(S,e.id))}function a(e,n){t.push({prefix:new RegExp("^"+e),weight:e.length,fn:n})}function u(t,n){var a,u=n.matches,c=0;if(u.length>1){for(n.id=e+"/"+Se(JSON.stringify(n.matches));a=u[c];c++)u[c]=new Ee(a.uri);r.configure(function(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules["/demand/handler/bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}(n)),r("bundle!"+n.id).then(i.bind(u),o.bind(u))}}return r.on("postConfigure:"+e,(function(e){_(e)&&(t.length=0,Q(e,a))})).on(x,(function(e,t){for(var r,i,o={},a=0;r=e[a];a++)!W(r,m)||me.test(r)||Ee.get(r,t)||"module"===(r=new Ee(r,t,h)).type&&(i=n(r.path))&&!xe.get(r)&&(o[i.prefix]||(o[i.prefix]={fn:i.fn,matches:[]})).matches.push(r);Q(o,u)})),p}();function We(e,t){i(e,(function(){return t}))}if(o=new ue,a=new $e(o),We("/demand/abstract/uuid",ae),We("/demand/abstract/handler",Le),We("/demand/handler/module",Be),We("/demand/handler/bundle",Ue),We("/demand/handler/component",ze),We("/demand/plugin/genie",Fe),We("/demand/validator/isTypeOf",W),We("/demand/validator/isArray",Ae),We("/demand/validator/isObject",_),We("/demand/validator/isInstanceOf",(function(e,t){return e instanceof t})),We("/demand/validator/isSemver",K),We("/demand/validator/isThenable",G),We("/demand/function/resolveUrl",se),We("/demand/function/resolveSourcemaps",Ie),We("/demand/function/merge",V),We("/demand/function/iterate",Q),We("/demand/function/hash",Se),We("/demand/function/defer",ie),We("/demand/function/fps",Ne),We("/demand/function/onIdle",ce),We("/demand/function/onAnimationFrame",De),We("/demand/function/uuid",re),We("/demand/function/toArray",Y),We("/demand/task",Ce),We("/demand/weakmap",oe),We("/demand/descriptor",(function(e,t,n,r){return{__proto__:d,value:e,enumerable:!!r,configurable:!!n,writable:!!t}})),We("/demand/pledge",Re),We("/demand/queue",ue),We("/demand/failure",je),We("/demand/semver",be),c&&c.main)switch(typeof c.main){case m:r(c.main);break;case g:i("main",c.main())}}("demand-loader"===this.name?parent:this,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
