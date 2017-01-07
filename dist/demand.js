/**! Qoopido.demand 4.0.1 (MIT OR GPL-3.0+) | https://github.com/dlueth/qoopido.demand | (c) 2017 Dirk Lueth */
!function(e,t,n,r,i){"use strict";function o(e,t,n,r){return{__proto__:Q,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function u(e,t){return typeof e===t}function a(e){return e&&u(e,ee)}function c(e){return u(e,ne)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function s(e,t,n){for(var r,i=Object.keys(e),o=0;(r=i[o])!==z&&t.call(n,r,e[r])!==K;o++);}function l(){return+new Date}function d(e){return _.href=e,_.href}function f(e,t){var n=e.replace(Xe,"");return He.test(n)||_e.test(n)||(n="/"+d((t&&d(t+"/../")||"/")+n).replace(Ne,"")),n}function h(e,t){var n=e.match(Xe);return(n&&n[1]?"mock:":"")+(n&&n[3]||S.handler)+"!"+f(e,t)}function p(){return u(this.uuid,W)&&I(this,"uuid",new o(Ie())),this}function v(){this.parent.constructor.call(this),k[this.uuid]={},e.storage=k[this.uuid]}function m(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=O.call(n))}function g(e){function t(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.deferred.reject(new m(Oe+" (content-type)",e.id)):(e.source=t,Te.emit(be,e.type,e))}function n(t){e.deferred.reject(new m(Oe+(t?" (status)":""),e.id))}function r(o){o=o||0,e.url=i?d(i.process(e.path,o)):e.path,Te.emit(we,e.type,e),new Qe(e.url).then(t,i?function(){o++,i.location[o]?r(o):n()}:n)}var i;_e.test(e.path)||s(S.pattern,function(t,n){n.matches(e.path)&&(!i||i.weight<n.weight)&&(i=n)}),r()}function y(e){return"[object Array]"===C.call(e)}function x(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}function w(){this.parent.constructor.call(this),k[this.uuid]=[]}function b(e){var t=this.parent.constructor.call(this),n=k[t.uuid]={queue:e,current:Q};demand.on(ke+":"+e.uuid,function(){!n.current&&t.process()})}function m(e,t,n){this.message=e,t&&(this.module=t),n&&(this.stack=O.call(n))}function j(e,t){provide(e,function(){return t})}var q,R,S={cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},k={},E=Array.prototype,O=E.slice,P=E.concat,M=Object.prototype,C=M.toString,A=Object.create,I=Object.defineProperty,D=Object.getOwnPropertyNames,T=Object.getOwnPropertyDescriptor,$=Function.prototype,_=t.createElement("a"),H="demand",L="provide",N="path",U="/"+H+"/",X=U+"handler/",F=U+"plugin/",J=U+"function/",B=U+"validator/",G="mock:",Q=null,z=void 0,K=!1,V=!0,W="undefined",Y="string",Z="boolean",ee="object",te="function",ne="number",re=function(){},ie="pre",oe="post",ue="Configure",ae=ie+ue,ce=oe+ue,se="cache",le=se+"Miss",de=se+"Hit",fe=se+"Clear",he=se+"Exceed",pe=ie+"Cache",ve=oe+"Cache",me="Resolve",ge=ie+me,ye=oe+me,xe="Request",we=ie+xe,be=oe+xe,je="Process",qe=ie+je,Re=oe+je,Se="queue",ke=Se+"Enqueue",Ee=Se+"Dequeue",Oe="error loading",Pe="error providing",Me="error resolving",Ce="unspecified anonymous provide";!function(){function e(e){var t,n=this,r=n.prototype,i={},u=D(r),a=0;for(e=e.prototype||e;t=u[a];a++)i[t]=T(r,t);return i.constructor=new o(n),i.parent=new o(e),n.prototype=A(e,i),n}I($,"extends",new o(e))}();var Ae=function(){function e(e,t){var n,r=this[e];t!==z&&(a(t)?(n=a(r),r=t.length!==z?n&&r.length!==z?r:[]:n&&r.length===z?r:{},this[e]=Ae(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==z;r++)s(t,e,n);return n}}(),Ie=function(){function e(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}var t=new RegExp("[xy]","g"),n={};return function(){var r;do r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t,e);while(n[r]);return n[r]=1,r}}(),De=function(){var n,i,o="setImmediate"in e;return"MutationObserver"in e?function(e){n=t.createElement("div"),new MutationObserver(function(){e()}).observe(n,{attributes:V}),n.setAttribute("i","1")}:!o&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?function(){function t(t){t.source===e&&t.data&&k[t.data]&&(k[t.data](),delete k[t.data])}return e.addEventListener("message",t,K),function(t){var n=Ie();k[n]=t,e.postMessage(n,"*")}}():!o&&"onreadystatechange"in(n=t.createElement("script"))?function(e){n.onreadystatechange=function(){n.onreadystatechange=Q,n.parentNode.removeChild(n),e()},t.body.appendChild(n)}:(i=o?setImmediate:r,function(e){i(e)})}(),Te=function(){function e(e,t,r){var a,c;if(u(t,Y)&&u(r,te))for(t=t.split(" ");a=t.shift();)a=a.split(":"),i.test(a[0])&&((o[a[0]]||(o[a[0]]={on:[],after:[]}))[e].push({callback:r,filter:a[1]}),e===n&&a[0]===ce&&(c=S.modules[a[1]])&&r(c))}function t(){}var n="on",r="after",i=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,o={};return t.prototype={emit:function(e,t){var i,u,a,c=o[e];if(c){for(i=O.call(arguments,2),u=0;a=c[n][u];u++)a.filter&&a.filter!==t||a.callback.apply(Q,i);for(u=0;a=c[r][u];u++)a.filter&&a.filter!==t||a.callback.apply(Q,i)}return this},on:function(t,r){return e(n,t,r),this},after:function(t,n){return e(r,t,n),this}},new t}(),$e=function(){var e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;return function(t){return t.replace(e,"\\$&")}}(),_e=/^(http(s?):)?\/\//i,He=/^\//,Le=/\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g,Ne=new RegExp("^"+$e(d("/"))),Ue=new RegExp("^"+H+"|"+L+"|"+N+"$"),Xe=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,Fe=function(t){function n(e){var t;return e.cache!==Q?e.cache:(s(S.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:K)}function r(e,t,n){Te.emit(e,t.id,t,n)}function i(){De(this.clear.expired.bind(this.clear))}var o,u="["+H+"]",a="[state]",c="[value]",d=new RegExp("^"+$e(u)+"\\[(.+?)\\]"+$e(a)+"$"),f=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return K}}(),p=f&&"remainingSpace"in localStorage,v={};return Te.on(le,function(e){De(function(){o.clear.path(e.id)})}).on(be,function(e){e.source&&n(e)&&(v[e.id]=V)}).after(Re,function(e){v[e.id]&&De(function(){o.set(e)})}),i.prototype={get:function(){return f?function(e){var r,i;if(n(e)&&(r=u+"["+e.id+"]",i=t.parse(localStorage.getItem(r+a)),i&&i.version===e.version&&(!i.expires&&!e.lifetime||i.expires>l())))return e.source=localStorage.getItem(r+c),V}:re}(),resolve:function(){return f?function(e){var t=this;t.get(e)?r(de,e):r(le,e)}:function(e){r(le,e)}}(),set:function(){return f?function(e){var i,o,s;if(n(e)){i={version:e.version,expires:e.lifetime?l()+e.lifetime:e.lifetime},o=u+"["+e.id+"]",r(pe,e,i);try{if(s=p?localStorage.remainingSpace:Q,localStorage.setItem(o+c,e.source),localStorage.setItem(o+a,t.stringify(i)),s!==Q&&localStorage.remainingSpace===s)throw new Error("QUOTA_EXCEEDED_ERR");r(ve,e,i)}catch(t){r(he,e)}}}:re}(),clear:{path:function(){return f?function e(e){var t=h(e),n=u+"["+t+"]";localStorage[n+a]&&(localStorage.removeItem(n+a),localStorage.removeItem(n+c),r(fe,Be.get(t)||new Be(t,Q,K)))}:re}(),all:function(){return f?function(){var e;s(localStorage,function(t){e=t.match(d),e&&this.path(e[1])},this)}:re}(),expired:function(){return f?function(){var e,n,r=this;s(localStorage,function(i){e=i.match(d),e&&(n=t.parse(localStorage.getItem(u+"["+e[1]+"]"+a)),n&&n.expires>0&&n.expires<=l()&&r.path(e[1]))},this)}:re}()}},o=new i}(JSON),Je=function(){function e(){s[this.uuid].handle(a,arguments)}function t(){s[this.uuid].handle(c,arguments)}function n(e,t){var n,r,i=s[this.uuid];for(i.state===u&&(i.state=e,i.value=t);n=i[i.state].shift();)r=n.handler.apply(Q,i.value),r&&"function"==typeof r.then?r.then(n.deferred.resolve,n.deferred.reject):n.deferred[i.state===a?"resolve":"reject"].apply(Q,i.value);i[a].length=0,i[c].length=0}function r(e,t,n){e.then(function(){n.resolved[t]=O.call(arguments),n.count++,i(n)},function(){n.rejected.push(O.call(arguments)),i(n)})}function i(e){e.count===e.total?e.deferred.resolve.apply(Q,P.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.deferred.reject.apply(Q,P.apply([],e.rejected))}function o(r){var i=this.parent.constructor.call(this);s[i.uuid]={state:u,handle:n.bind(i),value:Q,resolved:[],rejected:[],count:0},r(e.bind(i),t.bind(i))}var u="pending",a="resolved",c="rejected",s={};return o.prototype={catch:function(e){return this.then(re,e)},always:function(e){return this.then(e,e)},then:function(e,t){var n=s[this.uuid],r=o.defer();return e&&n[a].push({handler:e,deferred:r}),t&&n[c].push({handler:t,deferred:r}),n.state!==u&&De(n.handle),r.pledge},isPending:function(){return s[this.uuid].state===u},isResolved:function(){return s[this.uuid].state===a},isRejected:function(){return s[this.uuid].state===c}},o.defer=function(){var e={};return e.pledge=new o(function(t,n){e.resolve=t,e.reject=n}),e},o.all=function(e){var t,n,i=o.defer(),u=0;if(e.length)for(t=s[Ie()]={deferred:i,resolved:[],rejected:[],total:e.length,count:0};n=e[u];u++)r(n,u,t);else i.resolve();return i.pledge},o.race=function(e){for(var t,n=o.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},o.extends(p)}();v.prototype={get:function(e){return e?k[this.uuid][e]:k[this.uuid]},set:function(e,t){k[this.uuid][e]=t},remove:function(e){delete k[this.uuid][e]}},v.extends(p),m.prototype={toString:function(){var e=this,t=H+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=m.traverse(e.stack,t,1)),t}},m.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=m.traverse(r.stack,t,n+1));return t};var Be=function(){function e(e,t,i){var o=this,u=e.match(Xe)||r;return o.path=f(e,t),o.mock=u[1]?V:K,o.cache=u[2]?"+"===u[1]:Q,o.type=u[3]||S.handler,o.version=u[4]||S.version,o.lifetime=u[5]&&1e3*u[5]||S.lifetime,o.id=(o.mock?G:"")+o.type+"!"+o.path,o.uri=(o.mock?G:"")+o.type+"@"+o.version+(c(o.lifetime)&&o.lifetime>0?"#"+o.lifetime:"")+"!"+o.path,o.deferred=Je.defer(),o.pledge=o.deferred.pledge,i!==K&&n.set(o.id,o),o}var t="internal!",n=new v,r=[];return e.get=function(e,t){return n.get(h(e,t))},e.resolve=function(n,r){var i=r&&Ue.test(n),o=i?this.get(t+r+"/"+n):this.get(n,r);if(!o)if(i)switch(o=new e(t+r+"/"+n),n){case H:o.deferred.resolve(function(){var e=demand.bind(r);return s(demand,function(t,n){e[t]=n}),e}());break;case L:o.deferred.resolve(provide.bind(r));break;case N:o.deferred.resolve(r)}else o=new e(n,r),demand(X+o.type).then(function(e){o.handler=e,o.mock?o.deferred.resolve(e):Fe.resolve(o)},function(){o.deferred.reject(new m(Oe+" (handler)",self.id))});return o},e.remove=function(e,t){var r=h(e,t);Fe.clear.path(r),n.remove(r),n.remove(G+r)},e.list={all:function(){return Object.keys(n.get())},pending:function(){var e=[];return s(n.get(),function(t,n){n.pledge.isPending()&&e.push(t)}),e},resolved:function(){var e=[];return s(n.get(),function(t,n){n.pledge.isResolved()&&e.push(t)}),e},rejected:function(){var e=[];return s(n.get(),function(t,n){n.pledge.isRejected()&&e.push(t)}),e}},e}(),Ge=function(){function e(e,n){var r=this;r.weight=e.length,r.match=new RegExp("^"+$e(e)),r.location=[].concat(n),s(r.location,function(e,n){r.location[e]={url:d(n).replace(t,"$1"),match:new RegExp("^"+$e(n))}})}var t=/(.+)\/$/;return e.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},e}(),Qe=function(t){function n(){this.readyState<4&&this.abort()}var o="XDomainRequest"in e&&e.XDomainRequest||t;return function(e){var u,a=n.bind(this),c=Je.defer(),s=Ne.test(e)?new t:new o,l=S.timeout;return s.ontimeout=s.onerror=s.onabort=function(){c.reject(s.status)},s.onprogress=s.onreadystatechange=function(){i(u),u=r(a,S.timeout)},s.onload=function(){l=i(l),"status"in s&&200!==s.status?c.reject(s.status):c.resolve(s.responseText,s.getResponseHeader&&s.getResponseHeader("content-type"))},s.open("GET",e,V),s.send(),u=r(a,S.timeout),c.pledge}}(XMLHttpRequest);e.demand=function(){function t(){var t,n,r=O.call(arguments),i=this!==e?this:Q,o=0;for(Te.emit(ge,Q,r,i);t=r[o];o++)r[o]=Be.resolve(t,i).pledge;return n=r.length>1?Je.all(r):r[0],n.always(function(){Te.emit(ye,Q,r,i)})}return t.configure=function(e){var n,r=e.cache,i=e.version,o=e.timeout,l=e.lifetime,d=e.base,f=e.pattern,h=e.modules,p=S.modules;return u(r,Z)?S.cache[""]={weight:0,state:r}:a(r)&&s(r,function(e,t){S.cache[e]={weight:e.length,state:t}}),u(i,Y)&&(S.version=i),c(o)&&(S.timeout=1e3*Math.min(Math.max(o,2),12)),c(l)&&l>0&&(S.lifetime=1e3*l),u(d,Y)&&""!==d&&(S.pattern.base=new Ge("",d)),a(f)&&s(f,function(e,t){"base"!==e&&(S.pattern[e]=new Ge(e,t))}),a(h)&&s(h,function(e,t){n=p[e]=p[e]||{},Te.emit(ae,e,n),Ae(n,t),Te.emit(ce,e,n)}),t},t.on=Te.on.bind(t),t.remove=Be.remove,t.list=Be.list,t.clear=Fe.clear,Te.after(le,function(e){new g(e)}).after(de+" "+be,function(e){Te.emit(qe,e.id,e)}).after(we,function(e){var t=e.handler.onPreRequest;t&&t.call(e)}).after(be,function(e){var t=e.handler.onPostRequest;t&&t.call(e)}).after(qe,function(e){var t=e.handler.onPreProcess;t&&t.call(e),e.pledge.then(function(){Te.emit(Re,e.id,e)}),e.handler.enqueue!==K&&(e.delay?e.delay.then(function(){q.enqueue(e)}):q.enqueue(e))}),t}(),e.provide=function(){var t,n,r=u(arguments[0],Y)?arguments[0]:Q,i=this!==e?this:Q,o=y(arguments[r?1:0])?arguments[r?1:0]:Q,a=o?arguments[r?2:1]:arguments[r?1:0];!r&&R.current&&(t=R.current,r=t.uri,R.process()),r?(t=t||new Be(r,i),n=u(a,te),o?demand.apply(t.path,o).then(function(){t.deferred.resolve(n?a.apply(Q,arguments):a)},function(){t.deferred.reject(new m(Pe,t.id,arguments))}):t.deferred.resolve(n?a():a)):!u(console,W)&&console.error(new m(Ce))},demand.configure({cache:V,base:"/",pattern:{"/demand":d((n&&n.url||location.href)+"/../").slice(0,-1)}}),n&&n.settings&&demand.configure(n.settings),w.prototype={enqueue:function(){k[this.uuid]=k[this.uuid].concat(O.call(arguments)),Te.emit(ke,this.uuid)},dequeue:function(){return Te.emit(Ee,this.uuid),k[this.uuid].shift()},get current(){return k[this.uuid][0]},get length(){return k[this.uuid].length}},w.extends(p),b.prototype={process:function(){var e,t=k[this.uuid];t.queue.length?(e=t.current=t.queue.dequeue(),e.handler.process&&e.handler.process.call(e)):t.current=Q},get current(){return k[this.uuid].current}},b.extends(p);var ze=function(){var e=t.getElementsByTagName("head")[0],n=/^(application|text)\/(x-)?javascript/;return{validate:function(e){return n.test(e)},onPreRequest:function(){var e=this.url;this.url=".js"!==e.slice(-3)?e+".js":e},onPostRequest:function(){for(var e,t,n=this;e=Le.exec(n.source);)_e.test(e[1])?(_.href=n.url,t=_.protocol+"//"+_.host+e[1]):t=d(n.url+"/../"+e[1]),n.source=n.source.replace(e[0],"//# sourceMappingURL="+t+".map")},process:function(){var n,r=this;r.source&&(n=t.createElement("script"),n.async=V,n.text=r.source,n.setAttribute("demand-id",r.id),e.appendChild(n))}}}();m.prototype={toString:function(){var e=this,t=H+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=m.traverse(e.stack,t,1)),t}},m.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=m.traverse(r.stack,t,n+1));return t};var Ke=function(){function e(e){for(var t,r,i=0;r=e[i];i++)if(r=r.match(Xe),r=r&&r[3]||n.handler,t){if(r!==t)return K}else t=r;return t}var t=X+"bundle",n={};return demand.on(ce+":"+t,function(e){var t,r;a(e)&&(n=e,s(n,function(e,n){for(t=0;r=n[t];t++)u(r,Y)&&(n[t]=h(r))}))}),{enqueue:K,validate:ze.validate,onPreProcess:function(){function t(){l.reject(new m(Me,c.id,arguments))}var r,i,o,u,a,c=this,s=c.source,l=c.deferred,d=n[c.path];if(d&&(r=e(d))){for(;i=Le.exec(s);)s=s.replace(i[0],"");for(c.source=s,o=[],a=0;u=d[a];a++)o.push(Be.resolve(G+u).pledge);Je.all(o).then(function(){for(o.length=0,a=0;u=d[a];a++)u=d[a]=Be.get(u)||new Be(u),u.handler=arguments[a],o.push(u.pledge);"module"===r?(q.enqueue.apply(q,d),ze.process.call(c)):(ze.process.call(c),q.enqueue.apply(q,d)),Je.all(o).then(l.resolve,t)},t)}else t()}}}(),Ve=function(){function e(e){for(var t,n,r=0;t=o[r];r++)0===e.indexOf(t.prefix)&&(!n||t.weight>n.weight)&&(n=t);return n}function t(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules[X+"bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}function n(){for(var e,t=0;e=this[t];t++)e.deferred.resolve(arguments[t])}function r(){for(var e,t=0;e=this[t];t++)e.deferred.reject(new m(Me,e.id))}var i=F+"genie",o=[];return demand.on(ce+":"+i,function(e){a(e)&&(o.length=0,s(e,function(e,t){o.push({prefix:e,weight:e.length,fn:t})}))}).on(ge,function(o,a){var c,l,d,f,h={};for(c=0;l=o[c];c++)!u(l,Y)||Ue.test(l)||Be.get(l,a)||(l=new Be(l,a,K),"module"===l.type&&(d=e(l.path))&&!Fe.get(l)&&(h[d.prefix]||(h[d.prefix]={fn:d.fn,matches:[]})).matches.push(l));s(h,function(e,o){if(f=o.matches,f.length>1){for(o.id=i+"/"+x(JSON.stringify(o.matches)),c=0;l=f[c];c++)f[c]=new Be(l.uri);demand.configure(t(o)),demand("bundle!"+o.id).then(n.bind(f),r.bind(f))}})}),V}();q=new w,R=new b(q),j(X+"module",ze),j(X+"bundle",Ke),j(F+"genie",Ve),j(B+"isTypeOf",u),j(B+"isArray",y),j(B+"isObject",a),j(J+"resolveUrl",d),j(J+"merge",Ae),j(J+"iterate",s),j(J+"hash",x),j(J+"defer",De),j(J+"uuid",Ie),j(U+"descriptor",o),j(U+"pledge",Je),j(U+"queue",w),j(U+"xhr",Qe),j(U+"failure",m),n&&n.main&&demand(n.main)}(this,document,"demand"in this&&demand,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
