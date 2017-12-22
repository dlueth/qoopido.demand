/**! Qoopido.demand 4.2.4-alpha.1 | https://github.com/dlueth/qoopido.demand | (c) 2017 Dirk Lueth */
!function(e,t,n,r,i){"use strict";function o(e,t,n,r){return{__proto__:Y,value:e,enumerable:!!r,configurable:!!n,writable:!!t}}function u(e,t){return typeof e===t}function a(e){return e&&u(e,oe)}function c(e){return u(e,ae)&&isFinite(e)&&Math.floor(e)===e&&e>=0}function s(e,t){return e instanceof t}function f(e,t,n){for(var r,i=$.keys(e),o=0;(r=i[o])!==Z&&t.call(n,r,e[r])!==ee;o++);return n}function d(e,t,n){return M.call(e,t,n)}function l(){return+new Date}function h(e){return X.href=e,X.href}function p(e,t){var n=e.replace(ze,"");return Ue.test(n)||Fe.test(n)||(n="/"+h((t&&h(t+"/../")||"/")+n).replace(Ge,"")),n}function v(e,t){var n=e.match(ze);return(n&&n[1]?"mock:":"")+(n&&n[3]||C.handler)+"!"+p(e,t)}function m(){return u(this.uuid,ne)&&I(this,"uuid",new o(Ne())),this}function g(){var e=m.call(this);return S[e.uuid]={},e}function y(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=d(n)),r}function x(e){function n(t,n){n&&e.handler.validate&&!e.handler.validate(n)?e.dfd.reject(new y($e+" (content-type)",e.id)):(e.source=t,_e.emit(Pe,e.type,e))}function r(t){e.dfd.reject(new y($e+(t?" (status)":""),e.id))}function i(u){u=u||0,e.url=t.createElement("a"),e.url.href=o?h(o.process(e.path,u)):e.path,_e.emit(ke,e.type,e),new Ye(e.url).then(n,o?function(){u++,o.location[u]?i(u):r()}:r)}var o;Fe.test(e.path)||f(C.pattern,function(t,n){n.matches(e.path)&&(!o||o.weight<n.weight)&&(o=n)}),i()}function w(e){return"[object Array]"===D.call(e)}function b(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}function j(){var e=m.call(this);return S[e.uuid]=[],e}function q(e){var t=m.call(this),n=S[t.uuid]={queue:e,current:Y};return demand.on(Me+":"+e.uuid,function(){!n.current&&t.process()}),t}function R(e,t){for(var n,r;n=Be.exec(t);)X.href=e,Fe.test(n[2])?r=X.protocol+"//"+X.host+n[3]:(X.pathname+="/../"+n[3],r=X.protocol+"//"+X.host+X.pathname),t=t.replace(n[0],n[1]+" "+n[2]+"="+r+".map"+(n[4]?" "+n[4]:""));return t}function y(e,t,n){var r=this;return r.message=e,t&&(r.module=t),n&&(r.stack=d(n)),r}function k(e,t){provide(e,function(){return t})}var P,E,C={version:"1.0.0",cache:{},timeout:8e3,pattern:{},modules:{},handler:"module"},S={},O=Array.prototype,M=O.slice,A=O.concat,$=Object,T=$.prototype,D=T.toString,H=$.create,I=$.defineProperty,N=$.getOwnPropertyNames,L=$.getOwnPropertyDescriptor,_=Function.prototype,X=t.createElement("a"),F="demand",U="provide",B="path",G="/"+F+"/",J=G+"abstract/",z=G+"handler/",K=G+"plugin/",Q=G+"function/",V=G+"validator/",W="mock:",Y=null,Z=void 0,ee=!1,te=!0,ne="undefined",re="string",ie="boolean",oe="object",ue="function",ae="number",ce=function(){},se="pre",fe="post",de="Configure",le=se+de,he=fe+de,pe="cache",ve=pe+"Miss",me=pe+"Hit",ge=pe+"Clear",ye=pe+"Exceed",xe=se+"Cache",we=fe+"Cache",be="Resolve",je=se+be,qe=fe+be,Re="Request",ke=se+Re,Pe=fe+Re,Ee="Process",Ce=se+Ee,Se=fe+Ee,Oe="queue",Me=Oe+"Enqueue",Ae=Oe+"Dequeue",$e="error loading",Te="error providing",De="error resolving",He="unspecified anonymous provide";!function(){function e(e){for(var t,n=this,r=n.prototype,i={},u=N(r),a=0;t=u[a];a++)i[t]=L(r,t);return i.constructor=new o(n),n.prototype=H(e.prototype||e,i),n}I(_,"extends",new o(e))}();var Ie=function(){function e(e,t){var n,r=this[e];t!==Z&&(a(t)?(n=a(r),r=t.length!==Z?n&&r.length!==Z?r:[]:n&&r.length===Z?r:{},this[e]=Ie(r,t)):this[e]=t)}return function(){for(var t,n=arguments[0],r=1;(t=arguments[r])!==Z;r++)f(t,e,n);return n}}(),Ne=function(){function e(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}var t=new RegExp("[xy]","g"),n={};return function(){var r;do r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t,e);while(n[r]);return n[r]=1,r}}(),Le=function(){var n,i,o="setImmediate"in e;return"MutationObserver"in e?function(e){n=t.createElement("div"),new MutationObserver(function(){e()}).observe(n,{attributes:te}),n.setAttribute("i","1")}:!o&&"postMessage"in e&&!("importScripts"in e)&&"addEventListener"in e?function(){function t(t){t.source===e&&t.data&&S[t.data]&&(S[t.data](),delete S[t.data])}return e.addEventListener("message",t,ee),function(t){var n=Ne();S[n]=t,e.postMessage(n,"*")}}():!o&&"onreadystatechange"in(n=t.createElement("script"))?function(e){n.onreadystatechange=function(){n.onreadystatechange=Y,n.parentNode.removeChild(n),e()},t.body.appendChild(n)}:(i=o?setImmediate:r,function(e){i(e)})}(),_e=function(){function e(e,t,r){var a,c;if(u(t,re)&&u(r,ue))for(t=t.split(" ");a=t.shift();)a=a.split(":"),i.test(a[0])&&((o[a[0]]||(o[a[0]]={on:[],after:[]}))[e].push({callback:r,filter:a[1]}),e===n&&a[0]===he&&(c=C.modules[a[1]])&&r(c))}function t(){}var n="on",r="after",i=/^cache(Miss|Hit|Clear|Exceed)|queue(En|De)queue|(pre|post)(Resolve|Configure|Request|Process|Cache)$/,o={};return t.prototype={emit:function(e,t){var i,u,a,c=o[e];if(c){for(i=d(arguments,2),u=0;a=c[n][u];u++)a.filter&&a.filter!==t||a.callback.apply(Y,i);for(u=0;a=c[r][u];u++)a.filter&&a.filter!==t||a.callback.apply(Y,i)}return this},on:function(t,r){return e(n,t,r),this},after:function(t,n){return e(r,t,n),this}},new t}(),Xe=function(){var e=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;return function(t){return t.replace(e,"\\$&")}}(),Fe=/^(http(s?):)?\/\//i,Ue=/^\//,Be=/((?:\/\/|\/\*)#)\s*(sourceMappingURL)\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map(?:\s+)?(\*\/)?/g,Ge=new RegExp("^"+Xe(h("/"))),Je=new RegExp("^"+F+"|"+U+"|"+B+"$"),ze=/^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/,Ke=function(){function t(e){var t;return e.cache!==Y?e.cache:(f(C.cache,function(n,r){0===e.path.indexOf(n)&&(!t||r.weight>t.weight)&&(t=r)}),t?t.state:ee)}function n(e){return x.getItem(e)}function r(e,t){x[t?"setItem":"removeItem"](e,t)}function i(e){var t,r=n(e);if(r&&(t=r.match(g)))return d(t,1)}function o(e,t){t[4]=l(),r(e,t.join(","))}function u(e,t,n){_e.emit(e,t.id,t,n)}function a(){Le(this.clear.expired.bind(this.clear))}var c,s="["+F+"]",h="[state]",p="[value]",m=new RegExp("^"+Xe(s)+"\\[(.+?)\\]"+Xe(h)+"$"),g=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/,y=function(){try{return"localStorage"in e&&e.localStorage}catch(e){return ee}}(),x=y?e.localStorage:Y,w=y&&"remainingSpace"in x,b={};return _e.on(ve,function(e){Le(function(){c.clear.path(e.id)})}).on(ye,function(e){demand("-!/"+F+"/cache/dispose").then(function(t){Le(function(){t(e.source.length),c.set(e)})})}).on(Pe,function(e){e.source&&t(e)&&(b[e.id]=te)}).after(Se,function(e){b[e.id]&&Le(function(){c.set(e)})}),a.prototype={get:y?function(e){var r,u;if(t(e)&&(r=s+"["+e.id+"]",u=i(r+h),u&&u[0]===e.version&&(!u[2]&&!e.lifetime||u[2]>l())))return e.source=n(r+p),Le(function(){o(r+h,u)}),te}:ce,resolve:y?function(e){var t=this;t.get(e)?u(me,e):u(ve,e)}:function(e){u(ve,e)},set:y?function(e){var n,i,a;if(t(e)){n=[e.version,e.source.length,e.lifetime?l()+e.lifetime:Y,demand.version],i=s+"["+e.id+"]",u(xe,e,n);try{if(a=w?x.remainingSpace:Y,r(i+p,e.source),o(i+h,n),a!==Y&&x.remainingSpace===a)throw new Error;u(we,e,n)}catch(t){u(ye,e)}}}:ce,clear:{path:y?function(e){var t=v(e),i=s+"["+t+"]";n(i+h)&&(r(i+h),r(i+p),u(ge,Ve.get(t)||new Ve(t,Y,ee)))}:ce,all:y?function(){var e;f(x,function(t){e=t.match(m),e&&this.path(e[1])},this)}:ce,expired:y?function(){var e,t,n=this;f(x,function(r){e=r.match(m),e&&(t=i(s+"["+e[1]+"]"+h),t&&t[2]>0&&t[2]<=l()&&n.path(e[1]))},this)}:ce}},c=new a}(),Qe=function(){function e(){s[this.uuid].handle(a,arguments)}function t(){s[this.uuid].handle(c,arguments)}function n(e,t){var n,r,i=s[this.uuid];for(i.state===u&&(i.state=e,i.value=t);n=i[i.state].shift();)r=n.handler.apply(Y,i.value),r&&"function"==typeof r.then?r.then(n.dfd.resolve,n.dfd.reject):n.dfd[i.state===a?"resolve":"reject"].apply(Y,i.value);i[a].length=0,i[c].length=0}function r(e,t,n){e.then(function(){n.resolved[t]=d(arguments),n.count++,i(n)},function(){n.rejected.push(d(arguments)),i(n)})}function i(e){e.count===e.total?e.dfd.resolve.apply(Y,A.apply([],e.resolved)):e.rejected.length+e.count===e.total&&e.dfd.reject.apply(Y,A.apply([],e.rejected))}function o(r){var i=m.call(this);return s[i.uuid]={state:u,handle:n.bind(i),value:Y,resolved:[],rejected:[],count:0},r(e.bind(i),t.bind(i)),i}var u="pending",a="resolved",c="rejected",s={};return o.prototype={catch:function(e){return this.then(ce,e)},always:function(e){return this.then(e,e)},then:function(e,t){var n=s[this.uuid],r=o.defer();return e&&n[a].push({handler:e,dfd:r}),t&&n[c].push({handler:t,dfd:r}),n.state!==u&&Le(n.handle),r.pledge},isPending:function(){return s[this.uuid].state===u},isResolved:function(){return s[this.uuid].state===a},isRejected:function(){return s[this.uuid].state===c}},o.defer=function(){var e={};return e.pledge=new o(function(t,n){e.resolve=t,e.reject=n}),e},o.all=function(e){var t,n,i=o.defer(),u=0;if(e.length)for(t=s[Ne()]={dfd:i,resolved:[],rejected:[],total:e.length,count:0};n=e[u];u++)r(n,u,t);else i.resolve();return i.pledge},o.race=function(e){for(var t,n=o.defer(),r=0;t=e[r];r++)t.then(n.resolve,n.reject);return e.length||n.resolve(),n.pledge},o.extends(m)}();g.prototype={get:function(e){return e?S[this.uuid][e]:S[this.uuid]},set:function(e,t){S[this.uuid][e]=t},remove:function(e){delete S[this.uuid][e]}},g.extends(m),y.prototype={toString:function(){var e=this,t=F+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=y.traverse(e.stack,t,1)),t}},y.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=y.traverse(r.stack,t,n+1));return t};var Ve=function(){function e(e,t){this[e]=t}function n(e,t){t.pledge.isPending()&&this.push(e)}function r(e,t){t.pledge.isResolved()&&this.push(e)}function i(e,t){t.pledge.isRejected()&&this.push(e)}function o(e,t,n){var r=this,i=e.match(ze)||s;return r.path=p(e,t),r.mock=i[1]?te:ee,r.cache=i[2]?"+"===i[1]:Y,r.type=i[3]||C.handler,r.version=i[4]||C.version,r.lifetime=i[5]&&1e3*i[5]||C.lifetime,r.id=(r.mock?W:"")+r.type+"!"+r.path,r.uri=(r.mock?W:"")+r.type+"@"+r.version+(c(r.lifetime)&&r.lifetime>0?"#"+r.lifetime:"")+"!"+r.path,r.dfd=Qe.defer(),r.pledge=r.dfd.pledge,r.pledge.then(function(){r.value=d(arguments)}),n!==ee&&a.set(r.id,r),r}var u="internal!",a=new g,s=[];return o.prototype={enqueue:!0},o.get=function(e,t){return a.get(v(e,t))},o.resolve=function(t,n){var r,i=n&&Je.test(t),a=i?this.get(u+n+"/"+t):this.get(t,n);if(!a)if(i){switch(a=new o(u+n+"/"+t),t){case F:r=function(){return f(demand,e,demand.bind(n))}();break;case U:r=provide.bind(n);break;case B:r=n}a.dfd.resolve(r)}else a=new o(t,n),demand(z+a.type).then(function(e){a.handler=e,a.mock?a.dfd.resolve(e):Ke.resolve(a)},function(){a.dfd.reject(new y($e+" (handler)",self.id))});return a},o.remove=function(e,n,r){var i=v(e,n),o=t.querySelector("["+F+'-id="'+i+'"]');a.remove(i),a.remove(W+i),o&&o.parentNode.removeChild(o),r!==ee&&Ke.clear.path(i)},o.list={all:function(){return $.keys(a.get())},pending:function(){return f(a.get(),n,[])},resolved:function(){return f(a.get(),r,[])},rejected:function(){return f(a.get(),i,[])}},o}(),We=function(){function e(e,t){this[e]={url:h(t).replace(n,"$1"),match:new RegExp("^"+Xe(t))}}function t(t,n){var r=this;r.weight=t.length,r.match=new RegExp("^"+Xe(t)),r.location=[].concat(n),f(r.location,e,r.location)}var n=/(.+)\/$/;return t.prototype={matches:function(e){return this.match.test(e)},process:function(e,t){var n=this.location[t];if(n)return e.replace(this.match,n.url)}},t}(),Ye=function(t){function n(){this.readyState<4&&this.abort()}var o="XDomainRequest"in e&&e.XDomainRequest||t;return function(e){var u,a=Qe.defer(),c=Ge.test(e)?new t:new o,s=n.bind(c),f=C.timeout;return c.ontimeout=c.onerror=c.onabort=function(){a.reject(c.status)},c.onprogress=c.onreadystatechange=function(){i(u),u=r(s,f)},c.onload=function(){u=i(u),"status"in c&&200!==c.status?a.reject(c.status):a.resolve(c.responseText,c.getResponseHeader&&c.getResponseHeader("content-type"))},c.open("GET",e,te),c.send(),u=r(s,f),a.pledge}}(XMLHttpRequest);e.demand=function(){function t(e,t){this[e]={weight:e.length,state:t}}function n(e,t){"base"!==e&&(this[e]=new We(e,t))}function r(e,t){var n=this[e]=this[e]||{};_e.emit(le,e,n),Ie(n,t),_e.emit(he,e,n)}function i(){var t,n,r,i=d(arguments),o=this!==e?this:Y,a=0;for(_e.emit(je,Y,i,o);t=i[a];a++)u(t,re)?i[a]=Ve.resolve(t,o).pledge:(i[a]=(n=Qe.defer()).pledge,n.resolve(t));return r=i.length>1?Qe.all(i):i[0],r.always(function(){_e.emit(qe,Y,i,o)})}return i.configure=function(e){var o=e.cache,s=e.version,d=e.timeout,l=e.lifetime,h=e.base,p=e.pattern,v=e.modules,m=C.modules;return u(o,ie)?C.cache[""]={weight:0,state:o}:a(o)&&f(o,t,C.cache),u(s,re)&&(C.version=s),c(d)&&(C.timeout=1e3*Math.min(Math.max(d,2),12)),c(l)&&l>0&&(C.lifetime=1e3*l),u(h,re)&&""!==h&&(C.pattern.base=new We("",h)),a(p)&&f(p,n,C.pattern),a(v)&&f(v,r,m),i},i.version="4.2.4-alpha.1",i.on=_e.on.bind(i),i.get=function(e,t){var n=Ve.get(e,t);return n&&n.value},i.remove=Ve.remove,i.list=Ve.list,i.clear=Ke.clear,_e.after(ve,function(e){new x(e)}).after(Pe,function(e){var t=e.handler.onPostRequest;t&&t(e)}).after(me+" "+Pe,function(e){_e.emit(Ce,e.id,e)}).after(ke,function(e){var t=e.handler.onPreRequest;t&&t(e)}).after(Ce,function(e){var t=e.handler.onPreProcess;t&&t(e),e.pledge.then(function(){_e.emit(Se,e.id,e)}),e.enqueue===!0?P.enqueue(e):s(e.enqueue,Qe)&&e.enqueue.then(function(){P.enqueue(e)})}),i}(),e.provide=function(){var t,n,r=u(arguments[0],re)?arguments[0]:Y,i=this!==e?this:Y,o=w(arguments[r?1:0])?arguments[r?1:0]:Y,a=o?arguments[r?2:1]:arguments[r?1:0];!r&&E.current&&(t=E.current,r=t.uri,E.process()),r?(t=t||new Ve(r,i),n=u(a,ue),o?demand.apply(t.path,o).then(function(){t.dfd.resolve(n?a.apply(Y,arguments):a)},function(){t.dfd.reject(new y(Te,t.id,arguments))}):t.dfd.resolve(n?a():a)):!u(console,ne)&&console.error(new y(He))},demand.configure({cache:te,base:"/",pattern:{"/demand":h((n&&n.url||location.href)+"/../").slice(0,-1)}}),n&&n.settings&&demand.configure(n.settings),j.prototype={enqueue:function(){S[this.uuid]=S[this.uuid].concat(d(arguments)),_e.emit(Me,this.uuid)},dequeue:function(){return _e.emit(Ae,this.uuid),S[this.uuid].shift()},get current(){return S[this.uuid][0]},get length(){return S[this.uuid].length}},j.extends(m),q.prototype={process:function(){var e,t=S[this.uuid];t.queue.length?(e=t.current=t.queue.dequeue(),e.handler.process&&e.handler.process(e)):t.current=Y},get current(){return S[this.uuid].current}},q.extends(m);var Ze=function(){function e(){}return e.prototype={validate:Y,onPreRequest:Y,onPostRequest:Y,onPreProcess:Y,process:Y},e}(),et=function(){function e(){}var n=".js",r=t.getElementsByTagName("head")[0],i=/^(application|text)\/(x-)?javascript/;return e.prototype={validate:function(e){return i.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=t.slice(-n.length)!==n?t+n:t},onPostRequest:function(e){e.source=R(e.url,e.source)},process:function(e){var n;e.source&&(n=t.createElement("script"),n.async=te,n.text=e.source,n.setAttribute(F+"-id",e.id),r.appendChild(n))}},new(e.extends(Ze))}();y.prototype={toString:function(){var e=this,t=F+": "+e.message+" "+(e.module?'"'+e.module+'"':"");return e.stack&&(t=y.traverse(e.stack,t,1)),t}},y.traverse=function(e,t,n){for(var r,i=new Array(n+1).join(" "),o=0;r=e[o];o++)t+="\n"+i+"> "+r.message+" "+(r.module?'"'+r.module+'"':""),r.stack&&(t=y.traverse(r.stack,t,n+1));return t};var tt=function(){function e(e,t){var n,r;for(n=0;r=t[n];n++)u(r,re)&&(t[n]=v(r))}function t(e){for(var t,n,r=0;n=e[r];r++)if(n=n.match(ze),n=n&&n[3]||i.handler,t){if(n!==t)return ee}else t=n;return t}function n(){}var r=z+"bundle",i={};return demand.on(he+":"+r,function(t){a(t)&&(i=t,f(i,e))}),n.prototype={validate:et.validate,onPreProcess:function(e){function n(){f.reject(new y(De,e.id,arguments))}var r,o,u,a,c,s=e.source,f=e.dfd,d=i[e.path];if(e.enqueue=ee,d&&(r=t(d))){for(;o=Be.exec(s);)s=s.replace(o[0],"");for(e.source=s,u=[],c=0;a=d[c];c++)u.push(Ve.resolve(W+a).pledge);Qe.all(u).then(function(){for(u.length=0,c=0;a=d[c];c++)a=d[c]=Ve.get(a)||new Ve(a),a.handler=arguments[c],u.push(a.pledge);"module"===r?(P.enqueue.apply(P,d),et.process(e)):(et.process(e),P.enqueue.apply(P,d)),Qe.all(u).then(f.resolve,n)},n)}else n()}},new(n.extends(Ze))}(),nt=function(){function e(){}var n=".html",r=/^text\/.+$/;return e.prototype={validate:function(e){return r.test(e)},onPreRequest:function(e){var t=e.url.pathname;e.url.pathname=t.slice(-n.length)!==n?t+n:t},onPostRequest:function(e){e.source=R(e.url,e.source)},onPreProcess:function(e){function n(){c.reject(new y(De,e.id,arguments))}var r,i,o,u,a=e.path,c=e.dfd,s=t.createElement("body"),f=[],d=[];for(e.enqueue=ee,s.innerHTML=e.source;r=s.firstElementChild;)(i=r.getAttribute("type"))&&(o=r.getAttribute("path"),u=i+"!"+a+(o?"/"+o:""),r.parentNode.removeChild(r),f.push({source:r.textContent,uri:u}),d.push(Ve.resolve("mock:"+u).pledge));Qe.all(d).then(function(){var e,t,r=0;for(d.length=0;e=f[r];r++)t=Ve.get(e.uri)||new Ve(e.uri),t.source=R(t.url,e.source),t.handler=arguments[r],d.push(t.pledge),P.enqueue(t);Qe.all(d).then(c.resolve,n)},n)}},new(e.extends(Ze))}(),rt=function(){function e(e){for(var t,n,r=0;t=s[r];r++)0===e.indexOf(t.prefix)&&(!n||t.weight>n.weight)&&(n=t);return n}function t(e){var t,n,r=e.matches,i={pattern:{},modules:{"/demand/handler/bundle":{}}},o=0;for(i.pattern[e.id]=e.fn(r),i.modules[z+"bundle"][e.id]=t=[];n=r[o];o++)t.push(n.path);return i}function n(){for(var e,t=0;e=this[t];t++)e.dfd.resolve(arguments[t])}function r(){for(var e,t=0;e=this[t];t++)e.dfd.reject(new y(De,e.id))}function i(e,t){s.push({prefix:e,weight:e.length,fn:t})}function o(e,i){var o,u=i.matches,a=0;if(u.length>1){for(i.id=c+"/"+b(JSON.stringify(i.matches));o=u[a];a++)u[a]=new Ve(o.uri);demand.configure(t(i)),demand("bundle!"+i.id).then(n.bind(u),r.bind(u))}}var c=K+"genie",s=[];return demand.on(he+":"+c,function(e){a(e)&&(s.length=0,f(e,i))}).on(je,function(t,n){for(var r,i,a={},c=0;r=t[c];c++)!u(r,re)||Je.test(r)||Ve.get(r,n)||(r=new Ve(r,n,ee),"module"===r.type&&(i=e(r.path))&&!Ke.get(r)&&(a[i.prefix]||(a[i.prefix]={fn:i.fn,matches:[]})).matches.push(r));f(a,o)}),te}();if(P=new j,E=new q(P),k(J+"uuid",m),k(J+"handler",Ze),k(z+"module",et),k(z+"bundle",tt),k(z+"component",nt),k(K+"genie",rt),k(V+"isTypeOf",u),k(V+"isArray",w),k(V+"isObject",a),k(V+"isInstanceOf",s),k(Q+"resolveUrl",h),k(Q+"resolveSourcemaps",R),k(Q+"merge",Ie),k(Q+"iterate",f),k(Q+"hash",b),k(Q+"defer",Le),k(Q+"uuid",Ne),k(G+"descriptor",o),k(G+"pledge",Qe),k(G+"queue",j),k(G+"xhr",Ye),k(G+"failure",y),n&&n.main)switch(typeof n.main){case re:demand(n.main);break;case ue:provide("main",n.main())}}(this,document,"demand"in this&&demand,setTimeout,clearTimeout);
//# sourceMappingURL=demand.js.map
