/**! Qoopido.demand 4.2.7 | https://github.com/dlueth/qoopido.demand | (c) 2018 Dirk Lueth */
!function(t){"use strict";provide(["/demand/function/iterate"],function(n){var r="demand",e="state",a=new RegExp("^\\["+r+"\\]\\[(.+?)\\]\\["+e+"\\]$"),c=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/;function i(n){var r,e=t.getItem(n);if(e&&(r=e.match(c)))return Array.prototype.slice.call(r,1)}function o(t){return"["+r+"]["+t+"]["+e+"]"}function u(t){var n,r=t.match(a);r&&((n=i(o(r[1])))[5]=r[1],this.push(n))}function d(t,n){return t[4]<n[4]?-1:t[4]>n[4]?1:0}return n(t,function(t){var n=t.match(a);n&&(i(o(n[1]))[4]||demand.clear.path(n[1]))}),function(r){var e,a=[];for(n(t,u,a),a.sort(d);r>0&&a.length;)r-=(e=a.shift())[1],demand.clear.path(e[5])}})}(localStorage);
//# sourceMappingURL=dispose.js.map
