/**! Qoopido.demand 7.0.1 | https://github.com/dlueth/qoopido.demand | (c) 2020 Dirk Lueth */
!function(e){"use strict";provide(["/demand/function/iterate"],(function(t){var n=new RegExp("^\\[demand\\]\\[(.+?)\\]\\[state\\]$"),a=/^(.+?),(\d+),(\d*),(.+?),(\d+)$/;function r(t){var r,i=t.match(n);i&&(r=function(t){var n,r=e.getItem(t);if(r&&(n=r.match(a)))return Array.prototype.slice.call(n,1)}("[demand]["+i[1]+"][state]"),this.push({id:i[1],version:r[0],size:parseInt(r[1],10),expires:r[2]?new Date(parseInt(r[2],10)):null,demand:r[3],accessed:new Date(parseInt(r[4],10))}))}return function(){return t(e,r,[])}}))}(localStorage);
//# sourceMappingURL=states.js.map
