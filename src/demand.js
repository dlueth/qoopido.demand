/**
 * Qoopido demand
 *
 * Promise like module loader (XHR) with localStorage caching
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @todo add garbage collection to storage (based on "last access")
 * @todo check genie for what happens if a single module is in cache, but not yet requested
 */

/* global demand, resolveUrl, TRUE */

(function(global, document, options) {
	'use strict';

	var settings = { cache: {}, timeout: 8000, pattern: {}, modules: {}, handler: 'module' };

	//=require constants.js
	//=require shortcuts.js
	//=require function/resolveUrl.js
	//=require demand.js
	//=require provide.js
	//=require handler/module.js
	
	if(options && options.main) {
		demand(options.main);
	}
}(this, document, 'demand' in this && demand));