/*! Qoopido.demand 2.0.6 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(t,r,n,o){"use strict";function e(t,r){return typeof t===r}function i(t){return t&&e(t,"object")}var c=n.slice,u=null,p="function";t.bind||(t.bind=function(t){var r,n,o,i,u=this;if(e(u,p))return r=c.call(arguments,1),n=u,o=function(){},i=function(){return n.apply(u instanceof o?u:t,r.concat(c.call(arguments)))},o.prototype=u.prototype,i.prototype=new o,i;throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}),n.forEach||(n.forEach=function(t,r){var n,o,i=this,c=0;if(i===u)throw new TypeError("this is null or not defined");if(n=Object(i),o=n.length>>>0,!e(t,p))throw new TypeError(t+" is not a function");for(;o>c;)c in n&&t.call(r,n[c],c,n),c++}),Object.keys||(Object.keys=function(){var t=r.hasOwnProperty,n=!{toString:u}.propertyIsEnumerable("toString"),c=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];return function(r){var u,a=[],f=0;if(!i(r)&&!e(r,p))throw new TypeError("Object.keys called on non-object");for(u in r)t.call(r,u)&&a.push(u);if(n)for(;(u=c[f])!==o;f++)t.call(r,u)&&a.push(u);return a}}())}(Function.prototype,Object.prototype,Array.prototype);
//# sourceMappingURL=legacy.js.map
