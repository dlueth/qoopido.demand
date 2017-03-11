/**! Qoopido.demand 4.2.2 | https://github.com/dlueth/qoopido.demand | (c) 2017 Dirk Lueth */
!function(){"use strict";function n(n,e){this.h=n,this.l=e}function e(n,e){var r=(n&H)+(e&H),w=(n>>>16)+(e>>>16)+(r>>>16);return(w&H)<<16|r&H}function r(n,e,r,w){var h=(n&H)+(e&H)+(r&H)+(w&H),t=(n>>>16)+(e>>>16)+(r>>>16)+(w>>>16)+(h>>>16);return(t&H)<<16|h&H}function w(n,e,r,w,h){var t=(n&H)+(e&H)+(r&H)+(w&H)+(h&H),l=(n>>>16)+(e>>>16)+(r>>>16)+(w>>>16)+(h>>>16)+(t>>>16);return(l&H)<<16|t&H}function h(e,r){var w,h,t,l;return w=(e.l&H)+(r.l&H),h=(e.l>>>16)+(r.l>>>16)+(w>>>16),t=(h&H)<<16|w&H,w=(e.h&H)+(r.h&H)+(h>>>16),h=(e.h>>>16)+(r.h>>>16)+(w>>>16),l=(h&H)<<16|w&H,new n(l,t)}function t(e,r,w,h){var t,l,u,a;return t=(e.l&H)+(r.l&H)+(w.l&H)+(h.l&H),l=(e.l>>>16)+(r.l>>>16)+(w.l>>>16)+(h.l>>>16)+(t>>>16),u=(l&H)<<16|t&H,t=(e.h&H)+(r.h&H)+(w.h&H)+(h.h&H)+(l>>>16),l=(e.h>>>16)+(r.h>>>16)+(w.h>>>16)+(h.h>>>16)+(t>>>16),a=(l&H)<<16|t&H,new n(a,u)}function l(e,r,w,h,t){var l,u,a,c;return l=(e.l&H)+(r.l&H)+(w.l&H)+(h.l&H)+(t.l&H),u=(e.l>>>16)+(r.l>>>16)+(w.l>>>16)+(h.l>>>16)+(t.l>>>16)+(l>>>16),a=(u&H)<<16|l&H,l=(e.h&H)+(r.h&H)+(w.h&H)+(h.h&H)+(t.h&H)+(u>>>16),u=(e.h>>>16)+(r.h>>>16)+(w.h>>>16)+(h.h>>>16)+(t.h>>>16)+(l>>>16),c=(u&H)<<16|l&H,new n(c,a)}function u(n){return k(n,7)^k(n,18)^m(n,3)}function a(n){return k(n,17)^k(n,19)^m(n,10)}function c(e){var r=A(e,1),w=A(e,8),h=R(e,7);return new n(r.h^w.h^h.h,r.l^w.l^h.l)}function o(e){var r=A(e,19),w=A(e,61),h=R(e,6);return new n(r.h^w.h^h.h,r.l^w.l^h.l)}function i(n){return k(n,2)^k(n,13)^k(n,22)}function s(n){return k(n,6)^k(n,11)^k(n,25)}function f(e){var r=A(e,28),w=A(e,34),h=A(e,39);return new n(r.h^w.h^h.h,r.l^w.l^h.l)}function v(e){var r=A(e,14),w=A(e,18),h=A(e,41);return new n(r.h^w.h^h.h,r.l^w.l^h.l)}function d(n,e,r){return n&e^n&r^e&r}function p(e,r,w){return new n(e.h&r.h^e.h&w.h^r.h&w.h,e.l&r.l^e.l&w.l^r.l&w.l)}function b(n,e,r){return n&e^~n&r}function g(e,r,w){return new n(e.h&r.h^~e.h&w.h,e.l&r.l^~e.l&w.l)}function k(n,e){return n>>>e|n<<32-e}function A(e,r){var w=null,h=new n(e.h,e.l);return w=32>=r?new n(h.h>>>r|h.l<<32-r&I,h.l>>>r|h.h<<32-r&I):new n(h.l>>>r-32|h.h<<64-r&I,h.h>>>r-32|h.l<<64-r&I)}function m(n,e){return n>>>e}function R(e,r){var w=null;return w=32>=r?new n(e.h>>>r,e.l>>>r|e.h<<32-r&I):new n(0,e.h>>>r-32)}function C(n,e,r){var w,h,t,l,u,a,c,o,i,s=0,f=n.length,v=0;for(h=e||[0],r=r||0,u=r>>>3;s<f;s++)for(a=n.charCodeAt(s),w=[],128>a?w.push(a):2048>a?(w.push(192|a>>>6),w.push(128|63&a)):55296>a||57344<=a?w.push(224|a>>>12,128|a>>>6&63,128|63&a):(s++,a=65536+((1023&a)<<10|1023&n.charCodeAt(s)),w.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|63&a)),t=h.length,l=w.length,c=0;c<l;c++){for(i=v+u,o=i>>>2;t<=o;)h.push(0),t++;h[o]|=w[c]<<8*(3-i%4),v++}return{value:h,length:8*v+r}}function j(n){for(var e,r,w,h,t,l,u="",a=4*n.length,c=0;c<a;c+=3)for(e=n.length,w=c+1>>>2,h=e<=w?0:n[w],w=c+2>>>2,t=e<=w?0:n[w],r=(n[c>>>2]>>>8*(3-c%4)&255)<<16|(h>>>8*(3-(c+1)%4)&255)<<8|t>>>8*(3-(c+2)%4)&255,l=0;l<4;l++)u+=8*c+6*l<=32*e?S.charAt(r>>>6*(3-l)&63):"=";return u}function N(e){var r,w=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];switch(e){case"sha256":r=w;break;case"sha384":r=[new n(3418070365,h[0]),new n(1654270250,h[1]),new n(2438529370,h[2]),new n(355462360,h[3]),new n(1731405415,h[4]),new n(41048885895,h[5]),new n(3675008525,h[6]),new n(1203062813,h[7])];break;case"sha512":r=[new n(w[0],4089235720),new n(w[1],2227873595),new n(w[2],4271175723),new n(w[3],1595750129),new n(w[4],2917565137),new n(w[5],725511199),new n(w[6],4215389547),new n(w[7],327033209)]}return r}function O(k,A,m){var R,C,j,N,O,q,y,E,H,I,S,_,x,z,B,D,F,G,J,K,L,M,P,Q,U,W,X=k.length,Y=0,Z=[];switch(m){case"sha256":S=64,_=1,M=Number,x=e,z=r,B=w,D=u,F=a,G=i,J=s,L=d,K=b,W=T;break;case"sha384":case"sha512":S=80,_=2,M=n,x=h,z=t,B=l,D=c,F=o,G=f,J=v,L=p,K=g,W=V}for(R=A[0],C=A[1],j=A[2],N=A[3],O=A[4],q=A[5],y=A[6],E=A[7];Y<S;Y++)Y<16?(U=Y*_,P=X<=U?0:k[U],Q=X<=U+1?0:k[U+1],Z[Y]=new M(P,Q)):Z[Y]=z(F(Z[Y-2]),Z[Y-7],D(Z[Y-15]),Z[Y-16]),H=B(E,J(O),K(O,q,y),W[Y],Z[Y]),I=x(G(R),L(R,C,j)),E=y,y=q,q=O,O=x(N,H),N=j,j=C,C=R,R=x(H,I);return A[0]=x(R,A[0]),A[1]=x(C,A[1]),A[2]=x(j,A[2]),A[3]=x(N,A[3]),A[4]=x(O,A[4]),A[5]=x(q,A[5]),A[6]=x(y,A[6]),A[7]=x(E,A[7]),A}function q(n,e,r,w,h){var t,l,u,a,c=n.length,o=0;switch(h){case"sha256":l=(e+65>>>9<<4)+15,a=16;break;case"sha384":case"sha512":l=(e+129>>>10<<5)+31,a=32}for(;c<=l;)n.push(0),c++;for(n[e>>>5]|=128<<24-e%32,n[l]=e+r,t=c;o<t;o+=a)w=O(n.slice(o,o+a),w,h);switch(h){case"sha256":u=w;break;case"sha384":u=[w[0].h,w[0].l,w[1].h,w[1].l,w[2].h,w[2].l,w[3].h,w[3].l,w[4].h,w[4].l,w[5].h,w[5].l];break;case"sha512":u=[w[0].h,w[0].l,w[1].h,w[1].l,w[2].h,w[2].l,w[3].h,w[3].l,w[4].h,w[4].l,w[5].h,w[5].l,w[6].h,w[6].l,w[7].h,w[7].l]}return u}function y(n,e){var r,w,h,t,l,u,a,c=[],o=0,i=0,s=0,f=0;switch(n){case"sha256":r=512;break;case"sha384":r=1024;break;case"sha512":r=1024;break;default:throw"SHA_VARIANT_ERROR"}for(w=N(n),h=C(e,c,o),t=h.length,l=h.value,u=t>>>5,a=r>>>5;i<u;i+=a)s+r<=t&&(w=O(l.slice(i,i+a),w,n),s+=r);return f+=s,c=l.slice(s>>>5),o=t%r,w=q(c,o,f,w,n),j(w)}function E(n,e,r,w){function h(n){var e;return r(t,function(r,w){if(r===n)return e=w,!1}),e||!1}var t;return demand.on("postConfigure:"+n,function(n){w(n)&&(t=n)}).on("postRequest",function(n){var r;(r=h(n.path))&&y(r.type,n.source)!==r.hash&&n.dfd.reject(new e("error resolving (sri)",n.id))}),!0}var H=65535,I=4294967295,S="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",T=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],V=[new n(T[0],3609767458),new n(T[1],602891725),new n(T[2],3964484399),new n(T[3],2173295548),new n(T[4],4081628472),new n(T[5],3053834265),new n(T[6],2937671579),new n(T[7],3664609560),new n(T[8],2734883394),new n(T[9],1164996542),new n(T[10],1323610764),new n(T[11],3590304994),new n(T[12],4068182383),new n(T[13],991336113),new n(T[14],633803317),new n(T[15],3479774868),new n(T[16],2666613458),new n(T[17],944711139),new n(T[18],2341262773),new n(T[19],2007800933),new n(T[20],1495990901),new n(T[21],1856431235),new n(T[22],3175218132),new n(T[23],2198950837),new n(T[24],3999719339),new n(T[25],766784016),new n(T[26],2566594879),new n(T[27],3203337956),new n(T[28],1034457026),new n(T[29],2466948901),new n(T[30],3758326383),new n(T[31],168717936),new n(T[32],1188179964),new n(T[33],1546045734),new n(T[34],1522805485),new n(T[35],2643833823),new n(T[36],2343527390),new n(T[37],1014477480),new n(T[38],1206759142),new n(T[39],344077627),new n(T[40],1290863460),new n(T[41],3158454273),new n(T[42],3505952657),new n(T[43],106217008),new n(T[44],3606008344),new n(T[45],1432725776),new n(T[46],1467031594),new n(T[47],851169720),new n(T[48],3100823752),new n(T[49],1363258195),new n(T[50],3750685593),new n(T[51],3785050280),new n(T[52],3318307427),new n(T[53],3812723403),new n(T[54],2003034995),new n(T[55],3602036899),new n(T[56],1575990012),new n(T[57],1125592928),new n(T[58],2716904306),new n(T[59],442776044),new n(T[60],593698344),new n(T[61],3733110249),new n(T[62],2999351573),new n(T[63],3815920427),new n(3391569614,3928383900),new n(3515267271,566280711),new n(3940187606,3454069534),new n(4118630271,4000239992),new n(116418474,1914138554),new n(174292421,2731055270),new n(289380356,3203993006),new n(460393269,320620315),new n(685471733,587496836),new n(852142971,1086792851),new n(1017036298,365543100),new n(1126000580,2618297676),new n(1288033470,3409855158),new n(1501505948,4234509866),new n(1607167915,987167468),new n(1816402316,1246189591)];provide(["path","/demand/failure","/demand/function/iterate","/demand/validator/isObject"],E)}();
//# sourceMappingURL=sri.js.map
