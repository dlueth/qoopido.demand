/*! Qoopido.demand 2.1.0 | https://github.com/dlueth/qoopido.demand | (c) 2015 Dirk Lueth */
!function(){"use strict";function n(){return{matchType:/^application\/json/,onPreRequest:function(){var n=this,r=n.url;n.url=".json"!==r.slice(-5)?r+".json":r},process:function(){var n=JSON.parse(this.source);provide(function(){return n})}}}provide(n)}();
//# sourceMappingURL=json.js.map
