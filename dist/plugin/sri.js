/**! Qoopido.demand 5.0.5 | https://github.com/dlueth/qoopido.demand | (c) 2018 Dirk Lueth */
var SUPPORTED_ALGS=15;!function(r){"use strict";function m(r,e){this.highOrder=r,this.lowOrder=e}function R(r,e,n,t){var o,i,h,w="0123456789abcdef",d="",u=e/8;for(h=-1===n?3:0,o=0;o<u;o+=1)i=r[o>>>2]>>>8*(h+n*(o%4)),d+=w.charAt(i>>>4&15)+w.charAt(15&i);return t.outputUpper?d.toUpperCase():d}function b(r,e,n,t){var o,i,h,w,d,u,f="",a=e/8;for(u=-1===n?3:0,o=0;o<a;o+=3)for(w=o+1<a?r[o+1>>>2]:0,d=o+2<a?r[o+2>>>2]:0,h=(r[o>>>2]>>>8*(u+n*(o%4))&255)<<16|(w>>>8*(u+n*((o+1)%4))&255)<<8|d>>>8*(u+n*((o+2)%4))&255,i=0;i<4;i+=1)f+=8*o+6*i<=e?"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-i)&63):t.b64Pad;return f}function T(r,e,n){var t,o,i,h="",w=e/8;for(i=-1===n?3:0,t=0;t<w;t+=1)o=r[t>>>2]>>>8*(i+n*(t%4))&255,h+=String.fromCharCode(o);return h}function L(r,e,n){var t,o,i,h=e/8,w=new ArrayBuffer(h);for(i=new Uint8Array(w),o=-1===n?3:0,t=0;t<h;t+=1)i[t]=r[t>>>2]>>>8*(o+n*(t%4))&255;return w}function k(r){var e,n={outputUpper:!1,b64Pad:"=",shakeLen:-1};if(e=r||{},n.outputUpper=e.outputUpper||!1,!0===e.hasOwnProperty("b64Pad")&&(n.b64Pad=e.b64Pad),!0===e.hasOwnProperty("shakeLen")&&0!=(8&SUPPORTED_ALGS)){if(e.shakeLen%8!=0)throw new Error("shakeLen must be a multiple of 8");n.shakeLen=e.shakeLen}if("boolean"!=typeof n.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof n.b64Pad)throw new Error("Invalid b64Pad formatting option");return n}function y(r,n,t){var e;switch(n){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(r){case"HEX":e=function(r,e,n){return function(r,e,n,t){var o,i,h,w,d,u,f,a=r.length;if(0!=a%2)throw new Error("String of HEX type must be in byte increments");for(o=e||[0],u=(n=n||0)>>>3,f=-1===t?3:0,i=0;i<a;i+=2){if(h=parseInt(r.substr(i,2),16),isNaN(h))throw new Error("String of HEX type contains invalid characters");for(w=(d=(i>>>1)+u)>>>2;o.length<=w;)o.push(0);o[w]|=h<<8*(f+t*(d%4))}return{value:o,binLen:4*a+n}}(r,e,n,t)};break;case"TEXT":e=function(r,g,e){return function(r,e,n,t,o){var i,h,w,d,u,f,a,O,l,s,c=0;if(i=g||[0],f=(t=t||0)>>>3,"UTF8"===e)for(l=-1===o?3:0,d=0;d<r.length;d+=1)for(w=[],(h=r.charCodeAt(d))<128?w.push(h):h<2048?(w.push(192|h>>>6),w.push(128|63&h)):h<55296||57344<=h?w.push(224|h>>>12,128|h>>>6&63,128|63&h):(d+=1,h=65536+((1023&h)<<10|1023&r.charCodeAt(d)),w.push(240|h>>>18,128|h>>>12&63,128|h>>>6&63,128|63&h)),u=0;u<w.length;u+=1){for(a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=w[u]<<8*(l+o*(O%4)),c+=1}else if("UTF16BE"===e||"UTF16LE"===e)for(l=-1===o?2:0,s="UTF16LE"===e&&1!==o||"UTF16LE"!==e&&1===o,d=0;d<r.length;d+=1){for(h=r.charCodeAt(d),!0===s&&(h=(u=255&h)<<8|h>>>8),a=(O=c+f)>>>2;i.length<=a;)i.push(0);i[a]|=h<<8*(l+o*(O%4)),c+=2}return{value:i,binLen:8*c+t}}(r,n,0,e,t)};break;case"B64":e=function(r,e,n){return function(r,e,n,t){var o,i,h,w,d,u,f,a,O,l,s=0;if(-1===r.search(/^[a-zA-Z0-9=+\/]+$/))throw new Error("Invalid character in base-64 string");if(u=r.indexOf("="),r=r.replace(/\=/g,""),-1!==u&&u<r.length)throw new Error("Invalid '=' found in base-64 string");for(o=e||[0],f=(n=n||0)>>>3,l=-1===t?3:0,i=0;i<r.length;i+=4){for(d=r.substr(i,4),h=w=0;h<d.length;h+=1)w|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d[h])<<18-6*h;for(h=0;h<d.length-1;h+=1){for(a=(O=s+f)>>>2;o.length<=a;)o.push(0);o[a]|=(w>>>16-8*h&255)<<8*(l+t*(O%4)),s+=1}}return{value:o,binLen:8*s+n}}(r,e,n,t)};break;case"BYTES":e=function(r,a,e){return function(r,e,n,t){var o,i,h,w,d,u,f;for(o=a||[0],w=(n=n||0)>>>3,f=-1===t?3:0,h=0;h<r.length;h+=1)i=r.charCodeAt(h),d=(u=h+w)>>>2,o.length<=d&&o.push(0),o[d]|=i<<8*(f+t*(u%4));return{value:o,binLen:8*r.length+n}}(r,0,e,t)};break;case"ARRAYBUFFER":try{e=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}e=function(r,a,e){return function(r,e,n,t){var o,i,h,w,d,u,f;for(o=a||[0],h=(n=n||0)>>>3,u=-1===t?3:0,f=new Uint8Array(r),i=0;i<r.byteLength;i+=1)w=(d=i+h)>>>2,o.length<=w&&o.push(0),o[w]|=f[i]<<8*(u+t*(d%4));return{value:o,binLen:8*r.byteLength+n}}(r,0,e,t)};break;default:throw new Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER")}return e}function g(r,e){return r<<e|r>>>32-e}function l(r,e){return 32<e?(e-=32,new m(r.lowOrder<<e|r.highOrder>>>32-e,r.highOrder<<e|r.lowOrder>>>32-e)):0!==e?new m(r.highOrder<<e|r.lowOrder>>>32-e,r.lowOrder<<e|r.highOrder>>>32-e):r}function e(r,e){return r>>>e|r<<32-e}function o(r,e){var n=new m(r.highOrder,r.lowOrder);return e<=32?new m(n.highOrder>>>e|n.lowOrder<<32-e&4294967295,n.lowOrder>>>e|n.highOrder<<32-e&4294967295):new m(n.lowOrder>>>e-32|n.highOrder<<64-e&4294967295,n.highOrder>>>e-32|n.lowOrder<<64-e&4294967295)}function n(r,e){return r>>>e}function i(r,e){return e<=32?new m(r.highOrder>>>e,r.lowOrder>>>e|r.highOrder<<32-e&4294967295):new m(0,r.highOrder>>>e-32)}function A(r,e,n){return r^e^n}function F(r,e,n){return r&e^~r&n}function B(r,e,n){return new m(r.highOrder&e.highOrder^~r.highOrder&n.highOrder,r.lowOrder&e.lowOrder^~r.lowOrder&n.lowOrder)}function D(r,e,n){return r&e^r&n^e&n}function G(r,e,n){return new m(r.highOrder&e.highOrder^r.highOrder&n.highOrder^e.highOrder&n.highOrder,r.lowOrder&e.lowOrder^r.lowOrder&n.lowOrder^e.lowOrder&n.lowOrder)}function _(r){return e(r,2)^e(r,13)^e(r,22)}function C(r){var e=o(r,28),n=o(r,34),t=o(r,39);return new m(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function x(r){return e(r,6)^e(r,11)^e(r,25)}function Y(r){var e=o(r,14),n=o(r,18),t=o(r,41);return new m(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function I(r){return e(r,7)^e(r,18)^n(r,3)}function X(r){var e=o(r,1),n=o(r,8),t=i(r,7);return new m(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function M(r){return e(r,17)^e(r,19)^n(r,10)}function K(r){var e=o(r,19),n=o(r,61),t=i(r,6);return new m(e.highOrder^n.highOrder^t.highOrder,e.lowOrder^n.lowOrder^t.lowOrder)}function j(r,e){var n=(65535&r)+(65535&e);return(65535&(r>>>16)+(e>>>16)+(n>>>16))<<16|65535&n}function N(r,e,n,t){var o=(65535&r)+(65535&e)+(65535&n)+(65535&t);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16))<<16|65535&o}function q(r,e,n,t,o){var i=(65535&r)+(65535&e)+(65535&n)+(65535&t)+(65535&o);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16)+(i>>>16))<<16|65535&i}function z(r,e){var n,t,o;return n=(65535&r.lowOrder)+(65535&e.lowOrder),o=(65535&(t=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n>>>16)))<<16|65535&n,n=(65535&r.highOrder)+(65535&e.highOrder)+(t>>>16),new m((65535&(t=(r.highOrder>>>16)+(e.highOrder>>>16)+(n>>>16)))<<16|65535&n,o)}function Z(r,e,n,t){var o,i,h;return o=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder),h=(65535&(i=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o>>>16)))<<16|65535&o,o=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(i>>>16),new m((65535&(i=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o>>>16)))<<16|65535&o,h)}function J(r,e,n,t,o){var i,h,w;return i=(65535&r.lowOrder)+(65535&e.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder)+(65535&o.lowOrder),w=(65535&(h=(r.lowOrder>>>16)+(e.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o.lowOrder>>>16)+(i>>>16)))<<16|65535&i,i=(65535&r.highOrder)+(65535&e.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(65535&o.highOrder)+(h>>>16),new m((65535&(h=(r.highOrder>>>16)+(e.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o.highOrder>>>16)+(i>>>16)))<<16|65535&i,w)}function s(r,e){return new m(r.highOrder^e.highOrder,r.lowOrder^e.lowOrder)}function Q(r){var e,n,t,o=[];if("SHA-1"===r&&0!=(1&SUPPORTED_ALGS))o=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===r.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))switch(e=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],n=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],r){case"SHA-224":o=e;break;case"SHA-256":o=n;break;case"SHA-384":o=[new m(3418070365,e[0]),new m(1654270250,e[1]),new m(2438529370,e[2]),new m(355462360,e[3]),new m(1731405415,e[4]),new m(41048885895,e[5]),new m(3675008525,e[6]),new m(1203062813,e[7])];break;case"SHA-512":o=[new m(n[0],4089235720),new m(n[1],2227873595),new m(n[2],4271175723),new m(n[3],1595750129),new m(n[4],2917565137),new m(n[5],725511199),new m(n[6],4215389547),new m(n[7],327033209)];break;default:throw new Error("Unknown SHA variant")}else{if(0!==r.lastIndexOf("SHA3-",0)&&0!==r.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("No SHA variants supported");for(t=0;t<5;t+=1)o[t]=[new m(0,0),new m(0,0),new m(0,0),new m(0,0),new m(0,0)]}return o}function V(r,e){var n,t,o,i,h,w,d,u=[],f=F,a=A,O=D,l=g,s=j,c=q;for(n=e[0],t=e[1],o=e[2],i=e[3],h=e[4],d=0;d<80;d+=1)u[d]=d<16?r[d]:l(u[d-3]^u[d-8]^u[d-14]^u[d-16],1),w=d<20?c(l(n,5),f(t,o,i),h,1518500249,u[d]):d<40?c(l(n,5),a(t,o,i),h,1859775393,u[d]):d<60?c(l(n,5),O(t,o,i),h,2400959708,u[d]):c(l(n,5),a(t,o,i),h,3395469782,u[d]),h=i,i=o,o=l(t,30),t=n,n=w;return e[0]=s(n,e[0]),e[1]=s(t,e[1]),e[2]=s(o,e[2]),e[3]=s(i,e[3]),e[4]=s(h,e[4]),e}function W(r,e,n,t,o){var i,h,w,d;for(w=15+(e+65>>>9<<4);r.length<=w;)r.push(0);for(r[e>>>5]|=128<<24-e%32,d=e+n,r[w]=4294967295&d,r[w-1]=d/tr|0,h=r.length,i=0;i<h;i+=16)t=V(r.slice(i,i+16),t);return t}function $(r,e,n){var t,o,i,h,w,d,u,f,a,O,l,s,c,g,A,S,E,p,H,v,P,U,R,b,T,L=[];if("SHA-224"!==n&&"SHA-256"!==n||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==n&&"SHA-512"!==n||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");l=80,c=2,R=m,g=z,A=Z,S=J,E=X,p=K,H=C,v=Y,U=G,P=B,T=nr}else l=64,c=1,R=Number,g=j,A=N,S=q,E=I,p=M,H=_,v=x,U=D,P=F,T=er;for(t=e[0],o=e[1],i=e[2],h=e[3],w=e[4],d=e[5],u=e[6],f=e[7],s=0;s<l;s+=1)L[s]=s<16?(b=s*c,new R(r.length<=b?0:r[b],r.length<=b+1?0:r[b+1])):A(p(L[s-2]),L[s-7],E(L[s-15]),L[s-16]),a=S(f,v(w),P(w,d,u),T[s],L[s]),O=g(H(t),U(t,o,i)),f=u,u=d,d=w,w=g(h,a),h=i,i=o,o=t,t=g(a,O);return e[0]=g(t,e[0]),e[1]=g(o,e[1]),e[2]=g(i,e[2]),e[3]=g(h,e[3]),e[4]=g(w,e[4]),e[5]=g(d,e[5]),e[6]=g(u,e[6]),e[7]=g(f,e[7]),e}function rr(r,e){var n,t,o,i,h,w,d,u,f,a=[],O=[];if(null!==r)for(t=0;t<r.length;t+=2)e[(t>>>1)%5][(t>>>1)/5|0]=s(e[(t>>>1)%5][(t>>>1)/5|0],new m(r[t+1],r[t]));for(n=0;n<24;n+=1){for(i=Q("SHA3-"),t=0;t<5;t+=1)a[t]=(h=e[t][0],w=e[t][1],d=e[t][2],u=e[t][3],f=e[t][4],new m(h.highOrder^w.highOrder^d.highOrder^u.highOrder^f.highOrder,h.lowOrder^w.lowOrder^d.lowOrder^u.lowOrder^f.lowOrder));for(t=0;t<5;t+=1)O[t]=s(a[(t+4)%5],l(a[(t+1)%5],1));for(t=0;t<5;t+=1)for(o=0;o<5;o+=1)e[t][o]=s(e[t][o],O[t]);for(t=0;t<5;t+=1)for(o=0;o<5;o+=1)i[o][(2*t+3*o)%5]=l(e[t][o],c[t][o]);for(t=0;t<5;t+=1)for(o=0;o<5;o+=1)e[t][o]=s(i[t][o],new m(~i[(t+1)%5][o].highOrder&i[(t+2)%5][o].highOrder,~i[(t+1)%5][o].lowOrder&i[(t+2)%5][o].lowOrder));e[0][0]=s(e[0][0],S[n])}return e}var er,nr,c,S,t,tr=4294967296;0!=(6&SUPPORTED_ALGS)&&(er=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],0!=(4&SUPPORTED_ALGS)&&(nr=[new m(er[0],3609767458),new m(er[1],602891725),new m(er[2],3964484399),new m(er[3],2173295548),new m(er[4],4081628472),new m(er[5],3053834265),new m(er[6],2937671579),new m(er[7],3664609560),new m(er[8],2734883394),new m(er[9],1164996542),new m(er[10],1323610764),new m(er[11],3590304994),new m(er[12],4068182383),new m(er[13],991336113),new m(er[14],633803317),new m(er[15],3479774868),new m(er[16],2666613458),new m(er[17],944711139),new m(er[18],2341262773),new m(er[19],2007800933),new m(er[20],1495990901),new m(er[21],1856431235),new m(er[22],3175218132),new m(er[23],2198950837),new m(er[24],3999719339),new m(er[25],766784016),new m(er[26],2566594879),new m(er[27],3203337956),new m(er[28],1034457026),new m(er[29],2466948901),new m(er[30],3758326383),new m(er[31],168717936),new m(er[32],1188179964),new m(er[33],1546045734),new m(er[34],1522805485),new m(er[35],2643833823),new m(er[36],2343527390),new m(er[37],1014477480),new m(er[38],1206759142),new m(er[39],344077627),new m(er[40],1290863460),new m(er[41],3158454273),new m(er[42],3505952657),new m(er[43],106217008),new m(er[44],3606008344),new m(er[45],1432725776),new m(er[46],1467031594),new m(er[47],851169720),new m(er[48],3100823752),new m(er[49],1363258195),new m(er[50],3750685593),new m(er[51],3785050280),new m(er[52],3318307427),new m(er[53],3812723403),new m(er[54],2003034995),new m(er[55],3602036899),new m(er[56],1575990012),new m(er[57],1125592928),new m(er[58],2716904306),new m(er[59],442776044),new m(er[60],593698344),new m(er[61],3733110249),new m(er[62],2999351573),new m(er[63],3815920427),new m(3391569614,3928383900),new m(3515267271,566280711),new m(3940187606,3454069534),new m(4118630271,4000239992),new m(116418474,1914138554),new m(174292421,2731055270),new m(289380356,3203993006),new m(460393269,320620315),new m(685471733,587496836),new m(852142971,1086792851),new m(1017036298,365543100),new m(1126000580,2618297676),new m(1288033470,3409855158),new m(1501505948,4234509866),new m(1607167915,987167468),new m(1816402316,1246189591)])),0!=(8&SUPPORTED_ALGS)&&(S=[new m(0,1),new m(0,32898),new m(2147483648,32906),new m(2147483648,2147516416),new m(0,32907),new m(0,2147483649),new m(2147483648,2147516545),new m(2147483648,32777),new m(0,138),new m(0,136),new m(0,2147516425),new m(0,2147483658),new m(0,2147516555),new m(2147483648,139),new m(2147483648,32905),new m(2147483648,32771),new m(2147483648,32770),new m(2147483648,128),new m(0,32778),new m(2147483648,2147483658),new m(2147483648,2147516545),new m(2147483648,32896),new m(0,2147483649),new m(2147483648,2147516424)],c=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]]),t=function(r,e,n){var u,d,f,a,O,l,h,i,s=0,c=[],g=0,A=r,S=!1,E=[],p=[],H=!1,v=!1,P=-1,t=n||{},U=t.encoding||"UTF8",w=t.numRounds||1;if(w!==parseInt(w,10)||w<1)throw new Error("numRounds must a integer >= 1");if("SHA-1"===A&&0!=(1&SUPPORTED_ALGS))a=512,O=V,l=W,f=160,h=function(r){return r.slice()};else if(0===A.lastIndexOf("SHA-",0)&&0!=(6&SUPPORTED_ALGS))if(O=function(r,e){return $(r,e,A)},l=function(r,e,n,t,o){return function(r,e,n,t,o,i){var h,w,d,u,f,a;if("SHA-224"!==o&&"SHA-256"!==o||0==(2&SUPPORTED_ALGS)){if("SHA-384"!==o&&"SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");d=31+(e+129>>>10<<5),f=32}else d=15+(e+65>>>9<<4),f=16;for(;r.length<=d;)r.push(0);for(r[e>>>5]|=128<<24-e%32,a=e+n,r[d]=4294967295&a,r[d-1]=a/tr|0,w=r.length,h=0;h<w;h+=f)t=$(r.slice(h,h+f),t,o);if("SHA-224"===o&&0!=(2&SUPPORTED_ALGS))u=[t[0],t[1],t[2],t[3],t[4],t[5],t[6]];else if("SHA-256"===o&&0!=(2&SUPPORTED_ALGS))u=t;else if("SHA-384"===o&&0!=(4&SUPPORTED_ALGS))u=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder];else{if("SHA-512"!==o||0==(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");u=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder,t[6].highOrder,t[6].lowOrder,t[7].highOrder,t[7].lowOrder]}return u}(r,e,n,t,A)},h=function(r){return r.slice()},"SHA-224"===A&&0!=(2&SUPPORTED_ALGS))a=512,f=224;else if("SHA-256"===A&&0!=(2&SUPPORTED_ALGS))a=512,f=256;else if("SHA-384"===A&&0!=(4&SUPPORTED_ALGS))a=1024,f=384;else{if("SHA-512"!==A||0==(4&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");a=1024,f=512}else{if(0!==A.lastIndexOf("SHA3-",0)&&0!==A.lastIndexOf("SHAKE",0)||0==(8&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");if(i=6,O=rr,h=function(r){return function(r){var e,n=[];for(e=0;e<5;e+=1)n[e]=r[e].slice();return n}(r)},P=1,"SHA3-224"===A)a=1152,f=224;else if("SHA3-256"===A)a=1088,f=256;else if("SHA3-384"===A)a=832,f=384;else if("SHA3-512"===A)a=576,f=512;else if("SHAKE128"===A)a=1344,f=-1,i=31,v=!0;else{if("SHAKE256"!==A)throw new Error("Chosen SHA variant is not supported");a=1088,f=-1,i=31,v=!0}l=function(r,e,n,t,o){return function(r,e,n,t,o,i,h){var w,d,u=[],f=o>>>5,a=0,O=e>>>5;for(w=0;w<O&&o<=e;w+=f)t=rr(r.slice(w,w+f),t),e-=o;for(r=r.slice(w),e%=o;r.length<f;)r.push(0);for(r[(w=e>>>3)>>2]^=i<<w%4*8,r[f-1]^=2147483648,t=rr(r,t);32*u.length<h&&(d=t[a%5][a/5|0],u.push(d.lowOrder),!(32*u.length>=h));)u.push(d.highOrder),0==64*(a+=1)%o&&rr(null,t);return u}(r,e,0,t,a,i,o)}}d=y(e,U,P),u=Q(A),this.setHMACKey=function(r,e,n){var t,o,i,h,w,d;if(!0===S)throw new Error("HMAC key already set");if(!0===H)throw new Error("Cannot set HMAC key after calling update");if(!0===v&&0!=(8&SUPPORTED_ALGS))throw new Error("SHAKE is not supported for HMAC");if(o=(t=y(e,U=(n||{}).encoding||"UTF8",P)(r)).binLen,i=t.value,d=(h=a>>>3)/4-1,h<o/8){for(i=l(i,o,0,Q(A),f);i.length<=d;)i.push(0);i[d]&=4294967040}else if(o/8<h){for(;i.length<=d;)i.push(0);i[d]&=4294967040}for(w=0;w<=d;w+=1)E[w]=909522486^i[w],p[w]=1549556828^i[w];u=O(E,u),s=a,S=!0},this.update=function(r){var e,n,t,o,i,h=0,w=a>>>5;for(n=(e=d(r,c,g)).binLen,o=e.value,t=n>>>5,i=0;i<t;i+=w)h+a<=n&&(u=O(o.slice(i,i+w),u),h+=a);s+=h,c=o.slice(h>>>5),g=n%a,H=!0},this.getHash=function(r,e){var n,t,o,i;if(!0===S)throw new Error("Cannot call getHash after setting HMAC key");if(o=k(e),!0===v&&0!=(8&SUPPORTED_ALGS)){if(-1===o.shakeLen)throw new Error("shakeLen must be specified in options");f=o.shakeLen}switch(r){case"HEX":n=function(r){return R(r,f,P,o)};break;case"B64":n=function(r){return b(r,f,P,o)};break;case"BYTES":n=function(r){return T(r,f,P)};break;case"ARRAYBUFFER":try{t=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return L(r,f,P)};break;default:throw new Error("format must be HEX, B64, BYTES, or ARRAYBUFFER")}for(i=l(c.slice(),g,s,h(u),f),t=1;t<w;t+=1)0!=(8&SUPPORTED_ALGS)&&!0===v&&f%32!=0&&(i[i.length-1]&=16777215>>>24-f%32),i=l(i,f,0,Q(A),f);return n(i)},this.getHMAC=function(r,e){var n,t,o,i;if(!1===S)throw new Error("Cannot call getHMAC without first setting HMAC key");switch(o=k(e),r){case"HEX":n=function(r){return R(r,f,P,o)};break;case"B64":n=function(r){return b(r,f,P,o)};break;case"BYTES":n=function(r){return T(r,f,P)};break;case"ARRAYBUFFER":try{n=new ArrayBuffer(0)}catch(r){throw new Error("ARRAYBUFFER not supported by this environment")}n=function(r){return L(r,f,P)};break;default:throw new Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")}return t=l(c.slice(),g,s,h(u),f),i=O(p,Q(A)),n(i=l(t,f,a,i,f))}},"function"==typeof define&&define.amd?define(function(){return t}):"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(module.exports=t),exports=t):r.jsSHA=t}(this),function(u){"use strict";provide(["path","/demand/failure","/demand/function/iterate","/demand/validator/isObject"],function(r,h,w,e){var d;return demand.on("postConfigure:"+r,function(r){e(r)&&(d=r)}).on("postRequest",function(e){var r,n,t,o,i;if(o=e.path,w(d,function(r,e){if(r===o)return i=e,!1}),r=i||!1)try{(n=new u.jsSHA(r.type,"TEXT")).update(e.source),(t=n.getHash("B64"))!==r.hash&&e.dfd.reject(new h('hash mismatch, should be "'+r.hash+'" but is "'+t+'" (sri)',e.id))}catch(r){e.dfd.reject(new h("unsupported hashing algorithm (sri)",e.id))}}),!0})}(this);
//# sourceMappingURL=sri.js.map
