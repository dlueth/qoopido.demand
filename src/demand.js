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

/* global
	global, document, demand, provide, queue, processor, settings,
	MODULE_PREFIX, MODULE_PREFIX_HANDLER, MODULE_PREFIX_VALIDATOR, MODULE_PREFIX_FUNCTION, TRUE,
	functionResolveUrl, validatorIsTypeOf, validatorIsArray, validatorIsObject, validatorIsInstanceOf, functionMerge, functionIterate, functionDefer
 	ClassQueue, ClassProcessor, ClassPledge, ClassXhr, ClassFailure,
	singletonUuid,
	handlerModule
*/

(function(global, document, options) {
	'use strict';

	/* eslint-disable no-unused-vars */
	var settings = { cache: {}, timeout: 8000, pattern: {}, modules: {}, handler: 'module' },
		queue, processor;
	/* eslint-enable no-unused-vars */

	//=require constants.js
	//=require shortcuts.js

	//=require validator/isTypeOf.js
	//=require validator/isPositive.js
	//=require validator/isArray.js
	//=require validator/isObject.js
	//###require validator/isInstanceOf.js
	//=require function/escapeRegex.js
	//=require function/getTimestamp.js
	//=require function/ResolveUrl.js
	//=require function/defer.js
	//=require function/iterate.js
	//=require function/log.js
	//=require function/merge.js

	//=require variables.js

	//=require singleton/uuid.js

	//=require class/descriptor.js
	//=require class/failure.js
	//=require class/loader.js
	//=require class/pattern.js
	//=require class/pledge.js
	//=require class/queue.js
	//=require class/registry.js
	//=require class/xhr.js

	//=require singleton/cache.js
	//=require singleton/event.js

	//###require inheritance.js
	//=require demand.js
	//=require provide.js

	//=require class/processor.js
	//=require class/dependency.js
	//=require handler/module.js

	queue     = new ClassQueue();
	processor = new ClassProcessor(queue);

	function assignModule(id, factory) {
		provide(id, function() { return factory; });
	}

	assignModule(MODULE_PREFIX_HANDLER + 'module', handlerModule);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isTypeOf', validatorIsTypeOf);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isArray', validatorIsArray);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isObject', validatorIsObject);
	//assignModule(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', validatorIsInstanceOf);
	//assignModule(MODULE_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);
	assignModule(MODULE_PREFIX_FUNCTION + 'merge', functionMerge);
	assignModule(MODULE_PREFIX_FUNCTION + 'iterate', functionIterate);
	//assignModule(MODULE_PREFIX_FUNCTION + 'hash', hash);
	assignModule(MODULE_PREFIX_FUNCTION + 'defer', functionDefer);
	assignModule(MODULE_PREFIX + 'uuid', singletonUuid);
	assignModule(MODULE_PREFIX + 'pledge', ClassPledge);
	assignModule(MODULE_PREFIX + 'queue', ClassQueue);
	assignModule(MODULE_PREFIX + 'xhr', ClassXhr);
	assignModule(MODULE_PREFIX + 'failure', ClassFailure);

	demand.configure({ cache: TRUE, base: '/', pattern: { '/demand': functionResolveUrl(((options && options.url) || location.href) + '/../').slice(0, -1)} });
	options && options.settings && demand.configure(options.settings);
	options && options.main && demand(options.main);
}(this, document, 'demand' in this && demand));