/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	MODULE_PREFIX, MODULE_PREFIX_HANDLER, MODULE_PREFIX_VALIDATOR, MODULE_PREFIX_PLUGIN, MODULE_PREFIX_FUNCTION, MODULE_PREFIX_ABSTRACT, STRING_STRING, STRING_FUNCTION, TRUE,
	validatorIsTypeOf, validatorIsArray, validatorIsObject, validatorIsInstanceOf,
	functionResolveUrl, functionResolveSourcemaps, functionMerge, functionIterate, functionDefer, functionHash, functionUuid,
	AbstractUuid, abstractHandler,
 	ClassQueue, ClassProcessor, ClassPledge, ClassXhr, ClassFailure, ClassDescriptor
	handlerModule, handlerBundle,
 	pluginGenie
*/

/*eslint no-unused-vars: [2, { "vars": "local", "args": "none" }]*/
(function(global, document, options, setTimeout, clearTimeout) {
	'use strict';

	/* eslint-disable no-unused-vars */
	var settings = { version: '1.0.0', cache: {}, timeout: 8000, pattern: {}, modules: {}, handler: 'module' },
		storage  = {},
		queue, processor;
	/* eslint-enable no-unused-vars */

	// include inheritance
		//=require inheritance.js

	// include main components
		//=require function/demand.js
		//=require function/provide.js

	// process initial configuration
		demand.configure({ cache: TRUE, base: '/', pattern: { '/demand': functionResolveUrl(((options && options.url) || location.href) + '/../').slice(0, -1)} });
		options && options.settings && demand.configure(options.settings);

	// include additional components
		//=require function/hash.js
		//=require class/queue.js
		//=require class/processor.js
		//=require handler/module.js
		//=require handler/bundle.js
		//=require plugin/genie.js

	// initialize
		queue     = new ClassQueue();
		processor = new ClassProcessor(queue);

		function assignModule(id, module) {
			provide(id, function() { return module; });
		}

		assignModule(MODULE_PREFIX_ABSTRACT + 'uuid', AbstractUuid);
		assignModule(MODULE_PREFIX_ABSTRACT + 'handler', abstractHandler);
		assignModule(MODULE_PREFIX_HANDLER + 'module', handlerModule);
		assignModule(MODULE_PREFIX_HANDLER + 'bundle', handlerBundle);
		assignModule(MODULE_PREFIX_PLUGIN + 'genie', pluginGenie);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isTypeOf', validatorIsTypeOf);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isArray', validatorIsArray);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isObject', validatorIsObject);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', validatorIsInstanceOf);
		assignModule(MODULE_PREFIX_FUNCTION + 'resolveUrl', functionResolveUrl);
		assignModule(MODULE_PREFIX_FUNCTION + 'resolveSourcemaps', functionResolveSourcemaps);
		assignModule(MODULE_PREFIX_FUNCTION + 'merge', functionMerge);
		assignModule(MODULE_PREFIX_FUNCTION + 'iterate', functionIterate);
		assignModule(MODULE_PREFIX_FUNCTION + 'hash', functionHash);
		assignModule(MODULE_PREFIX_FUNCTION + 'defer', functionDefer);
		assignModule(MODULE_PREFIX + 'descriptor', ClassDescriptor);
		assignModule(MODULE_PREFIX + 'pledge', ClassPledge);
		assignModule(MODULE_PREFIX + 'queue', ClassQueue);
		assignModule(MODULE_PREFIX + 'xhr', ClassXhr);
		assignModule(MODULE_PREFIX + 'failure', ClassFailure);

		if(options && options.main) {
			switch(typeof options.main) {
				case STRING_STRING:
					demand(options.main);

					break;
				case STRING_FUNCTION:
					provide('main', options.main());

					break;
			}
		}
}(this, document, 'demand' in this && demand, setTimeout, clearTimeout));