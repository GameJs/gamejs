 /*
  * Copyright (c) 2010 James Brantly
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  */

(function(globalFunctionEval) {

	var Yabble = function() {
		throw "Synchronous require() is not supported.";
	};

	Yabble.unit = {};

	var _moduleRoot = '',
		_modules,
		_callbacks,
		_fetchFunc,
		_timeoutLength = 20000,
		_mainProgram;

	var isWebWorker = this.importScripts !== undefined;


	var head = !isWebWorker && document.getElementsByTagName('head')[0];

	// Shortcut to native hasOwnProperty
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	// A for..in implementation which uses hasOwnProperty and fixes IE non-enumerable issues
	if ((function() {for (var prop in {hasOwnProperty: true}) { return prop; }})() == 'hasOwnProperty') {
		var forIn = function(obj, func, ctx) {
			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}
		};
	}
	else {
		var ieBadProps = [
	      'isPrototypeOf',
	      'hasOwnProperty',
	      'toLocaleString',
	      'toString',
	      'valueOf'
		];

		var forIn = function(obj, func, ctx) {
			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}

			for (var i = ieBadProps.length; i--;) {
				var prop = ieBadProps[i];
				if (hasOwnProperty.call(obj, prop)) {
					func.call(ctx, prop);
				}
			}
		};
	}

	// Array convenience functions
	var indexOf = function(arr, val) {
		for (var i = arr.length; i--;) {
			if (arr[i] == val) { return i; }
		}
		return -1;
	};

	var removeWhere = function(arr, func) {
		var i = 0;
		while (i < arr.length) {
			if (func.call(null, arr[i], i) === true) {
				arr.splice(i, 1);
			}
			else {
				i++;
			}
		}
	};

	var combinePaths = function(relPath, refPath) {
		var relPathParts = relPath.split('/');
		refPath = refPath || '';
		if (refPath.length && refPath.charAt(refPath.length-1) != '/') {
			refPath += '/';
		}
		var refPathParts = refPath.split('/');
		refPathParts.pop();
		var part;
		while (part = relPathParts.shift()) {
			if (part == '.') { continue; }
			else if (part == '..'
				&& refPathParts.length
				&& refPathParts[refPathParts.length-1] != '..') { refPathParts.pop(); }
			else { refPathParts.push(part); }
		}
		return refPathParts.join('/');
	};

	// Takes a relative path to a module and resolves it according to the reference path
	var resolveModuleId = Yabble.unit.resolveModuleId = function(relModuleId, refPath) {
		if (relModuleId.charAt(0) != '.') {
			return relModuleId;
		}
		else {
			return combinePaths(relModuleId, refPath);
		}
	};

	// Takes a module's ID and resolves a URI according to the module root path
	var resolveModuleUri = function(moduleId) {
		if (moduleId.charAt(0) != '.') {
			return _moduleRoot+moduleId+'.js';
		}
		else {
			return this._resolveModuleId(moduleId, _moduleRoot)+'.js';
		}
	};

	// Returns a module object from the module ID
	var getModule = function(moduleId) {
		if (!hasOwnProperty.call(_modules, moduleId)) {
			return null;
		}
		return _modules[moduleId];
	};

	// Adds a callback which is executed when all deep dependencies are loaded
	var addCallback = function(deps, cb) {
		_callbacks.push([deps.slice(0), cb]);
	};

	// Generic implementation of require.ensure() which takes a reference path to
	// use when resolving relative module IDs
	var ensureImpl = function(deps, cb, refPath) {
		var unreadyModules = [];

		for (var i = deps.length; i--;) {
			var moduleId = resolveModuleId(deps[i], refPath),
				module = getModule(moduleId);

			if (!areDeepDepsDefined(moduleId)) {
				unreadyModules.push(moduleId);
			}
		}

		if (unreadyModules.length) {
			addCallback(unreadyModules, function() {
				cb(createRequireFunc(refPath));
			});
			queueModules(unreadyModules);
		}
		else {
			setTimeout(function() {
				cb(createRequireFunc(refPath));
			}, 0);
		}
	};

	// Creates a require function that is passed into module factory functions
	// and require.ensure() callbacks. It is bound to a reference path for
	// relative require()s
	var createRequireFunc = function(refPath) {
		var require = function(relModuleId) {
			var moduleId = resolveModuleId(relModuleId, refPath),
				module = getModule(moduleId);

			if (!module) {
				throw "Module not loaded";
			}
			else if (module.error) {
				throw "Error loading module";
			}

			if (!module.exports) {
				module.exports = {};
				var moduleDir = moduleId.substring(0, moduleId.lastIndexOf('/')+1),
					injects = module.injects,
					args = [];

				for (var i = 0, n = injects.length; i<n; i++) {
					if (injects[i] == 'require') {
						args.push(createRequireFunc(moduleDir));
					}
					else if (injects[i] == 'exports') {
						args.push(module.exports);
					}
					else if (injects[i] == 'module') {
						args.push(module.module);
					}
				}

				module.factory.apply(null, args);
			}
			return module.exports;
		};

		require.ensure = function(deps, cb) {
			ensureImpl(deps, cb, refPath);
		};

		if (_mainProgram != null) {
			require.main = getModule(_mainProgram).module;
		}

		return require;
	};

	// Begins loading modules asynchronously
	var queueModules = function(moduleIds) {
		for (var i = moduleIds.length; i--;) {
			var moduleId = moduleIds[i],
				module = getModule(moduleId);

			if (module == null) {
				module = _modules[moduleId] = {};
				_fetchFunc(moduleId);
			}
		}
	};

	// Returns true if all deep dependencies are satisfied (in other words,
	// can more or less safely run the module factory function)
	var areDeepDepsDefined = function(moduleId) {
		var visitedModules = {};
		var recurse = function(moduleId) {
			if (visitedModules[moduleId] == true) { return true; }
			visitedModules[moduleId] = true;
			var module = getModule(moduleId);
			if (!module || !module.defined) { return false; }
			else {
				var deps = module.deps || [];
				for (var i = deps.length; i--;) {
					if (!recurse(deps[i])) {
						return false;
					}
				}
				return true;
			}
		};
		return recurse(moduleId);
	};

	// Checks dependency callbacks and fires as necessary
	var fireCallbacks = function() {
		var i = 0;
		while (i<_callbacks.length) {
			var deps = _callbacks[i][0],
				func = _callbacks[i][1],
				n = 0;
			while (n<deps.length) {
				if (areDeepDepsDefined(deps[n])) {
					deps.splice(n, 1);
				}
				else {
					n++;
				}
			}
			if (!deps.length) {
				_callbacks.splice(i, 1);
				if (func != null) {
					setTimeout(func, 0);
				}
			}
			else {
				i++;
			}
		}
	};

	// Load an unwrapped module using XHR and eval()
	var loadModuleByEval = _fetchFunc = function(moduleId) {
		var timeoutHandle;

		var errorFunc = function() {
			var module = getModule(moduleId);
			if (!module.defined) {
				module.defined = module.error = true;
				fireCallbacks();
			}
		};

		var xhr = this.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		var moduleUri = resolveModuleUri(moduleId);
		xhr.open('GET', moduleUri, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				clearTimeout(timeoutHandle);
				if (xhr.status == 200 || xhr.status === 0) {
					var moduleCode = xhr.responseText,
						deps = determineShallowDependencies(moduleCode),
						moduleDir = moduleId.substring(0, moduleId.lastIndexOf('/')+1),
						moduleDefs = {};
					for (var i = deps.length; i--;) {
						deps[i] = resolveModuleId(deps[i], moduleDir);
					}
					try {
						moduleDefs[moduleId] = globalFunctionEval('\r\n' + moduleCode + '\r\n');
					} catch (e) {
						if (e instanceof SyntaxError) {
							var msg = 'Syntax Error: ';
							if (e.lineNumber) {
								msg += 'line ' + (e.lineNumber - 581);
							} else {
								console.log('GameJs tip: use Firefox to see line numbers in Syntax Errors.');
							}
							msg += ' in file ' + moduleUri;
							console.log(msg);
						}
						throw e;
					}

					Yabble.define(moduleDefs, deps);
				}
				else {
					errorFunc();
				}
			}
		};

		timeoutHandle = setTimeout(errorFunc, _timeoutLength);

		xhr.send(null);
	};

	// Used by loadModuleByEval and by the packager. Determines shallow dependencies of
	// a module via static analysis. This can currently break with require.ensure().
	var determineShallowDependencies = Yabble.unit.determineShallowDependencies = function(moduleCode) {
		// TODO: account for comments
		var deps = {}, match, unique = {};

		var requireRegex = /(?:^|[^\w\$_.])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g;
		while (match = requireRegex.exec(moduleCode)) {
			var module = eval(match[1]);
			if (!hasOwnProperty.call(deps, module)) {
				deps[module] = true;
			}
		}

		var ensureRegex = /(?:^|[^\w\$_.])require.ensure\s*\(\s*(\[("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\s*|,)*\])/g;
		while (match = ensureRegex.exec(moduleCode)) {
			var moduleArray = eval(match[1]);
			for (var i = moduleArray.length; i--;) {
				var module = moduleArray[i];
				delete deps[module];
			}
		}

		var depsArray = [];
		forIn(deps, function(module) {
			depsArray.push(module);
		});

		return depsArray;
	};

	// Load a wrapped module via script tags
	var loadModuleByScript = function(moduleId) {
		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = resolveModuleUri(moduleId);

		var useStandard = !!scriptEl.addEventListener,
			timeoutHandle;

		var errorFunc = function() {
			postLoadFunc(false);
		};

		var loadFunc = function() {
			if (useStandard || (scriptEl.readyState == 'complete' || scriptEl.readyState == 'loaded')) {
				postLoadFunc(getModule(moduleId).defined);
			}
		};

		var postLoadFunc = function(loaded) {
			clearTimeout(timeoutHandle);

			if (useStandard) {
				scriptEl.removeEventListener('load', loadFunc, false);
				scriptEl.removeEventListener('error', errorFunc, false);
			}
			else {
				scriptEl.detachEvent('onreadystatechange', loadFunc);
			}

			if (!loaded) {
				var module = getModule(moduleId);
				if (!module.defined) {
					module.defined = module.error = true;
					fireCallbacks();
				}
			}
		};

		if (useStandard) {
			scriptEl.addEventListener('load', loadFunc, false);
			scriptEl.addEventListener('error', errorFunc, false);
		}
		else {
			scriptEl.attachEvent('onreadystatechange', loadFunc);
		}

		timeoutHandle = setTimeout(errorFunc, _timeoutLength);

		head.appendChild(scriptEl);
	};

	var normalizeTransport = function() {
		var transport = {modules: []};
		var standardInjects = ['require', 'exports', 'module'];
		if (typeof arguments[0] == 'object') { // Transport/D
			transport.deps = arguments[1] || [];
			var moduleDefs = arguments[0];
			forIn(moduleDefs, function(moduleId) {
				var module = {
					id: moduleId
				};

				if (typeof moduleDefs[moduleId] == 'function') {
					module.factory = moduleDefs[moduleId];
					module.injects = standardInjects;
				}
				else {
					module.factory = moduleDefs[moduleId].factory;
					module.injects = moduleDefs[moduleId].injects || standardInjects;
				}
				transport.modules.push(module);
			});
		}
		else { // Transport/C
			transport.deps = arguments[1].slice(0);
			removeWhere(transport.deps, function(dep) {
				return indexOf(standardInjects, dep) >= 0;
			});

			transport.modules.push({
				id: arguments[0],
				factory: arguments[2],
				injects: arguments[1]
			});
		}
		return transport;
	};

	// Set the uri which forms the conceptual module namespace root
	Yabble.setModuleRoot = function(path) {
		if (this.window && !(/^http(s?):\/\//.test(path))) {
			var href = window.location.href;
			href = href.substr(0, href.lastIndexOf('/')+1);
			path = combinePaths(path, href);
		}

		if (path.length && path.charAt(path.length-1) != '/') {
			path += '/';
		}

		_moduleRoot = path;
	};
	Yabble.getModuleRoot = function() {
	   return _moduleRoot;
	}
	// Set a timeout period for async module loading
	Yabble.setTimeoutLength = function(milliseconds) {
		_timeoutLength = milliseconds;
	};

	// Use script tags with wrapped code instead of XHR+eval()
	Yabble.useScriptTags = function() {
		_fetchFunc = loadModuleByScript;
	};

	// Define a module per various transport specifications
	Yabble.def = Yabble.define = function() {
		var transport = normalizeTransport.apply(null, arguments);

		var unreadyModules = [],
			definedModules = [];

		var deps = transport.deps;

		for (var i = transport.modules.length; i--;) {
			var moduleDef = transport.modules[i],
				moduleId = moduleDef.id,
				module = getModule(moduleId);

			if (!module) {
				module = _modules[moduleId] = {};
			}
			module.module = {
				id: moduleId,
				uri: resolveModuleUri(moduleId)
			};

			module.defined = true;
			module.deps = deps.slice(0);
			module.injects = moduleDef.injects;
			module.factory = moduleDef.factory;
			definedModules.push(module);
		}

		for (var i = deps.length; i--;) {
			var moduleId = deps[i],
				module = getModule(moduleId);

			if (!module || !areDeepDepsDefined(moduleId)) {
				unreadyModules.push(moduleId);
			}
		}

		if (unreadyModules.length) {
			setTimeout(function() {
				queueModules(unreadyModules);
			}, 0);
		}

		fireCallbacks();
	};

	Yabble.isKnown = function(moduleId) {
		return getModule(moduleId) != null;
	};

	Yabble.isDefined = function(moduleId) {
		var module = getModule(moduleId);
		return !!(module && module.defined);
	};

	// Do an async lazy-load of modules
	Yabble.ensure = function(deps, cb) {
		ensureImpl(deps, cb, '');
	};

	// Start an application via a main program module
	Yabble.run = function(program, cb) {
		program = _mainProgram = resolveModuleId(program, '');
		Yabble.ensure([program], function(require) {
			require(program);
			if (cb != null) { cb(); }
		});
	};

	// Reset internal state. Used mostly for unit tests.
	Yabble.reset = function() {
		_mainProgram = null;
		_modules = {};
		_callbacks = [];

		// Built-in system module
		Yabble.define({
			'system': function(require, exports, module) {}
		});
	};

	Yabble.reset();

	// Export to the require global
	if (isWebWorker) {
		self.require = Yabble;
	} else {
		window.require = Yabble;
	}
})(function(code) {
   with (this.importScripts ? self : window) {
      return (new Function('require', 'exports', 'module', code));
   };
});
