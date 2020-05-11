/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var DEMAND_ID               = 'demand',
	PROVIDE_ID              = 'provide',
	PATH_ID                 = 'path',
	EXPORTS_ID              = 'exports',
	MODULE_PREFIX           = '/' + DEMAND_ID + '/',
	MODULE_PREFIX_ABSTRACT  = MODULE_PREFIX + 'abstract/',
	MODULE_PREFIX_HANDLER   = MODULE_PREFIX + 'handler/',
	MODULE_PREFIX_PLUGIN    = MODULE_PREFIX + 'plugin/',
	MODULE_PREFIX_FUNCTION  = MODULE_PREFIX + 'function/',
	MODULE_PREFIX_VALIDATOR = MODULE_PREFIX + 'validator/',
	MOCK_PREFIX             = 'mock:',
	NULL                    = null,
	UNDEFINED               = undefined,
	FALSE                   = false,
	TRUE                    = true,
	STRING_UNDEFINED        = 'undefined',
	STRING_STRING           = 'string',
	STRING_BOOLEAN          = 'boolean',
	STRING_OBJECT           = 'object',
	STRING_FUNCTION         = 'function',
	STRING_NUMBER           = 'number',
	EVENT_PREFIX            = 'pre',
	EVENT_POSTFIX           = 'post',
	EVENT_CONFIGURE         = 'Configure',
	EVENT_PRE_CONFIGURE     = EVENT_PREFIX + EVENT_CONFIGURE,
	EVENT_POST_CONFIGURE    = EVENT_POSTFIX + EVENT_CONFIGURE,
	EVENT_CACHE             = 'cache',
	EVENT_CACHE_MISS        = EVENT_CACHE + 'Miss',
	EVENT_CACHE_HIT         = EVENT_CACHE + 'Hit',
	EVENT_CACHE_CLEAR       = EVENT_CACHE + 'Clear',
	EVENT_CACHE_EXCEED      = EVENT_CACHE + 'Exceed',
	EVENT_PRE_CACHE         = EVENT_PREFIX + 'Cache',
	EVENT_POST_CACHE        = EVENT_POSTFIX + 'Cache',
	EVENT_RESOLVE           = 'Resolve',
	EVENT_PRE_RESOLVE       = EVENT_PREFIX + EVENT_RESOLVE,
	EVENT_POST_RESOLVE      = EVENT_POSTFIX + EVENT_RESOLVE,
	EVENT_REQUEST           = 'Request',
	EVENT_PRE_REQUEST       = EVENT_PREFIX + EVENT_REQUEST,
	EVENT_POST_REQUEST      = EVENT_POSTFIX + EVENT_REQUEST,
	EVENT_PROCESS           = 'Process',
	EVENT_PRE_PROCESS       = EVENT_PREFIX + EVENT_PROCESS,
	EVENT_POST_PROCESS      = EVENT_POSTFIX + EVENT_PROCESS,
	EVENT_QUEUE             = 'queue',
	EVENT_QUEUE_ENQUEUE     = EVENT_QUEUE + 'Enqueue',
	EVENT_QUEUE_DEQUEUE     = EVENT_QUEUE + 'Dequeue',
	EVENT_PROVIDE           = 'provide',
	EVENT_REJECT            = 'reject',
	ERROR_LOAD              = 'error loading',
	ERROR_PROVIDE           = 'error providing',
	ERROR_RESOLVE           = 'error resolving',
	ERROR_PROVIDE_ANONYMOUS = 'unspecified anonymous provide',
	ERROR_UNHANDLED_PLEDGE_REJECTION = 'unhandled pledge rejection';
