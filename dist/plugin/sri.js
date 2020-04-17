/**! Qoopido.demand 6.0.0 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
/**
 * @preserve A JavaScript implementation of the SHA family of hashes, as
 * defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 * HMAC implementation as defined in FIPS PUB 198a
 *
 * Copyright 2008-2018 Brian Turek, 1998-2009 Paul Johnston & Contributors
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 */
var SUPPORTED_ALGS=15;!function(r){"use strict";var e,n,t,o;function i(r,e){this.highOrder=r,this.lowOrder=e}function h(r,e,n,t){var o,i,h,w="",u=e/8;for(h=-1===n?3:0,o=0;o<u;o+=1)i=r[o>>>2]>>>8*(h+n*(o%4)),w+="0123456789abcdef".charAt(i>>>4&15)+"0123456789abcdef".charAt(15&i);return t.outputUpper?w.toUpperCase():w}function w(r,e,n,t){var o,i,h,w,u,d,f="",a=e/8;for(d=-1===n?3:0,o=0;o<a;o+=3)for(w=o+1<a?r[o+1>>>2]:0,u=o+2<a?r[o+2>>>2]:0,h=(r[o>>>2]>>>8*(d+n*(o%4))&255)<<16|(w>>>8*(d+n*((o+1)%4))&255)<<8|u>>>8*(d+n*((o+2)%4))&255,i=0;i<4;i+=1)f+=8*o+6*i<=e?"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-i)&63):t.b64Pad;return f}function u(r,e,n){var t,o,i,h="",w=e/8;for(i=-1===n?3:0,t=0;t<w;t+=1)o=r[t>>>2]>>>8*(i+n*(t%4))&255,h+=String.fromCharCode(o);return h}function d(r,e,n){var t,o,i,h=e/8,w=new ArrayBuffer(h);for(i=new Uint8Array(w),o=-1===n?3:0,t=0;t<h;t+=1)i[t]=r[t>>>2]>>>8*(o+n*(t%4))&255;return w}function f(r){var e,n={outputUpper:!1,b64Pad:"=",shakeLen:-1};if(e=r||{},n.outputUpper=e.outputUpper||!1,!0===e.hasOwnProperty("b64Pad")&&(n.b64Pad=e.b64Pad),!0===e.hasOwnProperty("shakeLen")&&0!=(8&SUPPORTED_ALGS)){if(e.shakeLen%8!=0)throw new Error("shakeLen must be a multiple of 8");n.shakeLen=e.shakeLen}if("boolean"!=typeof n.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof n.b64Pad)throw new Error("Invalid b64Pad formatting option");return n}function a(r,e,n){var t;switch(e){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(r){case"HEX":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f,a=r.length;if(0!=a%2)throw new Error("String of HEX type must be in byte increments");for(o=e||[0],d=(n=n||0)>>>3,f=-1===t?3:0,i=0;i<a;i+=2){if(h=parseInt(r.substr(i,2),16),isNaN(h))throw new Error("String of HEX type contains invalid characters");for(w=(u=(i>>>1)+d)>>>2;o.length<=w;)o.push(0);o[w]|=h<<8*(f+t*(u%4))}return{value:o,binLen:4*a+n}}(r,e,t,n)};break;case"TEXT":t=function(r,t,o){return function(r,e,n,t,o){var i,h,w,u,d,f,a,O,l,s,c=0;if(i=n||[0],f=(t=t||0)>>>3,"UTF8"===e)for(l=-1===o?3:0,u=0;u<r.length;u+=1)for(w=[],128>(h=r.charCodeAt(u))?w.push(h):2048>h?(w.push(192|h>>>6),w.push(128|63&h)):55296>h||57344<=h?w.push(224|h>>>12,128|h>>>6&63,128|63&h):(u+=1,h=65536+((1023&h)<<10|1023&r.charCodeAt(u)),w.push(240|h>>>18,128|h>>>12&63,128|h>>>6&63,128|63&h)),d=0;d<w.length;d+=1){for(a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=w[d]<<8*(l+o*(O%4)),c+=1}else if("UTF16BE"===e||"UTF16LE"===e)for(l=-1===o?2:0,s="UTF16LE"===e&&1!==o||"UTF16LE"!==e&&1===o,u=0;u<r.length;u+=1){for(h=r.charCodeAt(u),!0===s&&(h=(d=255&h)<<8|h>>>8),a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=h<<8*(l+o*(O%4)),c+=2}return{value:i,binLen:8*c+t}}(r,e,t,o,n)};break;case"B64":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f,a,O,l,s=0;if(-1===r.search(/^[a-zA-Z0-9=+\/]+$/))throw new Error("Invalid character in base-64 string");if(d=r.indexOf("="),r=r.replace(/\=/g,""),-1!==d&&d<r.length)throw new Error("Invalid '=' found in base-64 string");for(o=e||[0],f=(n=n||0)>>>3,l=-1===t?3:0,i=0;i<r.length;i+=4){for(u=r.substr(i,4),w=0,h=0;h<u.length;h+=1)w|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(u[h])<<18-6*h;for(h=0;h<u.length-1;h+=1){for(a=(O=s+f)>>>2;o.length<=a;)o.push(0);o[a]|=(w>>>16-8*h&255)<<8*(l+t*(O%4)),s+=1}}return{value:o,binLen:8*s+n}}(r,e,t,n)};break;case"BYTES":t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f;for(o=e||[0],w=(n=n||0)>>>3,f=-1===t?3:0,h=0;h<r.length;h+=1)i=r.charCodeAt(h),u=(d=h+w)>>>2,o.length<=u&&o.push(0),o[u]|=i<<8*(f+t*(d%4));return{value:o,binLen:8*r.length+n}}(r,e,t,n)};break;case"ARRAYBUFFER":try{t=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}t=function(r,e,t){return function(r,e,n,t){var o,i,h,w,u,d,f;for(o=e||[0],h=(n=n||0)>>>3,d=-1===t?3:0,f=new Uint8Array(r),i=0;i<r.byteLength;i+=1)w=(u=i+h)>>>2,o.length<=w&&o.push(0),o[w]|=f[i]<<8*(d+t*(u%4));return{value:o,binLen:8*r.byteLength+n}}(r,e,t,n)};break;default:throw new Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER")}return t}function O(r,e){return r<<e|r>>>32-e}function l(r,e){return e>32?(e-=32,new i(r.lowOrder<<e|r.highOrder>>>32-e,r.highOrder<<e|r.lowOrder>>>32-e)):0!==e?new i(r.highOrder<<e|r.lowOrder>>>32-e,r.lowOrder<<e|r.highOrder>>>32-e):r}function s(r,e){return r>>>e|r<<32-e}function c(r,e){var n=new i(r.highOrder,r.lowOrder);return 32>=e?new i(n.highOrder>>>e|n.lowOrder<<32-e&4294967295,n.lowOrder>>>e|n.highOrder<<32-e&4294967295):new i(n.lowOrder>>>e-32|n.highOrder<<64-e&4294967295,n.highOrder>>>e-32|n.lowOrder<<64-e&4294967295)}function g(r,e){return r>>>e}function A(r,e){return 32>=e?new i(r.highOrder>>>e,r.lowOrder>>>e|r.highOrder<<32-e&4294967295):new i(0,r.highOrder>>>e-32)}function S(r,e,n){return r^e^n}function p(r,e,n){return r&e^~r&n}function E(r,e,n){return new i(r.highOrder&e.highOrder^~r.highOrder&n.highOrder,r.lowOrder&e.lowOrder^~r.lowOrder&n.lowOrder)}function H(r,e,n){return r&e^r&n^e&n}function v(r,e,n){return new i(r.highOrder&e.highOrder^r.highOrder&n.highOrder^e.highOrder&n.highOrder,r.lowOrder&e.lowOrder^r.lowOrder&n.lowOrder^e.lowOrder&n.lowOrder)}function P(r){return s(r,2)^s(r,13)^s(r,22)}function U(r){var e=c(r,28),n=c(r,34),t=c(r,39);return new i(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function b(r){return s(r,6)^s(r,11)^s(r,25)}function R(r){var e=c(r,14),n=c(r,18),t=c(r,41);return new i(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function T(r){return s(r,7)^s(r,18)^g(r,3)}function L(r){var e=c(r,1),n=c(r,8),t=A(r,7);return new i(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function m(r){return s(r,17)^s(r,19)^g(r,10)}function k(r){var e=c(r,19),n=c(r,61),t=A(r,6);return new i(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function y(r,e){var n=(65535&r)+(65535&e);return(65535&(r>>>16)+(e>>>16)+(n>>>16))<<16|65535&n}function F(r,e,n,t){var o=(65535&r)+(65535&e)+(65535&n)+(65535&t);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16))<<16|65535&o}function B(r,e,n,t,o){var i=(65535&r)+(65535&e)+(65535&n)+(65535&t)+(65535&o);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16)+(i>>>16))<<16|65535&i}function D(r,e){var n,t,o;return n=(65535&r.lowOrder)+(65535&e.lowOrder),o=(65535&(t=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n>>>16)))<<16|65535&n,n=(65535&r.highOrder)+(65535&e.highOrder)+(t>>>16),new i((65535&(t=(r.highOrder>>>16)+(e.highOrder>>>16)+(n>>>16)))<<16|65535&n,o)}function G(r,e,n,t){var o,h,w;return o=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder),w=(65535&(h=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o>>>16)))<<16|65535&o,o=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(h>>>16),new i((65535&(h=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o>>>16)))<<16|65535&o,w)}function _(r,e,n,t,o){var h,w,u;return h=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder)+(65535&o.lowOrder),u=(65535&(w=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o.lowOrder>>>16)+(h>>>16)))<<16|65535&h,h=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(65535&o.highOrder)+(w>>>16),new i((65535&(w=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o.highOrder>>>16)+(h>>>16)))<<16|65535&h,u)}function C(r,e){return new i(r.highOrder^e.highOrder,r.lowOrder^e.lowOrder)}function x(r){var e,n,t,o=[];if("SHA-1"===r&&0!=(1&SUPPORTED_ALGS))o=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===r.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))switch(e=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],n=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],r){case"SHA-224":o=e;break;case"SHA-256":o=n;break;case"SHA-384":o=[new i(3418070365,e[0]),new i(1654270250,e[1]),new i(2438529370,e[2]),new i(355462360,e[3]),new i(1731405415,e[4]),new i(41048885895,e[5]),new i(3675008525,e[6]),new i(1203062813,e[7])];break;case"SHA-512":o=[new i(n[0],4089235720),new i(n[1],2227873595),new i(n[2],4271175723),new i(n[3],1595750129),new i(n[4],2917565137),new i(n[5],725511199),new i(n[6],4215389547),new i(n[7],327033209)];break;default:throw new Error("Unknown SHA variant")}else{if(0!==r.lastIndexOf("SHA3-",0)&&0!==r.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("No SHA variants supported");for(t=0;t<5;t+=1)o[t]=[new i(0,0),new i(0,0),new i(0,0),new i(0,0),new i(0,0)]}return o}function Y(r,e){var n,t,o,i,h,w,u,d=[],f=p,a=S,l=H,s=O,c=y,g=B;for(n=e[0],t=e[1],o=e[2],i=e[3],h=e[4],u=0;u<80;u+=1)d[u]=u<16?r[u]:s(d[u-3]^d[u-8]^d[u-14]^d[u-16],1),w=u<20?g(s(n,5),f(t,o,i),h,1518500249,d[u]):u<40?g(s(n,5),a(t,o,i),h,1859775393,d[u]):u<60?g(s(n,5),l(t,o,i),h,2400959708,d[u]):g(s(n,5),a(t,o,i),h,3395469782,d[u]),h=i,i=o,o=s(t,30),t=n,n=w;return e[0]=c(n,e[0]),e[1]=c(t,e[1]),e[2]=c(o,e[2]),e[3]=c(i,e[3]),e[4]=c(h,e[4]),e}function I(r,e,n,t,o){var i,h,w,u;for(w=15+(e+65>>>9<<4);r.length<=w;)r.push(0);for(r[e>>>5]|=128<<24-e%32,u=e+n,r[w]=4294967295&u,r[w-1]=u/4294967296|0,h=r.length,i=0;i<h;i+=16)t=Y(r.slice(i,i+16),t);return t}function X(r,t,o){var h,w,u,d,f,a,O,l,s,c,g,A,S,C,x,Y,I,X,M,K,j,N,q,z,Z,J,Q,V=[];if("SHA-224"!==o&&"SHA-256"!==o||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==o&&"SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");g=80,S=2,q=i,C=D,x=G,Y=_,I=L,X=k,M=U,K=R,N=v,j=E,Q=n}else g=64,S=1,q=Number,C=y,x=F,Y=B,I=T,X=m,M=P,K=b,N=H,j=p,Q=e;for(h=t[0],w=t[1],u=t[2],d=t[3],f=t[4],a=t[5],O=t[6],l=t[7],A=0;A<g;A+=1)A<16?(J=A*S,z=r.length<=J?0:r[J],Z=r.length<=J+1?0:r[J+1],V[A]=new q(z,Z)):V[A]=x(X(V[A-2]),V[A-7],I(V[A-15]),V[A-16]),s=Y(l,K(f),j(f,a,O),Q[A],V[A]),c=C(M(h),N(h,w,u)),l=O,O=a,a=f,f=C(d,s),d=u,u=w,w=h,h=C(s,c);return t[0]=C(h,t[0]),t[1]=C(w,t[1]),t[2]=C(u,t[2]),t[3]=C(d,t[3]),t[4]=C(f,t[4]),t[5]=C(a,t[5]),t[6]=C(O,t[6]),t[7]=C(l,t[7]),t}function M(r,e){var n,h,w,u,d,f,a,O,s,c=[],g=[];if(null!==r)for(h=0;h<r.length;h+=2)e[(h>>>1)%5][(h>>>1)/5|0]=C(e[(h>>>1)%5][(h>>>1)/5|0],new i(r[h+1],r[h]));for(n=0;n<24;n+=1){for(u=x("SHA3-"),h=0;h<5;h+=1)c[h]=(d=e[h][0],f=e[h][1],a=e[h][2],O=e[h][3],s=e[h][4],new i(d.highOrder^f.highOrder^a.highOrder^O.highOrder^s.highOrder,d.lowOrder^f.lowOrder^a.lowOrder^O.lowOrder^s.lowOrder));for(h=0;h<5;h+=1)g[h]=C(c[(h+4)%5],l(c[(h+1)%5],1));for(h=0;h<5;h+=1)for(w=0;w<5;w+=1)e[h][w]=C(e[h][w],g[h]);for(h=0;h<5;h+=1)for(w=0;w<5;w+=1)u[w][(2*h+3*w)%5]=l(e[h][w],t[h][w]);for(h=0;h<5;h+=1)for(w=0;w<5;w+=1)e[h][w]=C(u[h][w],new i(~u[(h+1)%5][w].highOrder&u[(h+2)%5][w].highOrder,~u[(h+1)%5][w].lowOrder&u[(h+2)%5][w].lowOrder));e[0][0]=C(e[0][0],o[n])}return e}0!=(6&SUPPORTED_ALGS)&&(e=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],0!=(4&SUPPORTED_ALGS)&&(n=[new i(e[0],3609767458),new i(e[1],602891725),new i(e[2],3964484399),new i(e[3],2173295548),new i(e[4],4081628472),new i(e[5],3053834265),new i(e[6],2937671579),new i(e[7],3664609560),new i(e[8],2734883394),new i(e[9],1164996542),new i(e[10],1323610764),new i(e[11],3590304994),new i(e[12],4068182383),new i(e[13],991336113),new i(e[14],633803317),new i(e[15],3479774868),new i(e[16],2666613458),new i(e[17],944711139),new i(e[18],2341262773),new i(e[19],2007800933),new i(e[20],1495990901),new i(e[21],1856431235),new i(e[22],3175218132),new i(e[23],2198950837),new i(e[24],3999719339),new i(e[25],766784016),new i(e[26],2566594879),new i(e[27],3203337956),new i(e[28],1034457026),new i(e[29],2466948901),new i(e[30],3758326383),new i(e[31],168717936),new i(e[32],1188179964),new i(e[33],1546045734),new i(e[34],1522805485),new i(e[35],2643833823),new i(e[36],2343527390),new i(e[37],1014477480),new i(e[38],1206759142),new i(e[39],344077627),new i(e[40],1290863460),new i(e[41],3158454273),new i(e[42],3505952657),new i(e[43],106217008),new i(e[44],3606008344),new i(e[45],1432725776),new i(e[46],1467031594),new i(e[47],851169720),new i(e[48],3100823752),new i(e[49],1363258195),new i(e[50],3750685593),new i(e[51],3785050280),new i(e[52],3318307427),new i(e[53],3812723403),new i(e[54],2003034995),new i(e[55],3602036899),new i(e[56],1575990012),new i(e[57],1125592928),new i(e[58],2716904306),new i(e[59],442776044),new i(e[60],593698344),new i(e[61],3733110249),new i(e[62],2999351573),new i(e[63],3815920427),new i(3391569614,3928383900),new i(3515267271,566280711),new i(3940187606,3454069534),new i(4118630271,4000239992),new i(116418474,1914138554),new i(174292421,2731055270),new i(289380356,3203993006),new i(460393269,320620315),new i(685471733,587496836),new i(852142971,1086792851),new i(1017036298,365543100),new i(1126000580,2618297676),new i(1288033470,3409855158),new i(1501505948,4234509866),new i(1607167915,987167468),new i(1816402316,1246189591)])),0!=(8&SUPPORTED_ALGS)&&(o=[new i(0,1),new i(0,32898),new i(2147483648,32906),new i(2147483648,2147516416),new i(0,32907),new i(0,2147483649),new i(2147483648,2147516545),new i(2147483648,32777),new i(0,138),new i(0,136),new i(0,2147516425),new i(0,2147483658),new i(0,2147516555),new i(2147483648,139),new i(2147483648,32905),new i(2147483648,32771),new i(2147483648,32770),new i(2147483648,128),new i(0,32778),new i(2147483648,2147483658),new i(2147483648,2147516545),new i(2147483648,32896),new i(0,2147483649),new i(2147483648,2147516424)],t=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]]);var K=function(r,e,n){var t,o,i,O,l,s,c,g,A,S,p=0,E=[],H=0,v=r,P=!1,U=[],b=[],R=!1,T=!1,L=-1;if(t=(S=n||{}).encoding||"UTF8",(A=S.numRounds||1)!==parseInt(A,10)||1>A)throw new Error("numRounds must a integer >= 1");if("SHA-1"===v&&0!=(1&SUPPORTED_ALGS))l=512,s=Y,c=I,O=160,g=function(r){return r.slice()};else if(0===v.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))if(s=function(r,e){return X(r,e,v)},c=function(r,e,n,t,o){return function(r,e,n,t,o,i){var h,w,u,d,f,a;if("SHA-224"!==o&&"SHA-256"!==o||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==o&&"SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");u=31+(e+129>>>10<<5),f=32}else u=15+(e+65>>>9<<4),f=16;for(;r.length<=u;)r.push(0);for(r[e>>>5]|=128<<24-e%32,a=e+n,r[u]=4294967295&a,r[u-1]=a/4294967296|0,w=r.length,h=0;h<w;h+=f)t=X(r.slice(h,h+f),t,o);if("SHA-224"===o&&0!=(2&SUPPORTED_ALGS))d=[t[0],t[1],t[2],t[3],t[4],t[5],t[6]];else if("SHA-256"===o&&0!=(2&SUPPORTED_ALGS))d=t;else if("SHA-384"===o&&0!=(4&SUPPORTED_ALGS))d=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder];else{if("SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");d=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder,t[6].highOrder,t[6].lowOrder,t[7].highOrder,t[7].lowOrder]}return d}(r,e,n,t,v)},g=function(r){return r.slice()},"SHA-224"===v&&0!=(2&SUPPORTED_ALGS))l=512,O=224;else if("SHA-256"===v&&0!=(2&SUPPORTED_ALGS))l=512,O=256;else if("SHA-384"===v&&0!=(4&SUPPORTED_ALGS))l=1024,O=384;else{if("SHA-512"!==v||0==(4&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");l=1024,O=512}else{if(0!==v.lastIndexOf("SHA3-",0)&&0!==v.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");var m=6;if(s=M,g=function(r){return function(r){var e,n=[];for(e=0;e<5;e+=1)n[e]=r[e].slice();return n}(r)},L=1,"SHA3-224"===v)l=1152,O=224;else if("SHA3-256"===v)l=1088,O=256;else if("SHA3-384"===v)l=832,O=384;else if("SHA3-512"===v)l=576,O=512;else if("SHAKE128"===v)l=1344,O=-1,m=31,T=!0;else{if("SHAKE256"!==v)throw new Error("Chosen SHA variant is not supported");l=1088,O=-1,m=31,T=!0}c=function(r,e,n,t,o){return function(r,e,n,t,o,i,h){var w,u,d=[],f=o>>>5,a=0,O=e>>>5;for(w=0;w<O&&e>=o;w+=f)t=M(r.slice(w,w+f),t),e-=o;for(r=r.slice(w),e%=o;r.length<f;)r.push(0);for(r[(w=e>>>3)>>2]^=i<<w%4*8,r[f-1]^=2147483648,t=M(r,t);32*d.length<h&&(u=t[a%5][a/5|0],d.push(u.lowOrder),!(32*d.length>=h));)d.push(u.highOrder),0==64*(a+=1)%o&&M(null,t);return d}(r,e,0,t,l,m,o)}}i=a(e,t,L),o=x(v),this.setHMACKey=function(r,e,n){var i,h,w,u,d,f;if(!0===P)throw new Error("HMAC key already set");if(!0===R)throw new Error("Cannot set HMAC key after calling update");if(!0===T&&0!=(8&SUPPORTED_ALGS))throw new Error("SHAKE is not supported for HMAC");if(h=(i=a(e,t=(n||{}).encoding||"UTF8",L)(r)).binLen,w=i.value,f=(u=l>>>3)/4-1,u<h/8){for(w=c(w,h,0,x(v),O);w.length<=f;)w.push(0);w[f]&=4294967040}else if(u>h/8){for(;w.length<=f;)w.push(0);w[f]&=4294967040}for(d=0;d<=f;d+=1)U[d]=909522486^w[d],b[d]=1549556828^w[d];o=s(U,o),p=l,P=!0},this.update=function(r){var e,n,t,h,w,u=0,d=l>>>5;for(n=(e=i(r,E,H)).binLen,h=e.value,t=n>>>5,w=0;w<t;w+=d)u+l<=n&&(o=s(h.slice(w,w+d),o),u+=l);p+=u,E=h.slice(u>>>5),H=n%l,R=!0},this.getHash=function(r,e){var n,t,i,a;if(!0===P)throw new Error("Cannot call getHash after setting HMAC key");if(i=f(e),!0===T&&0!=(8&SUPPORTED_ALGS)){if(-1===i.shakeLen)throw new Error("shakeLen must be specified in options");O=i.shakeLen}switch(r){case"HEX":n=function(r){return h(r,O,L,i)};break;case"B64":n=function(r){return w(r,O,L,i)};break;case"BYTES":n=function(r){return u(r,O,L)};break;case"ARRAYBUFFER":try{t=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return d(r,O,L)};break;default:throw new Error("format must be HEX, B64, BYTES, or ARRAYBUFFER")}for(a=c(E.slice(),H,p,g(o),O),t=1;t<A;t+=1)0!=(8&SUPPORTED_ALGS)&&!0===T&&O%32!=0&&(a[a.length-1]&=16777215>>>24-O%32),a=c(a,O,0,x(v),O);return n(a)},this.getHMAC=function(r,e){var n,t,i,a;if(!1===P)throw new Error("Cannot call getHMAC without first setting HMAC key");switch(i=f(e),r){case"HEX":n=function(r){return h(r,O,L,i)};break;case"B64":n=function(r){return w(r,O,L,i)};break;case"BYTES":n=function(r){return u(r,O,L)};break;case"ARRAYBUFFER":try{n=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return d(r,O,L)};break;default:throw new Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")}return t=c(E.slice(),H,p,g(o),O),a=s(b,x(v)),n(a=c(t,O,l,a,O))}};"function"==typeof define&&define.amd?define((function(){return K})):"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports?(module.exports=K,exports=K):exports=K:r.jsSHA=K}(this),function(r){"use strict";provide(["path","/demand/failure","/demand/function/iterate","/demand/validator/isObject"],(function(e,n,t,o){var i;return demand.on("postConfigure:"+e,(function(r){o(r)&&(i=r)})).on("postRequest",(function(e){var o,h,w;if(o=function(r){var e;return t(i,(function(n,t){if(n===r)return e=t,!1})),e||!1}(e.path))try{(h=new r.jsSHA(o.type,"TEXT")).update(e.source),(w=h.getHash("B64"))!==o.hash&&e.dfd.reject(new n('hash mismatch, should be "'+o.hash+'" but is "'+w+'" (sri)',e.id))}catch(r){e.dfd.reject(new n("unsupported hashing algorithm (sri)",e.id))}})),!0}))}(this);
//# sourceMappingURL=sri.js.map
