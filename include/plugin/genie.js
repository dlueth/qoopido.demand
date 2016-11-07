/**
 * /demand/plugin/genie
 */
(function() {
	var path = MODULE_PREFIX_PLUGIN + 'genie';
	
	function definition() {
		var pattern = [];
		
		function onPostConfigure(options) {
			if(isObject(options)) {
				pattern.length = 0;
				
				iterate(options, function(property, value) {
					pattern.push({ prefix: property, weight: property.length, fn: value });
				});
			}
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);
		
		function matchPattern(path) {
			var i = 0, pointer, match;
			
			for(; (pointer = pattern[i]); i++) {
				if(path.indexOf(pointer.prefix) === 0 && (!match || pointer.weight > match.weight)) {
					match = pointer;
				}
			}
			
			return match;
		}
		
		function generateHash(value){
			var hash = 5381,
				i    = value.length;
			
			while(i) {
				hash = (hash * 33) ^ value.charCodeAt(--i);
			}
			
			return hash >>> 0;
		}
		
		function generateConfiguration(bundle) {
			var matches       = bundle.matches,
				configuration = { pattern: {}, modules: { '/demand/handler/bundle': {} } },
				i = 0, pointer, dependency;
			
			configuration.pattern[bundle.id]                           = bundle.fn(matches);
			configuration.modules['/demand/handler/bundle'][bundle.id] = pointer = [];
			
			for(; (dependency = matches[i]); i++) {
				pointer.push(dependency.id);
			}
			
			return configuration;
		}
		
		function getModule(path) {
			return (registry[path] && registry[path].pledge) || (mocks[path] && mocks[path].pledge);
		}
		
		function resolveDependencies() {
			var i = 0, dependency;
			
			for(; (dependency = this[i]); i++) {
				dependency.dfd.resolve(arguments[i]);
			}
		}
		
		function rejectDependencies() {
			var i = 0, dependency;
			
			for(; (dependency = this[i]); i++) {
				dependency.dfd.reject(new Failure('error resolving', dependency.path));
			}
		}
		
		demand.on('preResolve', function(dependencies, context) {
			var bundles = {},
				i, dependency, id, parameter, pattern, matches;
			
			for(i = 0; (dependency = dependencies[i]); i++) {
				if(isTypeOf(dependency, 'string')) {
					id = resolvePath(dependency, context);
					
					if(!getModule(id) && (parameter = resolveParameter(dependency, context)) && parameter.handler === 'module' && (pattern = matchPattern(id))) {
						(bundles[pattern.prefix] || (bundles[pattern.prefix] = { fn: pattern.fn, matches: [] })).matches.push({ id: id, path: dependency, index: i, dfd: NULL });
					}
				}
			}
			
			iterate(bundles, function(property, value) {
				matches = value.matches;
				
				if(matches.length > 1) {
					value.id = '/genie/' + generateHash(JSON.stringify(value.matches));
					
					for(i = 0; (dependency = matches[i]); i++) {
						dependency.dfd                 = Pledge.defer();
						dependencies[dependency.index] = dependency.dfd.pledge;
						
						mockModules(dependency.id);
					}
					
					demand.configure(generateConfiguration(value));
					demand('bundle!' + value.id)
						.then(
							resolveDependencies.bind(matches),
							rejectDependencies.bind(matches)
						);
				}
			});
		});
		
		return true;
	}
	
	provide(path, definition);
}());