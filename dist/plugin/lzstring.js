/*! Qoopido.demand 3.0.5 | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(){"use strict";function o(o,t,e){function i(o,t){var e,i,n={},s={},a="",p="",h="",f=2,c=3,u=2,l=[],v=0,w=0,g=0;for(t-=1;o[g];g++)if(a=o.charAt(g),d.call(n,a)||(n[a]=c++,s[a]=!0),p=h+a,d.call(n,p))h=p;else{if(d.call(s,h)){if(h.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w===t?(l.push(r(v)),w=0,v=0):w++;for(i=h.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1}else{for(i=1,e=0;u>e;e++)v=v<<1|i,w===t?(l.push(r(v)),w=0,v=0):w++,i=0;for(i=h.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1}f--,0===f&&(f=Math.pow(2,u),u++),delete s[h]}else for(i=n[h],e=0;u>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1;f--,0===f&&(f=Math.pow(2,u),u++),n[p]=c++,h=String(a)}if(""!==h){if(d.call(s,h)){if(h.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w===t?(l.push(r(v)),w=0,v=0):w++;for(i=h.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1}else{for(i=1,e=0;u>e;e++)v=v<<1|i,w===t?(l.push(r(v)),w=0,v=0):w++,i=0;for(i=h.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1}f--,0===f&&(f=Math.pow(2,u),u++),delete s[h]}else for(i=n[h],e=0;u>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1;f--,0===f&&u++}for(i=2,e=0;u>e;e++)v=v<<1|1&i,w===t?(l.push(r(v)),w=0,v=0):w++,i>>=1;for(;;){if(v<<=1,w===t){l.push(r(v));break}w++}return l.join("")}function n(o,t,e){var i,n,r,a,p,h=[],f=4,c=4,u=3,d="",A=[],C={val:s(o,0),position:e,index:1},x=0,M=v,b=1;for(n=0;3>n;n++)h[n]=n;for(;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;switch(i=x){case 0:for(x=0,M=w,b=1;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;p=l(x);break;case 1:for(x=0,M=g,b=1;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;p=l(x);break;case 2:return""}for(h[3]=p,r=p,A.push(p);;){if(C.index>t)return"";for(x=0,M=Math.pow(2,u),b=1;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;switch(p=x){case 0:for(x=0,M=w,b=1;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;h[c++]=l(x),p=c-1,f--;break;case 1:for(x=0,M=g,b=1;b!==M;)a=C.val&C.position,C.position>>=1,0===C.position&&(C.position=e,C.val=s(o,C.index++)),x|=(a>0?1:0)*b,b<<=1;h[c++]=l(x),p=c-1,f--;break;case 2:return A.join("")}if(0===f&&(f=Math.pow(2,u),u++),h[p])d=h[p];else{if(p!==c)return null;d=r+r.charAt(0)}A.push(d),h[c++]=r+d.charAt(0),f--,r=d,0===f&&(f=Math.pow(2,u),u++)}}function r(o){return l(o+32)}function s(o,t){return o.charCodeAt(t)-32}function a(o){return o?i(o,15)+" ":""}function p(o){return o?n(o,o.length,16384):""}function h(o){for(var t,e,i=0;t=A[i];i++)0===o.indexOf(t.pattern)&&(!e||t.weight>e.weight)&&(e=t);return e?e.state:!1}var f,c,u="/demand/plugin/lzstring",l=String.fromCharCode,d=Object.prototype.hasOwnProperty,v=Math.pow(2,2),w=Math.pow(2,8),g=Math.pow(2,16),A=[{pattern:u,weight:u.length,state:!1}];if(t(o))for(c in o)A.push({pattern:c,weight:c.length,state:o[c]});else e(o,"boolean")&&(f=o);return demand.on("preCache",function(o){(f||h(o.path))&&(o.source=a(o.source))}).on("preProcess",function(o){"hit"===o.deferred.pledge.cache&&(f||h(o.path))&&(o.source=p(o.source))}),{compress:a,decompress:p}}provide(["settings","/demand/validator/isObject","/demand/validator/isTypeOf"],o)}();
//# sourceMappingURL=lzstring.js.map
