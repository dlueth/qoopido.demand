/**! Qoopido.demand 5.3.1 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(e,t,n){"use strict";var r,i,o,u,a=e.document,c="demand"in e&&e.demand,s={version:"1.0.0",cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},d=Array.prototype,l=d.slice,f=d.concat,h=Object,p=h.prototype.toString,v=h.create,m=h.defineProperty,g=h.getOwnPropertyNames,y=h.getOwnPropertyDescriptor,w=a.createElement("a");function x(e,t,n,r){return{__proto__:null,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function b(e,t){return typeof e===t}function j(e){return e&&b(e,"object")}function q(e){return b(e,"number")&&isFinite(e)&&Math.floor(e)===e&&e>=0}function R(e,t){return e instanceof t}!function(t){function n(e,t,n,r,i){m(this,e,new x(t,n,r,i))}function r(e){for(var t,n=this.prototype,r=g(n),i={constructor:new x(this,!0,!0)},o=0;(t=r[o])&&!i[t];o++)i[t]=y(n,t);try{this.prototype=v(e.prototype||e,i)}catch(e){}if(this.prototype===n)throw new TypeError("Unable to extend, prototype is not writable");return this}n.call(Object.prototype,"define",n),n.call(e.Object.prototype,"define",n),Function.prototype.define("extends",r),e.Function.prototype.define("extends",r)}();var k,E=(k=/^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i,function(e){return b(e,"string")&&k.test(e)});function P(e,t,n){for(var r,i=h.keys(e),o=0;void 0!==(r=i[o])&&!1!==t.call(n,r,e[r]);o++);return n}var C,M,S,O,A=function(){function e(e,t){var n,r=this[e];void 0!==t&&(j(t)?(n=j(r),r=void 0!==t.length?n&&void 0!==r.length?r:[]:n&&void 0===r.length?r:{},this[e]=A(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;void 0!==(t=arguments[r]);r++)P(t,e,n);return n}}(),$=function(){var e=new RegExp("[xy]","g");function t(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t)}}(),I=(O="setImmediate"in e,"MutationObserver"in e?function(e){C=a.createElement("div"),new MutationObserver((function(){e()})).observe(C,{attributes:!0}),C.setAttribute("i","1")}:!O&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?(S={},e.addEventListener("message",(function(t){var n;t.source===e&&t.data&&(n=S[t.data])&&(n(),delete S[t.data])}),!1),function(t){var n=$();S[n]=t,e.postMessage(n,"*")}):!O&&"onreadystatechange"in(C=a.createElement("script"))?function(e){C.onreadystatechange=function(){C.onreadystatechange=null,C.parentNode.removeChild(C),e()},a.body.appendChild(C)}:(M=O?setImmediate:t,function(e){M(e)}));function T(e,t,n){return l.call(e,t,n)}var D=function(){var e=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)|provide|reject$/,t={};function n(n,r,i){var o,u;if(b(r,"string")&&b(i,"function"))for(r=r.split(" ");o=r.shift();)o=o.split(":"),e.test(o[0])&&((t[o[0]]||(t[o[0]]={on:[],after:[]}))[n].push({callback:i,filter:o[1]}),"on"===n&&"postConfigure"===o[0]&&(u=s.modules[o[1]])&&i(u))}function r(){}return r.prototype={emit:function(e,n){var r,i,o,u=t[e];if(u){for(r=T(arguments,2),i=0;o=u.on[i];i++)o.filter&&o.filter!==n||o.callback.apply(null,r);for(i=0;o=u.after[i];i++)o.filter&&o.filter!==n||o.callback.apply(null,r)}return this},on:function(e,t){return n("on",e,t),this},after:function(e,t){return n("after",e,t),this}},new r}(),H="WeakMap"in e&&!("ActiveXObject"in e)?e.WeakMap:function(){function e(e,t){var n;if((n=t[e.id])&&n[0]===t)return n}function t(){this.define("id","weakmap-"+$())}return t.prototype={set:function(t,n){var r=e(this,t);return r?r[1]=n:t.define(this.id,[t,n]),this},get:function(t){var n=e(this,t);if(n)return n[1]},delete:function(t){var n=e(this,t);n&&(n.length=0,delete t[this.id])},has:function(t){return!!e(this,t)}},t}();function N(){return b(this.uuid,"undefined")&&this.define("uuid",$()),this}var L=function(){var e=new H;function t(){var t=N.call(this);return e.set(t,[]),t}return t.prototype={enqueue:function(){var t=T(arguments);e.set(this,e.get(this).concat(t)),D.emit("queueEnqueue",this.uuid,t)},dequeue:function(){var t=e.get(this).shift();return D.emit("queueDequeue",this.uuid,t),t},get current(){return e.get(this)[0]},get length(){return e.get(this).length}},t.extends(N)}(),z=function(){var r,i="object"==typeof e.safari&&e.safari.pushNotification?"beforeunload":"visibilitychange",o=e.requestIdleCallback||function(e,n){var r=+new Date;return t((function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(+new Date-r))}})}),n&&n.timeout)},u=e.cancelIdleCallback||function(e){n(e)},c=new L;function s(){c.dequeue()(),r=c.length&&o(s)}return e.addEventListener(i,(function(e){var t;if(c.length&&("visibilitychange"!==e.type||"hidden"===a.visibilityState)){r=u(r);do{t&&t()}while(t=c.dequeue())}}),!0),function(e,t){c.enqueue(e),!r&&c.length&&(r=o(s,{timeout:t}))}}();function X(){return+new Date}var _,F=(_=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,function(e){return e.replace(_,"\\$&")});function U(e){return w.href=e,w.href}var W=/^(http(s?):)?\/\//i,B=/^\//,G=/((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,J=new RegExp("^"+F(U("/"))),K=new RegExp("^demand|provide|path$"),Q=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;function V(e,t){var n=e.replace(Q,"");return B.test(n)||W.test(n)||(n="/"+U((t&&U(t+"/../")||"/")+n).replace(J,"")),n}function Y(e,t){var n=e.match(Q);return(n&&n[1]?"mock:":"")+(n&&n[3]||s.handler)+"!"+V(e,t)}var Z=function(){function e(e,t){return e<t?-1:e>t?1:0}function t(e){if(!E(e))throw new TypeError('"version" must be a valid semver version string');e=function(e){var t,n=e.split("-"),r=0;for(n=n[1]?Array.prototype.concat(n[0].split("."),n[1].split(".")):n[0].split(".");t=n[r];r++)n[r]=parseInt(t,10).toString()===t?parseInt(t,10):t;return n}(e),this.major=e.shift(),this.minor=e.shift(),this.patch=e.shift(),this.identifier=e}return t.prototype={toString:function(){return this.major+"."+this.minor+"."+this.patch+(this.identifier.length?"-"+this.identifier.join("."):"")},compare:function(t){return e(this.major,t.major)||e(this.minor,t.minor)||e(this.patch,t.patch)||function(e,t){var n,r,i,o,u=0;if(e.length&&!t.length)return-1;if(!e.length&&t.length)return 1;if(!e.length&&!t.length)return 0;do{if(n=e[u],o=typeof(r=t[u]),"undefined"==(i=typeof n)&&"undefined"===o)return 0;if("undefined"===o)return 1;if("undefined"===i)return-1;if(n===r);else{if("string"===i&&"string"!==o)return 1;if("string"!==i&&"string"===o)return-1;if(n>r)return 1;if(n<r)return-1}}while(++u)}(this.identifier,t.identifier)}},t}(),ee=function(){var t,n=new RegExp("^"+F("[demand]")+"\\[(.+?)\\]"+F("[state]")+"$"),i=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/,o=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return!1}}(),u=o?e.localStorage:null,a=o&&"remainingSpace"in u,c={};function d(e){var t;return null!==e.cache?e.cache:(P(s.cache,(function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)})),!!t&&t.state)}function l(e){return u.getItem(e)}function f(e,t){u[t?"setItem":"removeItem"](e,t)}function h(e){var t,n=l(e);if(n&&(t=n.match(i)))return T(t,1)}function p(e,t){t[4]=X(),f(e,t.join(","))}function v(e,t,n){D.emit(e,t.id,t,n)}function m(){z(this.clear.expired.bind(this.clear),s.delay)}return D.on("cacheMiss",(function(e){z((function(){t.clear(e.id)}))})).on("cacheExceed",(function(e){r("-!/demand/cache/dispose").then((function(n){z((function(){n(e.source.length),t.set(e)}),s.delay)}))})).on("postRequest",(function(e){e.source&&d(e)&&(c[e.id]=!0)})).after("postProcess",(function(e){c[e.id]&&z((function(){t.set(e)}),s.delay)})),m.prototype={get:o?function(e){var t,n;if(d(e)){if(t="[demand]["+e.id+"]",!(n=h(t+"[state]")))return;return 1===e.version.compare(new Z(n[0]))||n[2]&&e.lifetime&&n[2]<=X()?void(e.invalid=!0):(e.source=l(t+"[value]"),z((function(){p(t+"[state]",n)}),s.delay),!0)}}:function(){},resolve:o?function(e){this.get(e)?v("cacheHit",e):v("cacheMiss",e)}:function(e){v("cacheMiss",e)},set:o?function(e){var t,n,i;if(d(e)){t=[e.version,e.source.length,e.lifetime?X()+e.lifetime:null,r.version],n="[demand]["+e.id+"]",v("preCache",e,t);try{if(i=a?u.remainingSpace:null,f(n+"[value]",e.source),p(n+"[state]",t),null!==i&&u.remainingSpace===i)throw new Error;v("postCache",e,t)}catch(t){v("cacheExceed",e)}}}:function(){},clear:o?function(e){var t=Y(e),n="[demand]["+t+"]";l(n+"[state]")&&(f(n+"[state]"),f(n+"[value]"),v("cacheClear",ie.get(t)||new ie(t,null,!1)))}:function(){}},m.prototype.clear.all=o?function(){var e;P(u,(function(t){(e=t.match(n))&&this(e[1])}),this)}:function(){},m.prototype.clear.expired=o?function(){var e,t;P(u,(function(r){(e=r.match(n))&&(t=h("[demand]["+e[1]+"][state]"))&&t[2]>0&&t[2]<=X()&&this(e[1])}),this)}:function(){},t=new m}(),te=function(){var e=new H;function t(){e.get(this).handle("resolved",arguments)}function n(){e.get(this).handle("rejected",arguments)}function r(t,n){var r,i,o=e.get(this);for("pending"===o.state&&(o.state=t,o.value=n);r=o[o.state].shift();)try{if((i=r.handler.apply(null,o.value))&&"function"==typeof i.then){i.then(r.dfd.resolve,r.dfd.reject);continue}if("undefined"==typeof i){r.dfd["resolved"===o.state?"resolve":"reject"].apply(null,o.value);continue}r.dfd.resolve(i)}catch(e){r.dfd.reject(e)}o.resolved.length=0,o.rejected.length=0}function i(e,t,n){e.then((function(){n.resolved[t]=T(arguments),n.count++,o(n)}),(function(){n.rejected.push(T(arguments)),o(n)}))}function o(e){e.count===e.total?e.dfd.resolve.apply(null,f.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.dfd.reject.apply(null,f.apply([],e.rejected))}function u(i){return e.set(this,{state:"pending",handle:r.bind(this),value:null,resolved:[],rejected:[],count:0}),i(t.bind(this),n.bind(this)),this}return u.prototype={catch:function(e){return this.then(void 0,(function(){var t,n=u.defer();try{(t=e.apply(null,arguments))&&"function"==typeof t.then?t.then(n.resolve,n.reject):n.resolve(t)}catch(e){n.reject(e)}return n.pledge}))},always:function(e){return this.then(e,(function(){var t,n=u.defer();try{(t=e.apply(null,arguments))&&"function"==typeof t.then?t.then(n.resolve,n.reject):n.reject.apply(null,arguments)}catch(e){n.reject(e)}return n.pledge}))},then:function(t,n){var r=e.get(this),i=u.defer();return r.resolved.push({handler:t||function(){return u.resolve.apply(null,arguments)},dfd:i}),r.rejected.push({handler:n||function(){return u.reject.apply(null,arguments)},dfd:i}),"pending"!==r.state&&I(r.handle),i.pledge},isPending:function(){return"pending"===e.get(this).state},isResolved:function(){return"resolved"===e.get(this).state},isRejected:function(){return"rejected"===e.get(this).state}},u.prototype.finally=u.prototype.always,u.defer=function(){var e={};return e.pledge=new u((function(t,n){e.resolve=t,e.reject=n})),e},u.all=function(e){var t,n,r=u.defer(),o=0;if(e.length)for(t={dfd:r,resolved:[],rejected:[],total:e.length,count:0};n=e[o];o++)i(n,o,t);else r.resolve();return r.pledge},u.race=function(e){for(var t,n=u.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},u.resolve=function(){var e=u.defer();return e.resolve.apply(null,arguments),e.pledge},u.reject=function(){var e=u.defer();return e.reject.apply(null,arguments),e.pledge},u}(),ne=function(){var e=new H;function t(){e.set(this,{})}return t.prototype={get:function(t){return t?e.get(this)[t]:e.get(this)},set:function(t,n){e.get(this)[t]=n},remove:function(t){delete e.get(this)[t]}},t}();function re(e,t,n){return this.message=e,t&&(this.module=t),n&&(this.stack=T(n)),this}re.prototype={toString:function(){var e="demand: "+this.message+" "+(this.module?'"'+this.module+'"':"");return this.stack&&(e=re.traverse(this.stack,e,1)),e}},re.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=re.traverse(r.stack,t,n+1));return t};var ie=function(){var e=new ne,t=/^(?:mock:|internal!)/i,n=[];function o(e,t){this[e]=t}function u(e){t.test(e)||this.push(e)}function c(e,n){!t.test(e)&&n.pledge.isPending()&&this.push(e)}function d(e,n){!t.test(e)&&n.pledge.isResolved()&&this.push(e)}function l(e,n){!t.test(e)&&n.pledge.isRejected()&&this.push(e)}function f(){return P(e.get(),u,[])}function h(t,r,i){var o=this,u=t.match(Q)||n;return o.path=V(t,r),o.mock=!!u[1],o.cache=u[2]?"+"===u[1]:null,o.type=u[3]||s.handler,o.version=new Z(u[4]||s.version),o.lifetime=u[5]&&1e3*u[5]||s.lifetime,o.id=(o.mock?"mock:":"")+o.type+"!"+o.path,o.uri=(o.mock?"mock:":"")+o.type+"@"+o.version+(q(o.lifetime)&&o.lifetime>0?"#"+o.lifetime:"")+"!"+o.path,o.dfd=te.defer(),o.pledge=o.dfd.pledge,o.invalid=!1,o.pledge.then((function(){o.value=T(arguments)})),!1!==i&&e.set(o.id,o),o}return f.pending=function(){return P(e.get(),c,[])},f.resolved=function(){return P(e.get(),d,[])},f.rejected=function(){return P(e.get(),l,[])},h.prototype={enqueue:!0},h.get=function(t,n){return e.get(Y(t,n))},h.resolve=function(e,t){var n,u=t&&K.test(e),a=u?this.get("internal!"+t+"/"+e):this.get(e,t);if(!a)if(u){switch(a=new h("internal!"+t+"/"+e),e){case"demand":n=P(r,o,r.bind(t));break;case"provide":n=i.bind(t);break;case"path":n=t}a.dfd.resolve(n)}else a=new h(e,t),r("/demand/handler/"+a.type).then((function(e){a.handler=e,a.mock?a.dfd.resolve(e):ee.resolve(a)}),(function(){a.dfd.reject(new re("error loading (handler)",self.id))}));return a},h.remove=function(t,n,r){var i=Y(t,n),o=a.querySelector('[demand-id="'+i+'"]');e.remove(i),e.remove("mock:"+i),o&&o.parentNode.removeChild(o),!1!==r&&ee.clear(i)},h.list=f,h}(),oe=function(){var e=/(.+)\/$/;function t(t,n){this[t]={url:U(n).replace(e,"$1"),match:new RegExp("^"+F(n))}}function n(e,n){this.weight=e.length,this.match=new RegExp("^"+F(e)),this.location=[].concat(n),P(this.location,t,this.location)}return n.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},n}(),ue=function(r){var i="XDomainRequest"in e&&e.XDomainRequest||r;function o(){this.readyState<4&&this.abort()}return function(e){var u,a=te.defer(),c=J.test(e)?new r:new i,d=o.bind(c),l=s.timeout;return c.ontimeout=c.onerror=c.onabort=function(){a.reject(c.status)},c.onprogress=c.onreadystatechange=function(){n(u),u=t(d,l)},c.onload=function(){u=n(u),"status"in c&&200!==c.status?a.reject(c.status):a.resolve(c.responseText,c.getResponseHeader&&c.getResponseHeader("content-type"))},c.open("GET",e,!0),c.send(),u=t(d,l),a.pledge}}(XMLHttpRequest);function ae(e){var t,n=/^(?:\?|)$/;function r(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.dfd.reject(new re("error loading (content-type)",e.id)):(e.source=t,D.emit("postRequest",e.type,e))}function i(t){e.dfd.reject(new re("error loading"+(t?" (status)":""),e.id))}W.test(e.path)||P(s.pattern,(function(n,r){r.matches(e.path)&&(!t||t.weight<r.weight)&&(t=r)})),function o(u){u=u||0,e.url=a.createElement("a"),e.url.href=t?U(t.process(e.path,u)):e.path,e.invalid&&(e.url.search+=(n.test(e.url.search)?"":"&")+X()),D.emit("preRequest",e.type,e),new ue(e.url).then(r,t?function(){u++,t.location[u]?o(u):i()}:i)}()}function ce(e){return"[object Array]"===p.call(e)}function se(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}r=function(){function t(e,t){this[e]={weight:e.length,state:t}}function n(e,t){"base"!==e&&(this[e]=new oe(e,t))}function r(e,t){var n=this[e]=this[e]||{};D.emit("preConfigure",e,n),A(n,t),D.emit("postConfigure",e,n)}function i(){var t,n,r=T(arguments),i=this!==e?this:null,o=0;for(D.emit("preResolve",null,r,i);t=r[o];o++)b(t,"string")?r[o]=ie.resolve(t,i).pledge:(r[o]=(n=te.defer()).pledge,n.resolve(t));return(r.length>1?te.all(r):r[0]).always((function(){D.emit("postResolve",null,r,i)}))}return i.configure=function(e){var o=e.cache,u=e.version,a=e.delay,c=e.timeout,d=e.lifetime,l=e.base,f=e.pattern,h=e.modules,p=s.modules;return b(o,"boolean")?s.cache[""]={weight:0,state:o}:j(o)&&P(o,t,s.cache),E(u)&&(s.version=u),q(a)&&(s.delay=1e3*a),q(c)&&(s.timeout=1e3*Math.min(Math.max(c,2),20)),q(d)&&d>0&&(s.lifetime=1e3*d),b(l,"string")&&""!==l&&(s.pattern.base=new oe("",l)),j(f)&&P(f,n,s.pattern),j(h)&&P(h,r,p),i},i.version="5.3.1",i.on=D.on.bind(i),i.get=function(e,t){var n=ie.get(e,t);return n&&n.value},i.list=ie.list,i.remove=ie.remove,i.cache={clear:ee.clear},D.after("cacheMiss",(function(e){new ae(e)})).after("postRequest",(function(e){var t=e.handler.onPostRequest;t&&t(e)})).after("cacheHit postRequest",(function(e){D.emit("preProcess",e.id,e)})).after("preRequest",(function(e){var t=e.handler.onPreRequest;t&&t(e)})).after("preProcess",(function(e){var t=e.handler.onPreProcess;t&&t(e),e.pledge.then((function(){D.emit("postProcess",e.id,e)})),!0===e.enqueue?o.enqueue(e):R(e.enqueue,te)&&e.enqueue.then((function(){o.enqueue(e)}))})),i}(),e.define("demand",r),i=function(){var t,n,i,o=b(arguments[0],"string")?arguments[0]:null,a=this!==e?this:null,c=ce(arguments[o?1:0])?arguments[o?1:0]:null,s=c?arguments[o?2:1]:arguments[o?1:0];if(!o&&u.current&&(o=(t=u.current).uri,u.process()),o)return t=t||new ie(o,a),n=R(s,te),i=b(s,"function"),c?r.apply(t.path,c).then((function(){t.dfd.resolve(i?s.apply(null,arguments):s)}),(function(){t.dfd.reject(new re("error providing",t.id,arguments))})):n?s.then(t.dfd.resolve,t.dfd.reject):t.dfd.resolve(i?s():s),t.dfd.pledge.then((function(){D.emit("provide",t.path,t)}),(function(){D.emit("reject",t.path,t)})),t.dfd.pledge;!b(console,"undefined")&&console.error(new re("unspecified anonymous provide"))},e.define("provide",i),r.configure({cache:!0,base:"/",pattern:{"/demand":U((c&&c.url||location.href)+"/../").slice(0,-1)}}),c&&c.settings&&r.configure(c.settings);var de=function(){var e=new H;function t(t){var n=this,i={queue:t,current:null};e.set(n,i),r.on("queueEnqueue:"+t.uuid,(function(){!i.current&&n.process()}))}return t.prototype={process:function(){var t,n=e.get(this);!n.queue.length||(t=n.current=n.queue.dequeue()).pledge.isRejected()?n.current=null:t.handler.process&&t.handler.process(t)},get current(){return e.get(this).current}},t}();function le(e,t){for(var n,r;n=G.exec(t);)w.href=e,W.test(n[2])?r=w.protocol+"//"+w.host+n[3]:(w.pathname+="/../"+n[3],r=w.protocol+"//"+w.host+w.pathname),t=t.replace(n[0],n[1]+" "+n[2]+"="+r+".map"+(n[4]?" "+n[4]:""));return t}function fe(){}fe.prototype={validate:null,onPreRequest:null,onPostRequest:null,onPreProcess:null,process:null};var he=function(){var e=a.getElementsByTagName("head")[0],t=/^(application|text)\/(x-)?javascript/,n={suffix:".js"};function i(){}return r.on("postConfigure:/demand/handler/module",(function(e){j(e)&&A(n,e)})),i.prototype={validate:function(e){return t.test(e)},onPreRequest:function(e,t){var r;(t="undefined"!=typeof t?t:n.suffix)&&(r=e.url.pathname,e.url.pathname=r.slice(-t.length)!==t?r+t:r)},onPostRequest:function(e){e.source=le(e.url,e.source)},process:function(t){var n;t.source&&((n=a.createElement("script")).async=!0,n.text=t.source,n.setAttribute("demand-id",t.id),e.appendChild(n))}},new(i.extends(fe))}();function re(e,t,n){return this.message=e,t&&(this.module=t),n&&(this.stack=T(n)),this}re.prototype={toString:function(){var e="demand: "+this.message+" "+(this.module?'"'+this.module+'"':"");return this.stack&&(e=re.traverse(this.stack,e,1)),e}},re.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=re.traverse(r.stack,t,n+1));return t};var pe=function(){var e={};function t(e,t){var n,r;for(n=0;r=t[n];n++)b(r,"string")&&(t[n]=Y(r))}function n(){}return r.on("postConfigure:/demand/handler/bundle",(function(n){j(n)&&P(e=n,t)})),n.prototype={validate:he.validate,onPreProcess:function(t){var n,r,i,u,a,c=t.source,s=t.dfd,d=e[t.path];function l(){s.reject(new re("error resolving",t.id,arguments))}if(t.enqueue=!1,d&&(n=function(t){for(var n,r,i=0;r=t[i];i++)if(r=(r=r.match(Q))&&r[3]||e.handler,n){if(r!==n)return!1}else n=r;return n}(d))){for(;r=G.exec(c);)c=c.replace(r[0],"");for(t.source=c,i=[],a=0;u=d[a];a++)i.push(ie.resolve("mock:"+u).pledge);te.all(i).then((function(){for(i.length=0,a=0;u=d[a];a++)(u=d[a]=ie.get(u)||new ie(u)).handler=arguments[a],i.push(u.pledge);"module"===n?(o.enqueue.apply(o,d),he.process(t)):(he.process(t),o.enqueue.apply(o,d)),te.all(i).then(s.resolve,l)}),l)}else l()}},new(n.extends(fe))}(),ve=function(){var e=/^text\/.+$/,t={suffix:".html"};function n(){}return r.on("postConfigure:/demand/handler/component",(function(e){j(e)&&A(t,e)})),n.prototype={validate:function(t){return e.test(t)},onPreRequest:function(e,n){var r;(n="undefined"!=typeof n?n:t.suffix)&&(r=e.url.pathname,e.url.pathname=r.slice(-n.length)!==n?r+n:r)},onPostRequest:function(e){e.source=le(e.url,e.source)},onPreProcess:function(e){var t,n,r,i,u=e.path,c=e.dfd,s=a.createElement("body"),d=[],l=[];function f(){c.reject(new re("error resolving",e.id,arguments))}for(e.enqueue=!1,s.innerHTML=e.source;t=s.firstElementChild;)(n=t.getAttribute("type"))&&(i=n+"!"+u+((r=t.getAttribute("path"))?"/"+r:""),t.parentNode.removeChild(t),d.push({source:t.textContent,uri:i}),l.push(ie.resolve("mock:"+i).pledge));te.all(l).then((function(){var t,n,r,i=[];for(l.length=0,t=0;n=d[t];t++)(r=ie.get(n.uri)||new ie(n.uri)).source=le(r.url,n.source),r.handler=arguments[t],i.push(r),l.push(r.pledge),o.enqueue(r);te.all(l).then((function(){var r=e.path.length+1,o={};for(t=0;n=arguments[t];t++)o[i[t].path.substr(r)||"main"]=n;c.resolve(o)}),f)}),f)}},new(n.extends(fe))}(),me=function(){var e="/demand/plugin/genie",t=[];function n(e){for(var n,r,i=0;n=t[i];i++)0===e.indexOf(n.prefix)&&(!r||n.weight>r.weight)&&(r=n);return r}function i(){for(var e,t=0;e=this[t];t++)e.dfd.resolve(arguments[t])}function o(){for(var e,t=0;e=this[t];t++)e.dfd.reject(new re("error resolving",e.id))}function u(e,n){t.push({prefix:e,weight:e.length,fn:n})}function a(t,n){var u,a=n.matches,c=0;if(a.length>1){for(n.id=e+"/"+se(JSON.stringify(n.matches));u=a[c];c++)a[c]=new ie(u.uri);r.configure(function(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules["/demand/handler/bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}(n)),r("bundle!"+n.id).then(i.bind(a),o.bind(a))}}return r.on("postConfigure:"+e,(function(e){j(e)&&(t.length=0,P(e,u))})).on("preResolve",(function(e,t){for(var r,i,o={},u=0;r=e[u];u++)!b(r,"string")||K.test(r)||ie.get(r,t)||"module"===(r=new ie(r,t,!1)).type&&(i=n(r.path))&&!ee.get(r)&&(o[i.prefix]||(o[i.prefix]={fn:i.fn,matches:[]})).matches.push(r);P(o,a)})),!0}();function ge(e,t){i(e,(function(){return t}))}if(o=new L,u=new de(o),ge("/demand/abstract/uuid",N),ge("/demand/abstract/handler",fe),ge("/demand/handler/module",he),ge("/demand/handler/bundle",pe),ge("/demand/handler/component",ve),ge("/demand/plugin/genie",me),ge("/demand/validator/isTypeOf",b),ge("/demand/validator/isArray",ce),ge("/demand/validator/isObject",j),ge("/demand/validator/isInstanceOf",R),ge("/demand/validator/isSemver",E),ge("/demand/function/resolveUrl",U),ge("/demand/function/resolveSourcemaps",le),ge("/demand/function/merge",A),ge("/demand/function/iterate",P),ge("/demand/function/hash",se),ge("/demand/function/defer",I),ge("/demand/function/idle",z),ge("/demand/function/uuid",$),ge("/demand/weakmap",H),ge("/demand/descriptor",x),ge("/demand/pledge",te),ge("/demand/queue",L),ge("/demand/xhr",ue),ge("/demand/failure",re),ge("/demand/semver",Z),c&&c.main)switch(typeof c.main){case"string":r(c.main);break;case"function":i("main",c.main())}}("demand-loader"===this.name?parent:this,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
