/* global
 global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	MODULE_PREFIX, MODULE_PREFIX_HANDLER, MODULE_PREFIX_VALIDATOR, MODULE_PREFIX_FUNCTION, TRUE,
	functionResolveUrl, validatorIsTypeOf, validatorIsArray, validatorIsObject, validatorIsInstanceOf,
	functionMerge, functionIterate, functionDefer,
 	ClassQueue, ClassProcessor, ClassPledge, ClassXhr, ClassFailure,
	singletonUuid,
	handlerModule
*/

(function(global, document, options, setTimeout, clearTimeout) {
	'use strict';

	/* eslint-disable no-unused-vars */
	var settings = { cache: {}, timeout: 8000, pattern: {}, modules: {}, handler: 'module' },
		queue, processor;
	/* eslint-enable no-unused-vars */

	//###require inheritance.js // @todo check if really required
	//=require demand.js
	//=require provide.js
	//=require class/queue.js
	//=require class/processor.js
	//=require handler/module.js
	//=require validator/isInstanceOf.js

	queue     = new ClassQueue();
	processor = new ClassProcessor(queue);

	function assignModule(id, factory) {
		provide(id, function() { return factory; });
	}

	assignModule(MODULE_PREFIX_HANDLER + 'module', handlerModule);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isTypeOf', validatorIsTypeOf);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isArray', validatorIsArray);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isObject', validatorIsObject);
	assignModule(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', validatorIsInstanceOf);
	//assignModule(MODULE_PREFIX_VALIDATOR + 'isPositive', validatorIsPositive);
	assignModule(MODULE_PREFIX_FUNCTION + 'merge', functionMerge);
	assignModule(MODULE_PREFIX_FUNCTION + 'iterate', functionIterate);
	//assignModule(MODULE_PREFIX_FUNCTION + 'hash', functionHash);
	assignModule(MODULE_PREFIX_FUNCTION + 'defer', functionDefer);
	assignModule(MODULE_PREFIX + 'uuid', singletonUuid);
	assignModule(MODULE_PREFIX + 'pledge', ClassPledge);
	assignModule(MODULE_PREFIX + 'queue', ClassQueue);
	assignModule(MODULE_PREFIX + 'xhr', ClassXhr);
	assignModule(MODULE_PREFIX + 'failure', ClassFailure);

	demand.configure({ cache: TRUE, base: '/', pattern: { '/demand': functionResolveUrl(((options && options.url) || location.href) + '/../').slice(0, -1)} });

	if(options) {
		options.settings && demand.configure(options.settings);

		options.main && demand(options.main);
	}
}(this, document, 'demand' in this && demand, setTimeout, clearTimeout));