/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	MODULE_PREFIX, MODULE_PREFIX_HANDLER, MODULE_PREFIX_VALIDATOR, MODULE_PREFIX_PLUGIN, MODULE_PREFIX_FUNCTION, MODULE_PREFIX_ABSTRACT, STRING_STRING, STRING_FUNCTION, TRUE,
	validatorIsTypeOf, validatorIsArray, validatorIsObject, validatorIsInstanceOf, validatorIsSemver,
	functionResolveUrl, functionResolveSourcemaps, functionMerge, functionIterate, functionDefer, functionToArray, functionIdle, functionHash, functionUuid,
	AbstractUuid, abstractHandler,
	ClassLogger, ClassDependency, ClassQueue, ClassProcessor, ClassPledge, ClassFailure, ClassDescriptor, ClassWeakmap, ClassTask, ClassSemver,
	handlerModule, handlerBundle, handlerComponent,
 	pluginGenie
*/

/*eslint no-unused-vars: [2, { "vars": "local", "args": "none" }]*/
(function(global, setTimeout, clearTimeout) {
	'use strict';

	/* eslint-disable no-unused-vars */
	var document = global.document,
		options  = 'demand' in global && global.demand,
		settings = { version: '1.0.0', cache: {}, timeout: 8000, pattern: {}, modules: {}, handler: 'module' },
		demand, provide, queue, processor, log;

	/*
	function _log(method, message, color) {
		typeof console !== 'undefined' && console[method]('%c' + prefix + '%c' + message.toString(), 'display:inline-block;padding:0.5em;line-height:1;font-weight:bold;color:#fff;background-color:' + color + ';border-radius:3px;', 'display:inline-block;padding:0.5em;line-height:1;');
	}

	log = {
		info: function(message) {
			_log('info', message, '#95ba00');
		},
		warning: function(message) {
			_log('warn', message, '#f49d0c');
		},
		error: function(message) {
			_log('error', message, '#af0032');
		}
	}
	*/

	// include logger
		//=require class/logger.js

	// include inheritance
		//=require inheritance.js

	// include main components
		//=require function/demand.js
		//=require function/provide.js

	// process initial configuration
		log = new ClassLogger('qoopido.demand');
		demand.configure({ cache: TRUE, base: '/', pattern: { '/demand': functionResolveUrl(((options && options.url) || location.href) + '/../').slice(0, -1)} });
		options && options.settings && demand.configure(options.settings);

	// include additional components
		//=require function/hash.js
		//=require class/queue.js
		//=require class/processor.js
		//=require handler/module.js
		//=require handler/bundle.js
		//=require handler/component.js
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
		assignModule(MODULE_PREFIX_HANDLER + 'component', handlerComponent);
		assignModule(MODULE_PREFIX_PLUGIN + 'genie', pluginGenie);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isTypeOf', validatorIsTypeOf);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isArray', validatorIsArray);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isObject', validatorIsObject);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', validatorIsInstanceOf);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isSemver', validatorIsSemver);
		assignModule(MODULE_PREFIX_FUNCTION + 'resolveUrl', functionResolveUrl);
		assignModule(MODULE_PREFIX_FUNCTION + 'resolveSourcemaps', functionResolveSourcemaps);
		assignModule(MODULE_PREFIX_FUNCTION + 'merge', functionMerge);
		assignModule(MODULE_PREFIX_FUNCTION + 'iterate', functionIterate);
		assignModule(MODULE_PREFIX_FUNCTION + 'hash', functionHash);
		assignModule(MODULE_PREFIX_FUNCTION + 'defer', functionDefer);
		assignModule(MODULE_PREFIX_FUNCTION + 'idle', functionIdle);
		assignModule(MODULE_PREFIX_FUNCTION + 'uuid', functionUuid);
		assignModule(MODULE_PREFIX_FUNCTION + 'toArray', functionToArray);
		assignModule(MODULE_PREFIX + 'logger', ClassLogger);
		assignModule(MODULE_PREFIX + 'task', ClassTask);
		assignModule(MODULE_PREFIX + 'weakmap', ClassWeakmap);
		assignModule(MODULE_PREFIX + 'descriptor', ClassDescriptor);
		assignModule(MODULE_PREFIX + 'pledge', ClassPledge);
		assignModule(MODULE_PREFIX + 'queue', ClassQueue);
		assignModule(MODULE_PREFIX + 'failure', ClassFailure);
		assignModule(MODULE_PREFIX + 'semver', ClassSemver);

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
}(this.name === 'demand-loader' ? parent : this, setTimeout, clearTimeout));
