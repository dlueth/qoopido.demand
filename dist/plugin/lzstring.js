/**! Qoopido.demand 5.3.0 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
var LZString=function(){var n=String.fromCharCode,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(n,r){if(!e[n]){e[n]={};for(var o=0;o<n.length;o++)e[n][n.charAt(o)]=o}return e[n][r]}var i={compressToBase64:function(n){if(null==n)return"";var o=i._compress(n,6,(function(n){return r.charAt(n)}));switch(o.length%4){default:case 0:return o;case 1:return o+"===";case 2:return o+"==";case 3:return o+"="}},decompressFromBase64:function(n){return null==n?"":""==n?null:i._decompress(n.length,32,(function(o){return t(r,n.charAt(o))}))},compressToUTF16:function(r){return null==r?"":i._compress(r,15,(function(r){return n(r+32)}))+" "},decompressFromUTF16:function(n){return null==n?"":""==n?null:i._decompress(n.length,16384,(function(r){return n.charCodeAt(r)-32}))},compressToUint8Array:function(n){for(var r=i.compress(n),o=new Uint8Array(2*r.length),e=0,t=r.length;e<t;e++){var s=r.charCodeAt(e);o[2*e]=s>>>8,o[2*e+1]=s%256}return o},decompressFromUint8Array:function(r){if(null==r)return i.decompress(r);for(var o=new Array(r.length/2),e=0,t=o.length;e<t;e++)o[e]=256*r[2*e]+r[2*e+1];var s=[];return o.forEach((function(r){s.push(n(r))})),i.decompress(s.join(""))},compressToEncodedURIComponent:function(n){return null==n?"":i._compress(n,6,(function(n){return o.charAt(n)}))},decompressFromEncodedURIComponent:function(n){return null==n?"":""==n?null:(n=n.replace(/ /g,"+"),i._decompress(n.length,32,(function(r){return t(o,n.charAt(r))})))},compress:function(r){return i._compress(r,16,(function(r){return n(r)}))},_compress:function(n,r,o){if(null==n)return"";var e,t,i,s={},a={},u="",c="",p="",f=2,l=3,h=2,d=[],m=0,g=0;for(i=0;i<n.length;i+=1)if(u=n.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=l++,a[u]=!0),c=p+u,Object.prototype.hasOwnProperty.call(s,c))p=c;else{if(Object.prototype.hasOwnProperty.call(a,p)){if(p.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,g==r-1?(g=0,d.push(o(m)),m=0):g++;for(t=p.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t=0;for(t=p.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1}0==--f&&(f=Math.pow(2,h),h++),delete a[p]}else for(t=s[p],e=0;e<h;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1;0==--f&&(f=Math.pow(2,h),h++),s[c]=l++,p=String(u)}if(""!==p){if(Object.prototype.hasOwnProperty.call(a,p)){if(p.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,g==r-1?(g=0,d.push(o(m)),m=0):g++;for(t=p.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t=0;for(t=p.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1}0==--f&&(f=Math.pow(2,h),h++),delete a[p]}else for(t=s[p],e=0;e<h;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1;0==--f&&(f=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,g==r-1?(g=0,d.push(o(m)),m=0):g++,t>>=1;for(;;){if(m<<=1,g==r-1){d.push(o(m));break}g++}return d.join("")},decompress:function(n){return null==n?"":""==n?null:i._decompress(n.length,32768,(function(r){return n.charCodeAt(r)}))},_decompress:function(r,o,e){var t,i,s,a,u,c,p,f=[],l=4,h=4,d=3,m="",g=[],v={val:e(0),position:o,index:1};for(t=0;t<3;t+=1)f[t]=t;for(s=0,u=Math.pow(2,2),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;switch(s){case 0:for(s=0,u=Math.pow(2,8),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;p=n(s);break;case 1:for(s=0,u=Math.pow(2,16),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;p=n(s);break;case 2:return""}for(f[3]=p,i=p,g.push(p);;){if(v.index>r)return"";for(s=0,u=Math.pow(2,d),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;switch(p=s){case 0:for(s=0,u=Math.pow(2,8),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;f[h++]=n(s),p=h-1,l--;break;case 1:for(s=0,u=Math.pow(2,16),c=1;c!=u;)a=v.val&v.position,v.position>>=1,0==v.position&&(v.position=o,v.val=e(v.index++)),s|=(a>0?1:0)*c,c<<=1;f[h++]=n(s),p=h-1,l--;break;case 2:return g.join("")}if(0==l&&(l=Math.pow(2,d),d++),f[p])m=f[p];else{if(p!==h)return null;m=i+i.charAt(0)}g.push(m),f[h++]=i+m.charAt(0),i=m,0==--l&&(l=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define((function(){return LZString})):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",(function(){return LZString})),function(n){"use strict";provide(["path","/demand/function/iterate","/demand/validator/isObject","/demand/validator/isTypeOf"],(function(r,o,e,t){var i=[{pattern:r,weight:r.length,state:!1}],s={};function a(n){for(var r,o,e=0;r=i[e];e++)0===n.indexOf(r.pattern)&&(!o||r.weight>o.weight)&&(o=r);return!!o&&o.state}return demand.on("postConfigure:"+r,(function(n){e(n)?(i.length=0,o(n,(function(n,r){i.push({pattern:n,weight:n.length,state:r})}))):t(n,"boolean")&&i.push({pattern:"",weight:0,state:n})})).on("cacheHit",(function(n){a(n.path)&&(s[n.id]=!0)})).on("preCache",(function(r){a(r.path)&&(r.source=n.LZString.compressToUTF16(r.source))})).on("preProcess",(function(r){s[r.id]&&(r.source=n.LZString.decompressFromUTF16(r.source))})),!0}))}(this);
//# sourceMappingURL=lzstring.js.map
