/**! Qoopido.demand 7.1.6 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
/**
 * @preserve A JavaScript implementation of the SHA family of hashes, as
 * defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 * HMAC implementation as defined in FIPS PUB 198a
 *
 * Copyright 2008-2018 Brian Turek, 1998-2009 Paul Johnston & Contributors
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 */
var SUPPORTED_ALGS=15;!function(r){"use strict";var e,n,t,o,i=4294967296;function h(r,e){this.highOrder=r,this.lowOrder=e}function w(r,e,n,t){var o,i,h,w="0123456789abcdef",u="",d=e/8;for(h=-1===n?3:0,o=0;o<d;o+=1)i=r[o>>>2]>>>8*(h+n*(o%4)),u+=w.charAt(i>>>4&15)+w.charAt(15&i);return t.outputUpper?u.toUpperCase():u}function u(r,e,n,t){var o,i,h,w,u,d,f="",a=e/8;for(d=-1===n?3:0,o=0;o<a;o+=3)for(w=o+1<a?r[o+1>>>2]:0,u=o+2<a?r[o+2>>>2]:0,h=(r[o>>>2]>>>8*(d+n*(o%4))&255)<<16|(w>>>8*(d+n*((o+1)%4))&255)<<8|u>>>8*(d+n*((o+2)%4))&255,i=0;i<4;i+=1)f+=8*o+6*i<=e?"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-i)&63):t.b64Pad;return f}function d(r,e,n){var t,o,i,h="",w=e/8;for(i=-1===n?3:0,t=0;t<w;t+=1)o=r[t>>>2]>>>8*(i+n*(t%4))&255,h+=String.fromCharCode(o);return h}function f(r,e,n){var t,o,i,h=e/8,w=new ArrayBuffer(h);for(i=new Uint8Array(w),o=-1===n?3:0,t=0;t<h;t+=1)i[t]=r[t>>>2]>>>8*(o+n*(t%4))&255;return w}function a(r){var e,n={outputUpper:!1,b64Pad:"=",shakeLen:-1};if(e=r||{},n.outputUpper=e.outputUpper||!1,!0===e.hasOwnProperty("b64Pad")&&(n.b64Pad=e.b64Pad),!0===e.hasOwnProperty("shakeLen")&&0!=(8&SUPPORTED_ALGS)){if(e.shakeLen%8!=0)throw new Error("shakeLen must be a multiple of 8");n.shakeLen=e.shakeLen}if("boolean"!=typeof n.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof n.b64Pad)throw new Error("Invalid b64Pad formatting option");return n}function O(r,e,n){var t;switch(e){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(r){case"HEX":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f,a=r.length;if(0!=a%2)throw new Error("String of HEX type must be in byte increments");for(o=e||[0],d=(n=n||0)>>>3,f=-1===t?3:0,i=0;i<a;i+=2){if(h=parseInt(r.substr(i,2),16),isNaN(h))throw new Error("String of HEX type contains invalid characters");for(w=(u=(i>>>1)+d)>>>2;o.length<=w;)o.push(0);o[w]|=h<<8*(f+t*(u%4))}return{value:o,binLen:4*a+n}}(r,e,t,n)};break;case"TEXT":t=function(r,t,o){return function(r,e,n,t,o){var i,h,w,u,d,f,a,O,l,s,c=0;if(i=n||[0],f=(t=t||0)>>>3,"UTF8"===e)for(l=-1===o?3:0,u=0;u<r.length;u+=1)for(w=[],128>(h=r.charCodeAt(u))?w.push(h):2048>h?(w.push(192|h>>>6),w.push(128|63&h)):55296>h||57344<=h?w.push(224|h>>>12,128|h>>>6&63,128|63&h):(u+=1,h=65536+((1023&h)<<10|1023&r.charCodeAt(u)),w.push(240|h>>>18,128|h>>>12&63,128|h>>>6&63,128|63&h)),d=0;d<w.length;d+=1){for(a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=w[d]<<8*(l+o*(O%4)),c+=1}else if("UTF16BE"===e||"UTF16LE"===e)for(l=-1===o?2:0,s="UTF16LE"===e&&1!==o||"UTF16LE"!==e&&1===o,u=0;u<r.length;u+=1){for(h=r.charCodeAt(u),!0===s&&(h=(d=255&h)<<8|h>>>8),a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=h<<8*(l+o*(O%4)),c+=2}return{value:i,binLen:8*c+t}}(r,e,t,o,n)};break;case"B64":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f,a,O,l,s=0;if(-1===r.search(/^[a-zA-Z0-9=+\/]+$/))throw new Error("Invalid character in base-64 string");if(d=r.indexOf("="),r=r.replace(/\=/g,""),-1!==d&&d<r.length)throw new Error("Invalid '=' found in base-64 string");for(o=e||[0],f=(n=n||0)>>>3,l=-1===t?3:0,i=0;i<r.length;i+=4){for(u=r.substr(i,4),w=0,h=0;h<u.length;h+=1)w|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(u[h])<<18-6*h;for(h=0;h<u.length-1;h+=1){for(a=(O=s+f)>>>2;o.length<=a;)o.push(0);o[a]|=(w>>>16-8*h&255)<<8*(l+t*(O%4)),s+=1}}return{value:o,binLen:8*s+n}}(r,e,t,n)};break;case"BYTES":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f;for(o=e||[0],w=(n=n||0)>>>3,f=-1===t?3:0,h=0;h<r.length;h+=1)i=r.charCodeAt(h),u=(d=h+w)>>>2,o.length<=u&&o.push(0),o[u]|=i<<8*(f+t*(d%4));return{value:o,binLen:8*r.length+n}}(r,e,t,n)};break;case"ARRAYBUFFER":try{t=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f;for(o=e||[0],h=(n=n||0)>>>3,d=-1===t?3:0,f=new Uint8Array(r),i=0;i<r.byteLength;i+=1)w=(u=i+h)>>>2,o.length<=w&&o.push(0),o[w]|=f[i]<<8*(d+t*(u%4));return{value:o,binLen:8*r.byteLength+n}}(r,e,t,n)};break;default:throw new Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER")}return t}function l(r,e){return r<<e|r>>>32-e}function s(r,e){return e>32?(e-=32,new h(r.lowOrder<<e|r.highOrder>>>32-e,r.highOrder<<e|r.lowOrder>>>32-e)):0!==e?new h(r.highOrder<<e|r.lowOrder>>>32-e,r.lowOrder<<e|r.highOrder>>>32-e):r}function c(r,e){return r>>>e|r<<32-e}function g(r,e){var n=new h(r.highOrder,r.lowOrder);return 32>=e?new h(n.highOrder>>>e|n.lowOrder<<32-e&4294967295,n.lowOrder>>>e|n.highOrder<<32-e&4294967295):new h(n.lowOrder>>>e-32|n.highOrder<<64-e&4294967295,n.highOrder>>>e-32|n.lowOrder<<64-e&4294967295)}function A(r,e){return r>>>e}function S(r,e){return 32>=e?new h(r.highOrder>>>e,r.lowOrder>>>e|r.highOrder<<32-e&4294967295):new h(0,r.highOrder>>>e-32)}function p(r,e,n){return r^e^n}function E(r,e,n){return r&e^~r&n}function H(r,e,n){return new h(r.highOrder&e.highOrder^~r.highOrder&n.highOrder,r.lowOrder&e.lowOrder^~r.lowOrder&n.lowOrder)}function v(r,e,n){return r&e^r&n^e&n}function P(r,e,n){return new h(r.highOrder&e.highOrder^r.highOrder&n.highOrder^e.highOrder&n.highOrder,r.lowOrder&e.lowOrder^r.lowOrder&n.lowOrder^e.lowOrder&n.lowOrder)}function U(r){return c(r,2)^c(r,13)^c(r,22)}function R(r){var e=g(r,28),n=g(r,34),t=g(r,39);return new h(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function b(r){return c(r,6)^c(r,11)^c(r,25)}function T(r){var e=g(r,14),n=g(r,18),t=g(r,41);return new h(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function L(r){return c(r,7)^c(r,18)^A(r,3)}function m(r){var e=g(r,1),n=g(r,8),t=S(r,7);return new h(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function k(r){return c(r,17)^c(r,19)^A(r,10)}function y(r){var e=g(r,19),n=g(r,61),t=S(r,6);return new h(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function F(r,e){var n=(65535&r)+(65535&e);return(65535&(r>>>16)+(e>>>16)+(n>>>16))<<16|65535&n}function B(r,e,n,t){var o=(65535&r)+(65535&e)+(65535&n)+(65535&t);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16))<<16|65535&o}function D(r,e,n,t,o){var i=(65535&r)+(65535&e)+(65535&n)+(65535&t)+(65535&o);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16)+(i>>>16))<<16|65535&i}function G(r,e){var n,t,o;return n=(65535&r.lowOrder)+(65535&e.lowOrder),o=(65535&(t=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n>>>16)))<<16|65535&n,n=(65535&r.highOrder)+(65535&e.highOrder)+(t>>>16),new h((65535&(t=(r.highOrder>>>16)+(e.highOrder>>>16)+(n>>>16)))<<16|65535&n,o)}function _(r,e,n,t){var o,i,w;return o=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder),w=(65535&(i=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o>>>16)))<<16|65535&o,o=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(i>>>16),new h((65535&(i=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o>>>16)))<<16|65535&o,w)}function C(r,e,n,t,o){var i,w,u;return i=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder)+(65535&o.lowOrder),u=(65535&(w=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o.lowOrder>>>16)+(i>>>16)))<<16|65535&i,i=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(65535&o.highOrder)+(w>>>16),new h((65535&(w=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o.highOrder>>>16)+(i>>>16)))<<16|65535&i,u)}function x(r,e){return new h(r.highOrder^e.highOrder,r.lowOrder^e.lowOrder)}function Y(r){var e,n,t,o=[];if("SHA-1"===r&&0!=(1&SUPPORTED_ALGS))o=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===r.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))switch(e=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],n=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],r){case"SHA-224":o=e;break;case"SHA-256":o=n;break;case"SHA-384":o=[new h(3418070365,e[0]),new h(1654270250,e[1]),new h(2438529370,e[2]),new h(355462360,e[3]),new h(1731405415,e[4]),new h(41048885895,e[5]),new h(3675008525,e[6]),new h(1203062813,e[7])];break;case"SHA-512":o=[new h(n[0],4089235720),new h(n[1],2227873595),new h(n[2],4271175723),new h(n[3],1595750129),new h(n[4],2917565137),new h(n[5],725511199),new h(n[6],4215389547),new h(n[7],327033209)];break;default:throw new Error("Unknown SHA variant")}else{if(0!==r.lastIndexOf("SHA3-",0)&&0!==r.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("No SHA variants supported");for(t=0;t<5;t+=1)o[t]=[new h(0,0),new h(0,0),new h(0,0),new h(0,0),new h(0,0)]}return o}function I(r,e){var n,t,o,i,h,w,u,d=[],f=E,a=p,O=v,s=l,c=F,g=D;for(n=e[0],t=e[1],o=e[2],i=e[3],h=e[4],u=0;u<80;u+=1)d[u]=u<16?r[u]:s(d[u-3]^d[u-8]^d[u-14]^d[u-16],1),w=u<20?g(s(n,5),f(t,o,i),h,1518500249,d[u]):u<40?g(s(n,5),a(t,o,i),h,1859775393,d[u]):u<60?g(s(n,5),O(t,o,i),h,2400959708,d[u]):g(s(n,5),a(t,o,i),h,3395469782,d[u]),h=i,i=o,o=s(t,30),t=n,n=w;return e[0]=c(n,e[0]),e[1]=c(t,e[1]),e[2]=c(o,e[2]),e[3]=c(i,e[3]),e[4]=c(h,e[4]),e}function X(r,e,n,t,o){var h,w,u,d;for(u=15+(e+65>>>9<<4);r.length<=u;)r.push(0);for(r[e>>>5]|=128<<24-e%32,d=e+n,r[u]=4294967295&d,r[u-1]=d/i|0,w=r.length,h=0;h<w;h+=16)t=I(r.slice(h,h+16),t);return t}function M(r,t,o){var i,w,u,d,f,a,O,l,s,c,g,A,S,p,x,Y,I,X,M,K,j,N,q,z,Z,J,Q,V=[];if("SHA-224"!==o&&"SHA-256"!==o||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==o&&"SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");g=80,S=2,q=h,p=G,x=_,Y=C,I=m,X=y,M=R,K=T,N=P,j=H,Q=n}else g=64,S=1,q=Number,p=F,x=B,Y=D,I=L,X=k,M=U,K=b,N=v,j=E,Q=e;for(i=t[0],w=t[1],u=t[2],d=t[3],f=t[4],a=t[5],O=t[6],l=t[7],A=0;A<g;A+=1)A<16?(J=A*S,z=r.length<=J?0:r[J],Z=r.length<=J+1?0:r[J+1],V[A]=new q(z,Z)):V[A]=x(X(V[A-2]),V[A-7],I(V[A-15]),V[A-16]),s=Y(l,K(f),j(f,a,O),Q[A],V[A]),c=p(M(i),N(i,w,u)),l=O,O=a,a=f,f=p(d,s),d=u,u=w,w=i,i=p(s,c);return t[0]=p(i,t[0]),t[1]=p(w,t[1]),t[2]=p(u,t[2]),t[3]=p(d,t[3]),t[4]=p(f,t[4]),t[5]=p(a,t[5]),t[6]=p(O,t[6]),t[7]=p(l,t[7]),t}function K(r,e){var n,i,w,u,d,f,a,O,l,c=[],g=[];if(null!==r)for(i=0;i<r.length;i+=2)e[(i>>>1)%5][(i>>>1)/5|0]=x(e[(i>>>1)%5][(i>>>1)/5|0],new h(r[i+1],r[i]));for(n=0;n<24;n+=1){for(u=Y("SHA3-"),i=0;i<5;i+=1)c[i]=(d=e[i][0],f=e[i][1],a=e[i][2],O=e[i][3],l=e[i][4],new h(d.highOrder^f.highOrder^a.highOrder^O.highOrder^l.highOrder,d.lowOrder^f.lowOrder^a.lowOrder^O.lowOrder^l.lowOrder));for(i=0;i<5;i+=1)g[i]=x(c[(i+4)%5],s(c[(i+1)%5],1));for(i=0;i<5;i+=1)for(w=0;w<5;w+=1)e[i][w]=x(e[i][w],g[i]);for(i=0;i<5;i+=1)for(w=0;w<5;w+=1)u[w][(2*i+3*w)%5]=s(e[i][w],t[i][w]);for(i=0;i<5;i+=1)for(w=0;w<5;w+=1)e[i][w]=x(u[i][w],new h(~u[(i+1)%5][w].highOrder&u[(i+2)%5][w].highOrder,~u[(i+1)%5][w].lowOrder&u[(i+2)%5][w].lowOrder));e[0][0]=x(e[0][0],o[n])}return e}0!=(6&SUPPORTED_ALGS)&&(e=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],0!=(4&SUPPORTED_ALGS)&&(n=[new h(e[0],3609767458),new h(e[1],602891725),new h(e[2],3964484399),new h(e[3],2173295548),new h(e[4],4081628472),new h(e[5],3053834265),new h(e[6],2937671579),new h(e[7],3664609560),new h(e[8],2734883394),new h(e[9],1164996542),new h(e[10],1323610764),new h(e[11],3590304994),new h(e[12],4068182383),new h(e[13],991336113),new h(e[14],633803317),new h(e[15],3479774868),new h(e[16],2666613458),new h(e[17],944711139),new h(e[18],2341262773),new h(e[19],2007800933),new h(e[20],1495990901),new h(e[21],1856431235),new h(e[22],3175218132),new h(e[23],2198950837),new h(e[24],3999719339),new h(e[25],766784016),new h(e[26],2566594879),new h(e[27],3203337956),new h(e[28],1034457026),new h(e[29],2466948901),new h(e[30],3758326383),new h(e[31],168717936),new h(e[32],1188179964),new h(e[33],1546045734),new h(e[34],1522805485),new h(e[35],2643833823),new h(e[36],2343527390),new h(e[37],1014477480),new h(e[38],1206759142),new h(e[39],344077627),new h(e[40],1290863460),new h(e[41],3158454273),new h(e[42],3505952657),new h(e[43],106217008),new h(e[44],3606008344),new h(e[45],1432725776),new h(e[46],1467031594),new h(e[47],851169720),new h(e[48],3100823752),new h(e[49],1363258195),new h(e[50],3750685593),new h(e[51],3785050280),new h(e[52],3318307427),new h(e[53],3812723403),new h(e[54],2003034995),new h(e[55],3602036899),new h(e[56],1575990012),new h(e[57],1125592928),new h(e[58],2716904306),new h(e[59],442776044),new h(e[60],593698344),new h(e[61],3733110249),new h(e[62],2999351573),new h(e[63],3815920427),new h(3391569614,3928383900),new h(3515267271,566280711),new h(3940187606,3454069534),new h(4118630271,4000239992),new h(116418474,1914138554),new h(174292421,2731055270),new h(289380356,3203993006),new h(460393269,320620315),new h(685471733,587496836),new h(852142971,1086792851),new h(1017036298,365543100),new h(1126000580,2618297676),new h(1288033470,3409855158),new h(1501505948,4234509866),new h(1607167915,987167468),new h(1816402316,1246189591)])),0!=(8&SUPPORTED_ALGS)&&(o=[new h(0,1),new h(0,32898),new h(2147483648,32906),new h(2147483648,2147516416),new h(0,32907),new h(0,2147483649),new h(2147483648,2147516545),new h(2147483648,32777),new h(0,138),new h(0,136),new h(0,2147516425),new h(0,2147483658),new h(0,2147516555),new h(2147483648,139),new h(2147483648,32905),new h(2147483648,32771),new h(2147483648,32770),new h(2147483648,128),new h(0,32778),new h(2147483648,2147483658),new h(2147483648,2147516545),new h(2147483648,32896),new h(0,2147483649),new h(2147483648,2147516424)],t=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]]);var j=function(r,e,n){var t,o,h,l,s,c,g,A,S,p,E=0,H=[],v=0,P=r,U=!1,R=[],b=[],T=!1,L=!1,m=-1;if(t=(p=n||{}).encoding||"UTF8",(S=p.numRounds||1)!==parseInt(S,10)||1>S)throw new Error("numRounds must a integer >= 1");if("SHA-1"===P&&0!=(1&SUPPORTED_ALGS))s=512,c=I,g=X,l=160,A=function(r){return r.slice()};else if(0===P.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))if(c=function(r,e){return M(r,e,P)},g=function(r,e,n,t,o){return function(r,e,n,t,o,h){var w,u,d,f,a,O;if("SHA-224"!==o&&"SHA-256"!==o||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==o&&"SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");d=31+(e+129>>>10<<5),a=32}else d=15+(e+65>>>9<<4),a=16;for(;r.length<=d;)r.push(0);for(r[e>>>5]|=128<<24-e%32,O=e+n,r[d]=4294967295&O,r[d-1]=O/i|0,u=r.length,w=0;w<u;w+=a)t=M(r.slice(w,w+a),t,o);if("SHA-224"===o&&0!=(2&SUPPORTED_ALGS))f=[t[0],t[1],t[2],t[3],t[4],t[5],t[6]];else if("SHA-256"===o&&0!=(2&SUPPORTED_ALGS))f=t;else if("SHA-384"===o&&0!=(4&SUPPORTED_ALGS))f=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder];else{if("SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");f=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder,t[6].highOrder,t[6].lowOrder,t[7].highOrder,t[7].lowOrder]}return f}(r,e,n,t,P)},A=function(r){return r.slice()},"SHA-224"===P&&0!=(2&SUPPORTED_ALGS))s=512,l=224;else if("SHA-256"===P&&0!=(2&SUPPORTED_ALGS))s=512,l=256;else if("SHA-384"===P&&0!=(4&SUPPORTED_ALGS))s=1024,l=384;else{if("SHA-512"!==P||0==(4&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");s=1024,l=512}else{if(0!==P.lastIndexOf("SHA3-",0)&&0!==P.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");var k=6;if(c=K,A=function(r){return function(r){var e,n=[];for(e=0;e<5;e+=1)n[e]=r[e].slice();return n}(r)},m=1,"SHA3-224"===P)s=1152,l=224;else if("SHA3-256"===P)s=1088,l=256;else if("SHA3-384"===P)s=832,l=384;else if("SHA3-512"===P)s=576,l=512;else if("SHAKE128"===P)s=1344,l=-1,k=31,L=!0;else{if("SHAKE256"!==P)throw new Error("Chosen SHA variant is not supported");s=1088,l=-1,k=31,L=!0}g=function(r,e,n,t,o){return function(r,e,n,t,o,i,h){var w,u,d=[],f=o>>>5,a=0,O=e>>>5;for(w=0;w<O&&e>=o;w+=f)t=K(r.slice(w,w+f),t),e-=o;for(r=r.slice(w),e%=o;r.length<f;)r.push(0);for(r[(w=e>>>3)>>2]^=i<<w%4*8,r[f-1]^=2147483648,t=K(r,t);32*d.length<h&&(u=t[a%5][a/5|0],d.push(u.lowOrder),!(32*d.length>=h));)d.push(u.highOrder),0==64*(a+=1)%o&&K(null,t);return d}(r,e,0,t,s,k,o)}}h=O(e,t,m),o=Y(P),this.setHMACKey=function(r,e,n){var i,h,w,u,d,f;if(!0===U)throw new Error("HMAC key already set");if(!0===T)throw new Error("Cannot set HMAC key after calling update");if(!0===L&&0!=(8&SUPPORTED_ALGS))throw new Error("SHAKE is not supported for HMAC");if(h=(i=O(e,t=(n||{}).encoding||"UTF8",m)(r)).binLen,w=i.value,f=(u=s>>>3)/4-1,u<h/8){for(w=g(w,h,0,Y(P),l);w.length<=f;)w.push(0);w[f]&=4294967040}else if(u>h/8){for(;w.length<=f;)w.push(0);w[f]&=4294967040}for(d=0;d<=f;d+=1)R[d]=909522486^w[d],b[d]=1549556828^w[d];o=c(R,o),E=s,U=!0},this.update=function(r){var e,n,t,i,w,u=0,d=s>>>5;for(n=(e=h(r,H,v)).binLen,i=e.value,t=n>>>5,w=0;w<t;w+=d)u+s<=n&&(o=c(i.slice(w,w+d),o),u+=s);E+=u,H=i.slice(u>>>5),v=n%s,T=!0},this.getHash=function(r,e){var n,t,i,h;if(!0===U)throw new Error("Cannot call getHash after setting HMAC key");if(i=a(e),!0===L&&0!=(8&SUPPORTED_ALGS)){if(-1===i.shakeLen)throw new Error("shakeLen must be specified in options");l=i.shakeLen}switch(r){case"HEX":n=function(r){return w(r,l,m,i)};break;case"B64":n=function(r){return u(r,l,m,i)};break;case"BYTES":n=function(r){return d(r,l,m)};break;case"ARRAYBUFFER":try{t=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return f(r,l,m)};break;default:throw new Error("format must be HEX, B64, BYTES, or ARRAYBUFFER")}for(h=g(H.slice(),v,E,A(o),l),t=1;t<S;t+=1)0!=(8&SUPPORTED_ALGS)&&!0===L&&l%32!=0&&(h[h.length-1]&=16777215>>>24-l%32),h=g(h,l,0,Y(P),l);return n(h)},this.getHMAC=function(r,e){var n,t,i,h;if(!1===U)throw new Error("Cannot call getHMAC without first setting HMAC key");switch(i=a(e),r){case"HEX":n=function(r){return w(r,l,m,i)};break;case"B64":n=function(r){return u(r,l,m,i)};break;case"BYTES":n=function(r){return d(r,l,m)};break;case"ARRAYBUFFER":try{n=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return f(r,l,m)};break;default:throw new Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")}return t=g(H.slice(),v,E,A(o),l),h=c(b,Y(P)),n(h=g(t,l,s,h,l))}};"function"==typeof define&&define.amd?define((function(){return j})):"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports?(module.exports=j,exports=j):exports=j:r.jsSHA=j}(this),function(r){"use strict";provide(["path","/demand/failure","/demand/function/iterate","/demand/validator/isObject"],(function(e,n,t,o){var i;return demand.on("postConfigure:"+e,(function(r){o(r)&&(i=r)})).on("postRequest",(function(e){var o,h,w;if(o=function(r){var e;return t(i,(function(n,t){if(n===r)return e=t,!1})),e||!1}(e.path))try{(h=new r.jsSHA(o.type,"TEXT")).update(e.source),(w=h.getHash("B64"))!==o.hash&&e.dfd.reject(new n('hash mismatch, should be "'+o.hash+'" but is "'+w+'" (sri)',e.id))}catch(r){e.dfd.reject(new n("unsupported hashing algorithm (sri)",e.id))}})),!0}))}(this);
//# sourceMappingURL=sri.js.map
