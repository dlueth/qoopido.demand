/**! Qoopido.demand 4.0.0 (MIT OR GPL-3.0+) | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(e,t,n,r,i){"use strict";function o(e,t,n){for(var r,i=Object.keys(e),o=0;(r=i[o])!==K&&t.call(n,r,e[r])!==V;o++);}function u(e,t,n,r){return{__proto__:z,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function a(e,t){return typeof e===t}function c(e){return e&&a(e,te)}function s(e){return a(e,re)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function l(){return+new Date}function d(e){return H.href=e,H.href}function f(e,t){var n=e.replace(Fe,"");return Le.test(n)||He.test(n)||(n="/"+d((t&&d(t+"/../")||"/")+n).replace(Ue,"")),n}function h(e,t){var n=e.match(Fe);return(n&&n[1]?"mock:":"")+(n&&n[3]||E.handler)+"!"+f(e,t)}function p(){return a(this.uuid,Y)&&D(this,"uuid",new u(De())),this}function v(){this.parent.constructor.call(this),k[this.uuid]={}}function g(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=P.call(n))}function m(e){function t(t,n){!e.handler.validate||e.handler.validate(n)?(e.source=t,$e.emit(je,e.type,e)):e.deferred.reject(new g(Pe+" (content-type)",e.id))}function n(t){e.deferred.reject(new g(Pe+(t?" (status)":""),e.id))}function r(o){o=o||0,e.url=i?d(i.process(e.path,o)):e.path,$e.emit(be,e.type,e),new ze(e.url).then(t,i?function(){o++,i.location[o]?r(o):n()}:n)}var i;He.test(e.path)||o(E.pattern,function(t,n){n.matches(e.path)&&(!i||i.weight<n.weight)&&(i=n)}),r()}function y(e){return"[object Array]"===A.call(e)}function x(e){return a(console,Y)||console.error(e.toString()),e}function w(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}function b(){this.parent.constructor.call(this),k[this.uuid]=[]}function j(e){var t=this.parent.constructor.call(this),n=k[t.uuid]={queue:e,current:z};$e.on(ke+":"+e.uuid,function(){!n.current&&t.process()})}function g(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=P.call(n))}function R(e,t){provide(e,function(){return t})}var S,q,E={cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},k={},O=Array.prototype,P=O.slice,M=O.concat,C=Object.prototype,A=C.toString,I=Object.create,D=Object.defineProperty,T=Object.getOwnPropertyNames,$=Object.getOwnPropertyDescriptor,_=Function.prototype,H=t.createElement("a"),L="demand",N="provide",U="path",X="/"+L+"/",F=X+"handler/",J=X+"plugin/",B=X+"function/",G=X+"validator/",Q="mock:",z=null,K=void 0,V=!1,W=!0,Y="undefined",Z="string",ee="boolean",te="object",ne="function",re="number",ie=function(){},oe="pre",ue="post",ae="Configure",ce=oe+ae,se=ue+ae,le="cache",de=le+"Miss",fe=le+"Hit",he=le+"Clear",pe=le+"Exceed",ve=oe+"Cache",ge=ue+"Cache",me="Resolve",ye=oe+me,xe=ue+me,we="Request",be=oe+we,je=ue+we,Re="Process",Se=oe+Re,qe=ue+Re,Ee="queue",ke=Ee+"Enqueue",Oe=Ee+"Dequeue",Pe="error loading",Me="error providing",Ce="error resolving",Ae="unspecified anonymous provide";!function(){function e(e){var t=this,n=t.prototype,r={};return e=e.prototype||e,T(n).forEach(function(e){r[e]=$(n,e)}),r.constructor=new u(t),r.parent=new u(e),t.prototype=I(e,r),t}D(_,"extends",new u(e))}();var Ie=function(){function e(e,t){var n,r=this[e];t!==K&&(c(t)?(n=c(r),r=t.length!==K?n&&r.length!==K?r:[]:n&&r.length===K?r:{},this[e]=Ie(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==K;r++)o(t,e,n);return n}}(),De=function(){function e(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}var t=new RegExp("[xy]","g"),n={};return function(){var r;do r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t,e);while(n[r]);return n[r]=1,r}}(),Te=function(){var n,i,o="setImmediate"in e;return"MutationObserver"in e?function(e){n=t.createElement("div"),new MutationObserver(function(){e()}).observe(n,{attributes:W}),n.setAttribute("i","1")}:!o&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?function(){function t(t){t.source===e&&t.data&&k[t.data]&&(k[t.data](),delete k[t.data])}return e.addEventListener("message",t,V),function(t){var n=De();k[n]=t,e.postMessage(n,"*")}}():!o&&"onreadystatechange"in(n=t.createElement("script"))?function(e){n.onreadystatechange=function(){n.onreadystatechange=z,n.parentNode.removeChild(n),e()},t.body.appendChild(n)}:(i=o?setImmediate:r,function(e){i(e)})}(),$e=function(){function e(){}var t=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,n={};return e.prototype={emit:function(e,t){var r,i,o,u=n[e];if(u)for(r=P.call(arguments,2),i=0;o=u[i];i++)o.filter&&o.filter!==t||o.callback.apply(z,r);return this},on:function(e,r){var i,o;if(a(e,Z)&&a(r,ne))for(e=e.split(" ");i=e.shift();)i=i.split(":"),t.test(i[0])&&((n[i[0]]||(n[i[0]]=[])).push({callback:r,filter:i[1]}),i[0]===se&&(o=E.modules[i[1]])&&r(o));return this}},new e}(),_e=function(){var e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;return function(t){return t.replace(e,"\\$&")}}(),He=/^(http(s?):)?\/\//i,Le=/^\//,Ne=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,Ue=new RegExp("^"+_e(d("/"))),Xe=new RegExp("^"+L+"|"+N+"|"+U+"$"),Fe=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,Je=function(t){function n(e){var t;return e.cache!==z?e.cache:(o(E.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:V)}function r(e,t,n){$e.emit(e,t.id,t,n)}function i(){}var u,a="["+L+"]",c="[state]",s="[value]",d=new RegExp("^"+_e(a)+"\\[(.+?)\\]"+_e(c)+"$"),f=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return V}}(),p=f&&"remainingSpace"in localStorage;return $e.on(qe,function(e){Te(function(){e.source&&u.set(e)})}).on(de,function(e){Te(function(){u.clear.path(e.id)})}),i.prototype={get:function(){return f?function(e){var r,i;if(n(e)&&(r=a+"["+e.id+"]",i=t.parse(localStorage.getItem(r+c)),i&&i.version===e.version&&(!i.expires&&!e.lifetime||i.expires>l())))return e.source=localStorage.getItem(r+s),W}:ie}(),resolve:function(){return f?function(e){this.get(e)?r(fe,e):r(de,e)}:function(e){r(de,e)}}(),set:function(){return f?function(e){var i;n(e)&&(i={version:e.version,expires:e.lifetime?l()+e.lifetime:e.lifetime},r(ve,e,i),Te(function(){var n,o=a+"["+e.id+"]";try{if(n=p?localStorage.remainingSpace:z,localStorage.setItem(o+s,e.source),localStorage.setItem(o+c,t.stringify(i)),n!==z&&localStorage.remainingSpace===n)throw new Error("QUOTA_EXCEEDED_ERR");r(ge,e,i)}catch(t){r(pe,e)}}))}:ie}(),clear:{path:function(){return f?function e(e){var t=h(e),n=a+"["+t+"]";localStorage[n+c]&&Te(function(){localStorage.removeItem(n+c),localStorage.removeItem(n+s),r(he,Ge.get(t)||new Ge(t,z,V))})}:ie}(),all:function(){return f?function(){var e;o(localStorage,function(t){e=t.match(d),e&&this.path(e[1])},this)}:ie}(),expired:function(){return f?function(){var e,n;o(localStorage,function(r){e=r.match(d),e&&(n=t.parse(localStorage.getItem(a+"["+e[1]+"]"+c)),n&&n.expires>0&&n.expires<=l()&&this.path(e[1]))},this)}:ie}()}},u=new i}(JSON),Be=function(){function e(){s[this.uuid].handle(a,arguments)}function t(){s[this.uuid].handle(c,arguments)}function n(e,t){var n,r,i=s[this.uuid];for(i.state===u&&(i.state=e,i.value=t);n=i[i.state].shift();)r=n.handler.apply(z,i.value),r&&"function"==typeof r.then?r.then(n.deferred.resolve,n.deferred.reject):n.deferred[i.state===a?"resolve":"reject"].apply(z,i.value);i[a].length=0,i[c].length=0}function r(e,t,n){e.then(function(){n.resolved[t]=P.call(arguments),n.count++,i(n)},function(){n.rejected.push(P.call(arguments)),i(n)})}function i(e){e.count===e.total?e.deferred.resolve.apply(z,M.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.deferred.reject.apply(z,M.apply([],e.rejected))}function o(r){var i=this.parent.constructor.call(this);s[i.uuid]={state:u,handle:n.bind(i),value:z,resolved:[],rejected:[],count:0},r(e.bind(i),t.bind(i))}var u="pending",a="resolved",c="rejected",s={};return o.prototype={catch:function(e){return this.then(ie,e)},always:function(e){return this.then(e,e)},then:function(e,t){var n=s[this.uuid],r=o.defer();return e&&n[a].push({handler:e,deferred:r}),t&&n[c].push({handler:t,deferred:r}),n.state!==u&&Te(n.handle),r.pledge},isPending:function(){return s[this.uuid].state===u},isResolved:function(){return s[this.uuid].state===a},isRejected:function(){return s[this.uuid].state===c}},o.defer=function(){var e={};return e.pledge=new o(function(t,n){e.resolve=t,e.reject=n}),e},o.all=function(e){for(var t,n=o.defer(),i=s[De()]={deferred:n,resolved:[],rejected:[],total:e.length,count:0},u=0;t=e[u];u++)r(t,u,i);return n.pledge},o.race=function(e){for(var t,n=o.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return n.pledge},o.extends(p)}();v.prototype={get:function(e){return e?k[this.uuid][e]:k[this.uuid]},set:function(e,t){k[this.uuid][e]=t}},v.extends(p),g.prototype={toString:function(){var e=this,t=L+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=g.traverse(e.stack,t,1)),t}},g.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=g.traverse(r.stack,t,n+1));return t};var Ge=function(){function e(e,r,i){var o=this,u=e.match(Fe)||n;return o.path=f(e,r),o.mock=u[1]?W:V,o.cache=u[2]?"+"===u[1]:z,o.type=u[3]||E.handler,o.version=u[4]||E.version,o.lifetime=u[5]&&1e3*u[5]||E.lifetime,o.id=(o.mock?Q:"")+o.type+"!"+o.path,o.uri=(o.mock?Q:"")+o.type+"@"+o.version+(s(o.lifetime)&&o.lifetime>0?"#"+o.lifetime:"")+"!"+o.path,o.deferred=Be.defer(),o.pledge=o.deferred.pledge,i!==V&&t.set(o.id,o),o}var t=new v,n=[];return e.get=function(e,n){return t.get(h(e,n))},e.resolve=function(t,n){var r=this.get(t,n);if(!r)if(r=new e(t,n),n&&Xe.test(t))switch(t){case L:r.deferred.resolve(function(){var e=demand.bind(n);return o(demand,function(t,n){e[t]=n}),e}());break;case N:r.deferred.resolve(provide.bind(n));break;case U:r.deferred.resolve(n)}else demand(F+r.type).then(function(e){r.handler=e,r.mock?r.deferred.resolve(e):Je.resolve(r)},function(){r.deferred.reject(new g(Pe+" (handler)",self.id))});return r},e.list={all:function(){return Object.keys(t.get())},pending:function(){var e=[];return o(t.get(),function(t,n){n.pledge.isPending()&&e.push(t)}),e},resolved:function(){var e=[];return o(t.get(),function(t,n){n.pledge.isResolved()&&e.push(t)}),e},rejected:function(){var e=[];return o(t.get(),function(t,n){n.pledge.isRejected()&&e.push(t)}),e}},e}(),Qe=function(){function e(e,n){var r=this;r.weight=e.length,r.match=new RegExp("^"+_e(e)),r.location=[].concat(n),o(r.location,function(e,n){r.location[e]={url:d(n).replace(t,"$1"),match:new RegExp("^"+_e(n))}})}var t=/(.+)\/$/;return e.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},e}(),ze=function(t){function n(){this.readyState<4&&this.abort()}var o="XDomainRequest"in e&&e.XDomainRequest||t;return function(e){var u,a=n.bind(this),c=Be.defer(),s=Ue.test(e)?new t:new o,l=E.timeout;return s.ontimeout=s.onerror=s.onabort=function(){c.reject(s.status)},s.onprogress=s.onreadystatechange=function(){i(u),u=r(a,E.timeout)},s.onload=function(){l=i(l),"status"in s&&200!==s.status?c.reject(s.status):c.resolve(s.responseText,s.getResponseHeader&&s.getResponseHeader("content-type"))},s.open("GET",e,W),s.send(),u=r(a,E.timeout),c.pledge}}(XMLHttpRequest);e.demand=function(){function t(){var t,n=P.call(arguments),r=this!==e?this:z,i=0;for($e.emit(ye,z,n,r);t=n[i];i++)n[i]=Ge.resolve(t,r).pledge;return Be.all(n).always(function(){$e.emit(xe,z,n,r)})}return t.configure=function(e){var n,r=e.cache,i=e.version,u=e.timeout,l=e.lifetime,d=e.base,f=e.pattern,h=e.modules,p=E.modules;return a(r,ee)?E.cache[""]={weight:0,state:r}:c(r)&&o(r,function(e,t){E.cache[e]={weight:e.length,state:t}}),a(i,Z)&&(E.version=i),s(u)&&(E.timeout=1e3*Math.min(Math.max(u,2),12)),s(l)&&l>0&&(E.lifetime=1e3*l),a(d,Z)&&""!==d&&(E.pattern.base=new Qe("",d)),c(f)&&o(f,function(e,t){"base"!==e&&(E.pattern[e]=new Qe(e,t))}),c(h)&&o(h,function(e,t){n=p[e]=p[e]||{},$e.emit(ce,e,n),Ie(n,t),$e.emit(se,e,n)}),t},t.on=$e.on.bind(t),t.list=Ge.list,t.clear=Je.clear,t.on(de,function(e){Te(function(){new m(e)})}).on(fe+" "+je,function(e){Te(function(){$e.emit(Se,e.id,e)})}).on(be,function(e){var t=e.handler.onPreRequest;t&&t.call(e)}).on(je,function(e){var t=e.handler.onPostRequest;t&&t.call(e)}).on(Se,function(e){var t=e.handler.onPreProcess,n=e.handler.enqueue!==V?Te.bind(z,function(){S.enqueue(e)}):z;t&&t.call(e),e.pledge.then(function(){$e.emit(qe,e.id,e)}),n&&(e.delay?e.delay.then(n):n())}),t}(),e.provide=function(){var t,n,r=a(arguments[0],Z)?arguments[0]:z,i=this!==e?this:z,o=y(arguments[r?1:0])?arguments[r?1:0]:z,u=o?arguments[r?2:1]:arguments[r?1:0];!r&&q.current&&(t=q.current,r=t.uri,q.process()),r?(t=t||new Ge(r,i),n=a(u,ne),o?demand.apply(t.path,o).then(function(){t.deferred.resolve(n?u.apply(z,arguments):u)},function(){t.deferred.reject(x(new g(Me,t.id,arguments)))}):t.deferred.resolve(n?u():u)):x(new g(Ae))},demand.configure({cache:W,base:"/",pattern:{"/demand":d((n&&n.url||location.href)+"/../").slice(0,-1)}}),n&&n.settings&&demand.configure(n.settings),b.prototype={enqueue:function(){k[this.uuid]=k[this.uuid].concat(P.call(arguments)),$e.emit(ke,this.uuid)},dequeue:function(){return $e.emit(Oe,this.uuid),k[this.uuid].shift()},get current(){return k[this.uuid][0]},get length(){return k[this.uuid].length}},b.extends(p),j.prototype={process:function(){var e,t=k[this.uuid];t.queue.length?(e=t.current=t.queue.dequeue(),e.handler.process&&e.handler.process.call(e)):t.current=z},get current(){return k[this.uuid].current}},j.extends(p);var Ke=function(){var e=t.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/;return{validate:function(e){return n.test(e)},onPreRequest:function(){var e=this.url;this.url=".js"!==e.slice(-3)?e+".js":e},onPostRequest:function(){for(var e,t,n=this;e=Ne.exec(n.source);)He.test(e[1])?(H.href=n.url,t=H.protocol+"//"+H.host+e[1]):t=d(n.url+"/../"+e[1]),n.source=n.source.replace(e[0],"//# sourceMappingURL="+t+".map")},process:function(){var n,r=this;r.source&&(n=t.createElement("script"),n.async=W,n.text=r.source,n.setAttribute("demand-id",r.id),e.appendChild(n))}}}();g.prototype={toString:function(){var e=this,t=L+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=g.traverse(e.stack,t,1)),t}},g.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=g.traverse(r.stack,t,n+1));return t};var Ve=function(){function e(e){for(var t,r,i=0;r=e[i];i++)if(r=r.match(Fe),r=r&&r[3]||n.handler,t){if(r!==t)return V}else t=r;return t}var t=F+"bundle",n={};return demand.on(se+":"+t,function(e){var t,r;c(e)&&(n=e,o(n,function(e,n){for(t=0;r=n[t];t++)a(r,Z)&&(n[t]=h(r))}))}),{enqueue:V,validate:Ke.validate,onPreProcess:function(){function t(){l.reject(new g(Ce,c.id,arguments))}var r,i,o,u,a,c=this,s=c.source,l=c.deferred,d=n[c.path];if(d&&(r=e(d))){for(;i=Ne.exec(s);)s=s.replace(i[0],"");for(c.source=s,o=[],a=0;u=d[a];a++)o.push(Ge.resolve(Q+u).pledge);Be.all(o).then(function(){for(o.length=0,a=0;u=d[a];a++)u=d[a]=Ge.get(u)||new Ge(u),u.handler=arguments[a],o.push(u.pledge);"module"===r?(S.enqueue.apply(S,d),Ke.process.call(c)):(Ke.process.call(c),S.enqueue.apply(S,d)),Be.all(o).then(l.resolve,t)},t)}else t()}}}(),We=function(){function e(e){for(var t,n,r=0;t=u[r];r++)0===e.indexOf(t.prefix)&&(!n||t.weight>n.weight)&&(n=t);return n}function t(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules[F+"bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}function n(){for(var e,t=0;e=this[t];t++)e.deferred.resolve(arguments[t])}function r(){for(var e,t=0;e=this[t];t++)e.deferred.reject(new g(Ce,e.id))}var i=J+"genie",u=[];return demand.on(se+":"+i,function(e){c(e)&&(u.length=0,o(e,function(e,t){u.push({prefix:e,weight:e.length,fn:t})}))}).on(ye,function(u,c){var s,l,d,f,h={};for(s=0;l=u[s];s++)!a(l,Z)||Xe.test(l)||Ge.get(l,c)||(l=new Ge(l,c,V),"module"===l.type&&!Je.get(l)&&(d=e(l.path))&&(l.index=s,(h[d.prefix]||(h[d.prefix]={fn:d.fn,matches:[]})).matches.push(l)));o(h,function(e,o){if(f=o.matches,f.length>1){for(o.id=i+"/"+w(JSON.stringify(o.matches)),s=0;l=f[s];s++)!Ge.get(l.uri)&&new Ge(l.uri);demand.configure(t(o)),demand("bundle!"+o.id).then(n.bind(f),r.bind(f))}})}),W}();S=new b,q=new j(S),R(F+"module",Ke),R(F+"bundle",Ve),R(J+"genie",We),R(G+"isTypeOf",a),R(G+"isArray",y),R(G+"isObject",c),R(B+"resolveUrl",d),R(B+"merge",Ie),R(B+"iterate",o),R(B+"hash",w),R(B+"defer",Te),R(B+"uuid",De),R(X+"descriptor",u),R(X+"pledge",Be),R(X+"queue",b),R(X+"xhr",ze),R(X+"failure",g),n&&n.main&&demand(n.main)}(this,document,"demand"in this&&demand,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
