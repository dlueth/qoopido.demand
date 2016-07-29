/*! Qoopido.demand 3.0.5 | https://github.com/dlueth/qoopido.demand | (c) 2016 Dirk Lueth */
!function(){"use strict";function n(n,e){this.h=n,this.l=e}function e(n,e){var w=(n&H)+(e&H),r=(n>>>16)+(e>>>16)+(w>>>16);return(r&H)<<16|w&H}function w(n,e,w,r){var h=(n&H)+(e&H)+(w&H)+(r&H),t=(n>>>16)+(e>>>16)+(w>>>16)+(r>>>16)+(h>>>16);return(t&H)<<16|h&H}function r(n,e,w,r,h){var t=(n&H)+(e&H)+(w&H)+(r&H)+(h&H),l=(n>>>16)+(e>>>16)+(w>>>16)+(r>>>16)+(h>>>16)+(t>>>16);return(l&H)<<16|t&H}function h(e,w){var r,h,t,l;return r=(e.l&H)+(w.l&H),h=(e.l>>>16)+(w.l>>>16)+(r>>>16),t=(h&H)<<16|r&H,r=(e.h&H)+(w.h&H)+(h>>>16),h=(e.h>>>16)+(w.h>>>16)+(r>>>16),l=(h&H)<<16|r&H,new n(l,t)}function t(e,w,r,h){var t,l,u,a;return t=(e.l&H)+(w.l&H)+(r.l&H)+(h.l&H),l=(e.l>>>16)+(w.l>>>16)+(r.l>>>16)+(h.l>>>16)+(t>>>16),u=(l&H)<<16|t&H,t=(e.h&H)+(w.h&H)+(r.h&H)+(h.h&H)+(l>>>16),l=(e.h>>>16)+(w.h>>>16)+(r.h>>>16)+(h.h>>>16)+(t>>>16),a=(l&H)<<16|t&H,new n(a,u)}function l(e,w,r,h,t){var l,u,a,c;return l=(e.l&H)+(w.l&H)+(r.l&H)+(h.l&H)+(t.l&H),u=(e.l>>>16)+(w.l>>>16)+(r.l>>>16)+(h.l>>>16)+(t.l>>>16)+(l>>>16),a=(u&H)<<16|l&H,l=(e.h&H)+(w.h&H)+(r.h&H)+(h.h&H)+(t.h&H)+(u>>>16),u=(e.h>>>16)+(w.h>>>16)+(r.h>>>16)+(h.h>>>16)+(t.h>>>16)+(l>>>16),c=(u&H)<<16|l&H,new n(c,a)}function u(n){return k(n,7)^k(n,18)^m(n,3)}function a(n){return k(n,17)^k(n,19)^m(n,10)}function c(e){var w=A(e,1),r=A(e,8),h=R(e,7);return new n(w.h^r.h^h.h,w.l^r.l^h.l)}function s(e){var w=A(e,19),r=A(e,61),h=R(e,6);return new n(w.h^r.h^h.h,w.l^r.l^h.l)}function o(n){return k(n,2)^k(n,13)^k(n,22)}function i(n){return k(n,6)^k(n,11)^k(n,25)}function f(e){var w=A(e,28),r=A(e,34),h=A(e,39);return new n(w.h^r.h^h.h,w.l^r.l^h.l)}function v(e){var w=A(e,14),r=A(e,18),h=A(e,41);return new n(w.h^r.h^h.h,w.l^r.l^h.l)}function d(n,e,w){return n&e^n&w^e&w}function p(e,w,r){return new n(e.h&w.h^e.h&r.h^w.h&r.h,e.l&w.l^e.l&r.l^w.l&r.l)}function b(n,e,w){return n&e^~n&w}function g(e,w,r){return new n(e.h&w.h^~e.h&r.h,e.l&w.l^~e.l&r.l)}function k(n,e){return n>>>e|n<<32-e}function A(e,w){var r=null,h=new n(e.h,e.l);return r=32>=w?new n(h.h>>>w|h.l<<32-w&I,h.l>>>w|h.h<<32-w&I):new n(h.l>>>w-32|h.h<<64-w&I,h.h>>>w-32|h.l<<64-w&I)}function m(n,e){return n>>>e}function R(e,w){var r=null;return r=32>=w?new n(e.h>>>w,e.l>>>w|e.h<<32-w&I):new n(0,e.h>>>w-32)}function C(n,e,w){var r,h,t,l,u,a,c,s,o,i=0,f=n.length,v=0;for(h=e||[0],w=w||0,u=w>>>3;f>i;i++)for(a=n.charCodeAt(i),r=[],128>a?r.push(a):2048>a?(r.push(192|a>>>6),r.push(128|63&a)):55296>a||a>=57344?r.push(224|a>>>12,128|a>>>6&63,128|63&a):(i++,a=65536+((1023&a)<<10|1023&n.charCodeAt(i)),r.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|63&a)),t=h.length,l=r.length,c=0;l>c;c++){for(o=v+u,s=o>>>2;s>=t;)h.push(0),t++;h[s]|=r[c]<<8*(3-o%4),v++}return{value:h,length:8*v+w}}function j(n){for(var e,w,r,h,t,l,u="",a=4*n.length,c=0;a>c;c+=3)for(e=n.length,r=c+1>>>2,h=r>=e?0:n[r],r=c+2>>>2,t=r>=e?0:n[r],w=(n[c>>>2]>>>8*(3-c%4)&255)<<16|(h>>>8*(3-(c+1)%4)&255)<<8|t>>>8*(3-(c+2)%4)&255,l=0;4>l;l++)u+=32*e>=8*c+6*l?S.charAt(w>>>6*(3-l)&63):"=";return u}function N(e){var w,r=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];switch(e){case"sha256":w=r;break;case"sha384":w=[new n(3418070365,h[0]),new n(1654270250,h[1]),new n(2438529370,h[2]),new n(355462360,h[3]),new n(1731405415,h[4]),new n(41048885895,h[5]),new n(3675008525,h[6]),new n(1203062813,h[7])];break;case"sha512":w=[new n(r[0],4089235720),new n(r[1],2227873595),new n(r[2],4271175723),new n(r[3],1595750129),new n(r[4],2917565137),new n(r[5],725511199),new n(r[6],4215389547),new n(r[7],327033209)]}return w}function O(k,A,m){var R,C,j,N,O,q,y,E,H,I,S,_,x,z,B,D,F,G,J,K,L,M,P,Q,U,W,X=k.length,Y=0,Z=[];switch(m){case"sha256":S=64,_=1,M=Number,x=e,z=w,B=r,D=u,F=a,G=o,J=i,L=d,K=b,W=T;break;case"sha384":case"sha512":S=80,_=2,M=n,x=h,z=t,B=l,D=c,F=s,G=f,J=v,L=p,K=g,W=V}for(R=A[0],C=A[1],j=A[2],N=A[3],O=A[4],q=A[5],y=A[6],E=A[7];S>Y;Y++)16>Y?(U=Y*_,P=U>=X?0:k[U],Q=U+1>=X?0:k[U+1],Z[Y]=new M(P,Q)):Z[Y]=z(F(Z[Y-2]),Z[Y-7],D(Z[Y-15]),Z[Y-16]),H=B(E,J(O),K(O,q,y),W[Y],Z[Y]),I=x(G(R),L(R,C,j)),E=y,y=q,q=O,O=x(N,H),N=j,j=C,C=R,R=x(H,I);return A[0]=x(R,A[0]),A[1]=x(C,A[1]),A[2]=x(j,A[2]),A[3]=x(N,A[3]),A[4]=x(O,A[4]),A[5]=x(q,A[5]),A[6]=x(y,A[6]),A[7]=x(E,A[7]),A}function q(n,e,w,r,h){var t,l,u,a,c=n.length,s=0;switch(h){case"sha256":l=(e+65>>>9<<4)+15,a=16;break;case"sha384":case"sha512":l=(e+129>>>10<<5)+31,a=32}for(;l>=c;)n.push(0),c++;for(n[e>>>5]|=128<<24-e%32,n[l]=e+w,t=c;t>s;s+=a)r=O(n.slice(s,s+a),r,h);switch(h){case"sha256":u=r;break;case"sha384":u=[r[0].h,r[0].l,r[1].h,r[1].l,r[2].h,r[2].l,r[3].h,r[3].l,r[4].h,r[4].l,r[5].h,r[5].l];break;case"sha512":u=[r[0].h,r[0].l,r[1].h,r[1].l,r[2].h,r[2].l,r[3].h,r[3].l,r[4].h,r[4].l,r[5].h,r[5].l,r[6].h,r[6].l,r[7].h,r[7].l]}return u}function y(n,e){var w,r,h,t,l,u,a,c=[],s=0,o=0,i=0,f=0;switch(n){case"sha256":w=512;break;case"sha384":w=1024;break;case"sha512":w=1024;break;default:throw"SHA_VARIANT_ERROR"}for(r=N(n),h=C(e,c,s),t=h.length,l=h.value,u=t>>>5,a=w>>>5;u>o;o+=a)t>=i+w&&(r=O(l.slice(o,o+a),r,n),i+=w);return f+=i,c=l.slice(i>>>5),s=t%w,r=q(c,s,f,r,n),j(r)}function E(n,e){function w(n){e(n)&&(h=n)}function r(n){var e,w;for(e in h)if(e===n){w=h[e];break}return w||!1}var h;return demand.on("postConfigure:"+n,w),demand.on("postRequest",function(n){var e;(e=r(n.path))&&y(e.type,n.source)!==e.hash&&n.deferred.reject("/demand/plugin/sri")}),!0}var H=65535,I=4294967295,S="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",T=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],V=[new n(T[0],3609767458),new n(T[1],602891725),new n(T[2],3964484399),new n(T[3],2173295548),new n(T[4],4081628472),new n(T[5],3053834265),new n(T[6],2937671579),new n(T[7],3664609560),new n(T[8],2734883394),new n(T[9],1164996542),new n(T[10],1323610764),new n(T[11],3590304994),new n(T[12],4068182383),new n(T[13],991336113),new n(T[14],633803317),new n(T[15],3479774868),new n(T[16],2666613458),new n(T[17],944711139),new n(T[18],2341262773),new n(T[19],2007800933),new n(T[20],1495990901),new n(T[21],1856431235),new n(T[22],3175218132),new n(T[23],2198950837),new n(T[24],3999719339),new n(T[25],766784016),new n(T[26],2566594879),new n(T[27],3203337956),new n(T[28],1034457026),new n(T[29],2466948901),new n(T[30],3758326383),new n(T[31],168717936),new n(T[32],1188179964),new n(T[33],1546045734),new n(T[34],1522805485),new n(T[35],2643833823),new n(T[36],2343527390),new n(T[37],1014477480),new n(T[38],1206759142),new n(T[39],344077627),new n(T[40],1290863460),new n(T[41],3158454273),new n(T[42],3505952657),new n(T[43],106217008),new n(T[44],3606008344),new n(T[45],1432725776),new n(T[46],1467031594),new n(T[47],851169720),new n(T[48],3100823752),new n(T[49],1363258195),new n(T[50],3750685593),new n(T[51],3785050280),new n(T[52],3318307427),new n(T[53],3812723403),new n(T[54],2003034995),new n(T[55],3602036899),new n(T[56],1575990012),new n(T[57],1125592928),new n(T[58],2716904306),new n(T[59],442776044),new n(T[60],593698344),new n(T[61],3733110249),new n(T[62],2999351573),new n(T[63],3815920427),new n(3391569614,3928383900),new n(3515267271,566280711),new n(3940187606,3454069534),new n(4118630271,4000239992),new n(116418474,1914138554),new n(174292421,2731055270),new n(289380356,3203993006),new n(460393269,320620315),new n(685471733,587496836),new n(852142971,1086792851),new n(1017036298,365543100),new n(1126000580,2618297676),new n(1288033470,3409855158),new n(1501505948,4234509866),new n(1607167915,987167468),new n(1816402316,1246189591)];provide(["path","/demand/validator/isObject"],E)}();
//# sourceMappingURL=sri.js.map
