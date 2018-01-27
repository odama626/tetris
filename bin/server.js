/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "2343d6eac3f8643e7636"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/components/404/404.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
exports.default = () => React.createElement("div", null, "404 - Page not found");

/***/ }),

/***/ "./assets/components/Canvas/Canvas.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const CanvasController_1 = __webpack_require__("./assets/components/Canvas/CanvasController.ts");
class Canvas extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    render() {
        const _a = this.props,
              { setController, mountController, width, height, style, scale = 20 } = _a,
              rest = __rest(_a, ["setController", "mountController", "width", "height", "style", "scale"]);
        return React.createElement("canvas", Object.assign({ ref: canvas => {
                if (!canvas) return;
                let controller;
                if (!mountController) {
                    controller = new CanvasController_1.default(canvas);
                    controller.init(width, height, scale);
                } else {
                    controller = mountController;
                    controller.mountCanvas(canvas);
                }
                controller.setStyle(style);
                setController(controller);
            }, width: width, height: height }, rest));
    }
}
exports.default = Canvas;

/***/ }),

/***/ "./assets/components/Canvas/CanvasController.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__("./assets/components/Canvas/Matrix.ts");
const Utils_1 = __webpack_require__("./assets/utils/Utils.ts");
class CanvasController {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    mountCanvas(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.scale(this.scale, this.scale);
        if (this.style) {
            this.setStyle(this.style);
        }
    }
    init(width, height, scale = 20) {
        this.scale = scale;
        this.width = width;
        this.height = height;
        this.matrix = Matrix_1.default.create(width / scale, height / scale);
        this.context.scale(scale, scale);
    }
    /// Graphical functions
    setStyle(style) {
        this.style = style;
        Object.keys(style.canvas).forEach(key => this.context[key] = style.canvas[key]);
    }
    custom(callback) {
        this.context.save();
        callback(this.context);
        this.context.restore();
    }
    write(text, pos = [0, 1.5], font = '1.5px Arial', color = 'white') {
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, ...pos);
    }
    defaultDrawOp(context, x, y, color) {
        context.fillStyle = color;
        context.fillRect(x, y, 1, 1);
    }
    draw(matrix = this.matrix, pos, op = this.defaultDrawOp) {
        if (!matrix) return;
        if (matrix === this.matrix) {
            pos = { x: 0, y: 0 };
        }
        pos = pos || this.getMiddleFor(matrix);
        return Utils_1.for2dTruthy(matrix, (x, y) => {
            if (matrix[y][x] !== 0) {
                op(this.context, pos.x + x, pos.y + y, this.style.colorTable[matrix[y][x]]);
            }
        });
    }
    drawShadow(matrix, pos, drawOp) {
        let shadowPos = Object.assign({}, pos);
        while (!this.isCollision(matrix, shadowPos)) {
            shadowPos.y++;
        }
        shadowPos.y--;
        this.draw(matrix, shadowPos, drawOp);
    }
    clear() {
        this.context.fillStyle = this.style.clearColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /// Logical Functions
    merge(tetrimino, pos) {
        return Utils_1.for2dTruthy(tetrimino, (w, h) => {
            if (tetrimino[h][w] !== 0) {
                this.matrix[h + pos.y][w + pos.x] = tetrimino[h][w];
            }
        });
    }
    clearMatrix() {
        for (let h = 0; h < this.matrix.length; h++) {
            this.matrix[h].fill(0);
        }
    }
    isCollision(tetrimino, pos) {
        return Utils_1.for2dTruthy(tetrimino, (x, y) => {
            return tetrimino[y][x] !== 0 && (this.matrix[y + pos.y] && this.matrix[y + pos.y][x + pos.x]) !== 0;
        });
    }
    sweep() {
        let modifier = 0;
        this.matrix = this.matrix.reduce((newMatrix, row) => {
            let rowFull = row.indexOf(0) === -1;
            if (rowFull) modifier++;
            return rowFull ? [row.fill(0), ...newMatrix] : [...newMatrix, row];
        }, []);
        return modifier;
    }
    getMiddleFor(matrix) {
        return {
            x: this.matrix[0].length / 2 - matrix[0].length / 2 | 0,
            y: this.matrix.length / 2 - matrix.length / 2 | 0
        };
    }
    getMatrix() {
        return [...this.matrix];
    }
}
exports.default = CanvasController;

/***/ }),

/***/ "./assets/components/Canvas/Matrix.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
class Matrix {
    static create(width, height) {
        let matrix = [];
        while (height--) {
            matrix.push(new Array(width).fill(0));
        }
        return matrix;
    }
    static rotate(matrix, direction) {
        let y, x;
        for (y = 0; y < matrix.length; y++) {
            for (x = 0; x < y; x++) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (direction > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
        return matrix;
    }
}
exports.default = Matrix;

/***/ }),

/***/ "./assets/components/Canvas/Tetriminos.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.TETRIMINOS = 'TOILJSZ';
exports.default = () => createTetrimino(exports.TETRIMINOS[exports.TETRIMINOS.length * Math.random() | 0]);
function createTetrimino(type) {
    if (type === 'T') {
        return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
    } else if (type === 'O') {
        return [[2, 2], [2, 2]];
    } else if (type === 'S') {
        return [[0, 0, 0], [0, 3, 3], [3, 3, 0]];
    } else if (type === 'Z') {
        return [[0, 0, 0], [4, 4, 0], [0, 4, 4]];
    } else if (type === 'L') {
        return [[0, 5, 0], [0, 5, 0], [0, 5, 5]];
    } else if (type === 'J') {
        return [[0, 6, 0], [0, 6, 0], [6, 6, 0]];
    } else if (type === 'I') {}
    return [[0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0]];
}
exports.createTetrimino = createTetrimino;
exports.PreviewMatrix = [[7, 5, 5, 5], [7, 5, 2, 2], [7, 0, 2, 2], [7, 0, 0, 4], [1, 0, 4, 4], [1, 1, 4, 6], [1, 6, 6, 6]];
/**
 * Colors T, O, S, Z, L, J, I
 */
exports.arraysAreEqual = (a, b) => {
    return a.length === b.length && a.reduce((acc, cur, i) => acc && cur === b[i], true);
};
exports.COLORTABLE = {
    vadim: [null, 'brown', '#000080', 'darkgreen', 'teal', 'purple', 'silver', 'maroon'],
    ms: [null, 'silver', 'cyan', 'blue', 'green', 'yellow', 'magenta', 'red'],
    sega: [null, 'cyan', 'yellow', 'magenta', 'green', 'orange', 'blue', 'red'],
    soviet: [null, 'olive', 'blue', 'green', 'cyan', 'magenta', 'orange', 'red'],
    rainbow: [null, 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'magenta'],
    tigrana: [null, '#00AF87', '#5FAFD7', '#D787AF', '#D75F5F', '#FF875F', '#A8A8A8', '#8787D7']
};

/***/ }),

/***/ "./assets/components/EventLoopReducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
class Actions {
    static start(draw) {
        return (dispatch, getState) => {
            dispatch({ type: Actions.START, draw });
            loop(dispatch, getState);
        };
    }
    static pause() {
        return { type: Actions.PAUSE };
    }
    static update(delta, now) {
        return {
            type: Actions.UPDATE,
            delta,
            now
        };
    }
    static stop() {
        return { type: Actions.STOP };
    }
}
Actions.START = 'EVENT_LOOP_START';
Actions.STOP = 'EVENT_LOOP_STOP';
Actions.PAUSE = 'EVENT_LOOP_PAUSE';
Actions.RESUME = 'EVENT_LOOP_RESUME';
Actions.UPDATE = 'EVENT_LOOP_UPDATE';
exports.Actions = Actions;
const loop = (dispatch, getState) => {
    const { lastTick, paused, active, tickRate, draw } = getState().EventLoop;
    if (paused || !active) return;
    let now = Date.now();
    let delta = now - lastTick;
    if (delta > 10) {
        dispatch(Actions.update(delta, now));
    }
    window.requestAnimationFrame(() => loop(dispatch, getState));
    draw();
};
const initialTick = Date.now();
const initialState = {
    lastTick: initialTick,
    paused: true,
    active: false,
    draw: _ => _,
    timerHandle: null
};
exports.default = (state = initialState, _a) => {
    var { type } = _a,
        actions = __rest(_a, ["type"]);
    switch (type) {
        case Actions.START:
            return Object.assign({}, state, actions, { paused: false, active: true });
        case Actions.UPDATE:
            return Object.assign({}, state, { lastTick: actions.now });
        case Actions.STOP:
            return Object.assign({}, state, { paused: false, active: false });
        case Actions.PAUSE:
            return Object.assign({}, state, { paused: true });
    }
    return state;
};

/***/ }),

/***/ "./assets/components/GameBoard/Actions.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_CONTROLLER = 'GAMEBOARD_SET_CONTROLLER';
exports.SET_ARENA_CONTROLLER = 'GAMEBOARD_SET_ARENA_CONTROLLER';
exports.GAME_OVER = 'GAMEBOARD_GAME_OVER';
exports.SET_COLORTABLE = 'PREFERENCES_SET_COLORTABLE';
exports.DROP = 'INPUT_ACTION_DROP';
exports.HARD_DROP = 'INPUT_ACTION_HARD_DROP';
exports.SWAP_HOLD = 'INPUT_ACTION_SWAP_HOLD';
exports.MOVE_RIGHT = 'INPUT_ACTION_MOVE_RIGHT';
exports.MOVE_LEFT = 'INPUT_ACTION_MOVE_LEFT';
exports.ROTATE_CLOCKWISE = 'INPUT_ACTION_ROTATE_CLOCKWISE';
exports.ROTATE_COUNTER_CLOCKWISE = 'INPUT_ACTION_ROTATE_COUNTER_CLOCKWISE';
exports.PAUSE = 'INPUT_ACTION_PAUSE';
class InputActions {}
InputActions.drop = () => ({ type: exports.DROP });
InputActions.hardDrop = () => ({ type: exports.HARD_DROP });
InputActions.moveRight = () => ({ type: exports.MOVE_RIGHT });
InputActions.moveLeft = () => ({ type: exports.MOVE_LEFT });
InputActions.swapHold = () => ({ type: exports.SWAP_HOLD });
InputActions.rotate = () => ({ type: exports.ROTATE_CLOCKWISE });
InputActions.rotateReverse = () => ({ type: exports.ROTATE_COUNTER_CLOCKWISE });
InputActions.pause = () => ({ type: exports.PAUSE });
exports.InputActions = InputActions;
exports.setController = (canvas, controller) => ({
    type: exports.SET_CONTROLLER,
    canvas,
    controller
});
exports.setArenaController = (canvas, controller) => ({
    type: exports.SET_ARENA_CONTROLLER,
    canvas,
    controller
});
exports.setColorTable = colorTable => ({
    type: exports.SET_COLORTABLE,
    colorTable
});
exports.gameOver = () => ({ type: exports.GAME_OVER, saveLocally: ['GameBoard', 'score'] });

/***/ }),

/***/ "./assets/components/GameBoard/GameBoard.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"container":"GameBoard__container__2WYjT"};

/***/ }),

/***/ "./assets/components/GameBoard/GameBoard.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const Canvas_1 = __webpack_require__("./assets/components/Canvas/Canvas.tsx");
const react_redux_1 = __webpack_require__("react-redux");
const sass = __webpack_require__("./assets/components/GameBoard/GameBoard.scss");
const Actions = __webpack_require__("./assets/components/GameBoard/Actions.ts");
const EventLoopReducer_1 = __webpack_require__("./assets/components/EventLoopReducer.ts");
const Utils_1 = __webpack_require__("./assets/utils/Utils.ts");
class GameBoard extends React.Component {
    constructor() {
        super(...arguments);
        this.importantPropsMatch = Utils_1.compareWith('arena', 'gameInProgress', 'score', 'tetriminos', 'gameOver');
    }
    componentDidMount() {
        setTimeout(() => this.props.dispatch(EventLoopReducer_1.Actions.start(this.draw.bind(this))), 0);
    }
    componentWillUnmount() {
        this.props.dispatch(EventLoopReducer_1.Actions.pause());
    }
    shouldComponentUpdate(nextProps) {
        return !this.importantPropsMatch(this.props, nextProps);
    }
    componentDidUpdate() {
        if (this.props.gameOver) {
            this.props.dispatch(EventLoopReducer_1.Actions.stop());
            this.props.dispatch(Actions.gameOver());
        }
    }
    draw() {
        const { pos, arena, tetriminos: { current, next, hold } } = this.props;
        const { next: nextController, hold: holdController } = this.props.canvasControllers;
        const { canvasStyle: { drawShadow } } = this.props.preferences;
        arena.clear();
        if (drawShadow) {
            arena.drawShadow(current, pos, (context, x, y, color) => {
                context.fillStyle = color;
                context.globalAlpha = 0.2;
                context.fillRect(x, y, 1, 1);
                context.globalAlpha = 1;
                context.strokeStyle = color;
                context.lineWidth = 0.03;
                context.strokeRect(x, y, 1, 1);
            });
        }
        arena.draw(current, pos);
        arena.draw();
        nextController.clear();
        nextController.draw(next);
        nextController.write('Next');
        holdController.clear();
        holdController.draw(hold);
        holdController.write('Hold');
    }
    render() {
        const { dispatch, score, arena, canvasControllers } = this.props;
        const { canvasStyle } = this.props.preferences;
        return React.createElement("div", { className: sass.container }, React.createElement("div", null, React.createElement(Canvas_1.default, { style: canvasStyle, width: 70, height: 70, scale: 10, mountController: canvasControllers.next, setController: controller => dispatch(Actions.setController('next', controller)) }), React.createElement(Canvas_1.default, { style: canvasStyle, width: 70, height: 70, scale: 10, mountController: canvasControllers.hold, setController: controller => dispatch(Actions.setController('hold', controller)) })), React.createElement("div", null, React.createElement(Canvas_1.default, { style: canvasStyle, width: 200, height: 400, mountController: arena, setController: controller => dispatch(Actions.setArenaController('arena', controller)) })));
    }
}
exports.default = react_redux_1.connect(state => Object.assign({}, state.GameBoard, { preferences: state.Preferences }))(GameBoard);

/***/ }),

/***/ "./assets/components/GameBoard/Reducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Tetriminos_1 = __webpack_require__("./assets/components/Canvas/Tetriminos.ts");
const Actions = __webpack_require__("./assets/components/GameBoard/Actions.ts");
const EventLoopReducer_1 = __webpack_require__("./assets/components/EventLoopReducer.ts");
const UpdateLogic_1 = __webpack_require__("./assets/components/GameBoard/UpdateLogic.ts");
exports.initialState = () => ({
    lastTick: 0,
    tickRate: 1000,
    arena: null,
    canvasControllers: {
        hold: null,
        next: null
    },
    gameInProgress: true,
    gameOver: false,
    pos: { x: 0, y: 0 },
    allowSwap: true,
    lastLines: 0,
    tetriminos: {
        next: Tetriminos_1.default(),
        current: Tetriminos_1.default(),
        hold: null
    },
    tetriminoJustGenerated: false,
    score: { best: 0, current: 0, last: 0 }
});
exports.default = (state = exports.initialState(), action) => {
    switch (action.type) {
        case Actions.SET_ARENA_CONTROLLER:
            return Object.assign({}, state, { [action.canvas]: action.controller, pos: {
                    x: action.controller.getMiddleFor(state.tetriminos.current).x,
                    y: 0
                } });
        case Actions.SET_CONTROLLER:
            return UpdateLogic_1.addCanvasController(state, action);
        case EventLoopReducer_1.Actions.UPDATE:
            return UpdateLogic_1.update(Object.assign({}, state, { now: action.now, delta: action.now - state.lastTick, tetriminoJustGenerated: false }));
        case Actions.DROP:
            let now = Date.now();
            return UpdateLogic_1.drop(Object.assign({}, state, { now, delta: now - state.lastTick }));
        case Actions.HARD_DROP:
            return UpdateLogic_1.hardDrop(state);
        case Actions.MOVE_LEFT:
            return UpdateLogic_1.move(state, -1);
        case Actions.MOVE_RIGHT:
            return UpdateLogic_1.move(state, 1);
        // Handle input
        case Actions.ROTATE_CLOCKWISE:
            return UpdateLogic_1.rotate(state, -1);
        case Actions.ROTATE_COUNTER_CLOCKWISE:
            return UpdateLogic_1.rotate(state, 1);
        case Actions.SWAP_HOLD:
            return UpdateLogic_1.swapHold(state);
        case Actions.GAME_OVER:
            return UpdateLogic_1.cleanupBoard(state);
        // TODO updated best score, reset game state
        case Actions.SET_COLORTABLE:
    }
    return state;
};

/***/ }),

/***/ "./assets/components/GameBoard/UpdateLogic.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tetriminos_1 = __webpack_require__("./assets/components/Canvas/Tetriminos.ts");
const Matrix_1 = __webpack_require__("./assets/components/Canvas/Matrix.ts");
const Reducer_1 = __webpack_require__("./assets/components/GameBoard/Reducer.ts");
const scoreModifier = [0, 40, 100, 300, 1200];
const nextTetrimino = ({ next, current }) => ({
    current: next,
    next: Tetriminos_1.default()
});
exports.cleanupBoard = _a => {
    var { score: { best, current, last }, arena, canvasControllers } = _a,
        state = __rest(_a, ["score", "arena", "canvasControllers"]);
    arena.clearMatrix();
    return Object.assign({}, Reducer_1.initialState(), { arena,
        canvasControllers, score: {
            last: current,
            best: current > best ? current : best,
            current: 0
        } });
};
exports.addCanvasController = (_a, { canvas, controller }) => {
    var { canvasControllers } = _a,
        state = __rest(_a, ["canvasControllers"]);
    return Object.assign({}, state, { canvasControllers: Object.assign({}, canvasControllers, { [canvas]: controller }) });
};
const updateScore = ({ current, best }, linesCleared, lastLines) => {
    current += scoreModifier[linesCleared] * (lastLines === 4 ? 100 : 1);
    return { current, best };
};
exports.update = state => state.delta - state.tickRate > 0 ? exports.drop(state) : state;
exports.rotate = (state, direction) => {
    let offset = 1,
        tetrimino = [...state.tetriminos.current];
    let { pos } = state;
    const { arena } = state;
    Matrix_1.default.rotate(tetrimino, direction);
    while (arena.isCollision(tetrimino, pos)) {
        pos.x += offset;
        offset = -(offset > 0 ? offset + 1 : offset - 1);
        if (offset > tetrimino[0].length) {
            pos.x = pos;
            return exports.rotate(Object.assign({}, state, { pos, tetriminos: Object.assign({}, state.tetriminos, { current: tetrimino }) }), -direction);
        }
    }
    return Object.assign({}, state, { pos, tetriminos: Object.assign({}, state.tetriminos, { current: tetrimino }) });
};
exports.move = (state, move) => {
    const { arena, pos: { x, y }, tetriminos: { current } } = state;
    return arena.isCollision(current, { x: x + move, y }) ? state : Object.assign({}, state, { pos: { x: x + move, y } });
};
exports.swapHold = state => {
    if (!state.allowSwap) return state;
    const { hold, current, next } = state.tetriminos;
    return Object.assign({}, state, { allowSwap: false, tetriminos: {
            current: hold || next,
            next: hold ? next : Tetriminos_1.default(),
            hold: current
        } });
};
exports.hardDrop = state => {
    let nextState = state;
    while (!nextState.tetriminoJustGenerated) {
        nextState = exports.drop(nextState);
    }
    return nextState;
};
exports.drop = state => {
    const { tetriminos, arena, now } = state;
    let { pos: { x, y }, score, lastLines } = state;
    y++;
    // If there isn't a collision we're done
    if (!arena.isCollision(tetriminos.current, { x, y })) {
        return Object.assign({}, state, { pos: { x, y }, lastTick: now, tetriminoJustGenerated: false });
    }
    y--;
    arena.merge(tetriminos.current, { x, y });
    let linesCleared = arena.sweep();
    let nextMinos = Object.assign({}, tetriminos, nextTetrimino(tetriminos));
    let pos = { x: arena.getMiddleFor(nextMinos.current).x, y: 0 };
    let gameOver = arena.isCollision(nextMinos.current, pos);
    if (gameOver) console.error('Game Over');
    return Object.assign({}, state, { lastTick: now, score: Object.assign({}, score, updateScore(score, linesCleared, lastLines)), allowSwap: true, tetriminos: nextMinos, pos,
        gameOver, tetriminoJustGenerated: true, gameInProgress: !gameOver });
};

/***/ }),

/***/ "./assets/components/Header/Header.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"spacer":"Header__spacer__1y7B5","lowerSpacer":"Header__lowerSpacer__1cspI","navItem":"Header__navItem__2gjN8","navSubItem":"Header__navSubItem__11loM","container":"Header__container__2Ypgr","lowerContainer":"Header__lowerContainer__2zAV5","brandName":"Header__brandName__2zGMU","leftContainer":"Header__leftContainer__32s-O","leftClosed":"Header__leftClosed__3mc3Y","leftOpen":"Header__leftOpen__4fsRJ","rightContainer":"Header__rightContainer__8j6KC","phoneNumber":"Header__phoneNumber___YX8_","hamburger":"Header__hamburger__Zwus2","hamBar":"Header__hamBar__3Z1fC","location":"Header__location__22LrL","userStatus":"Header__userStatus__1toNo"};

/***/ }),

/***/ "./assets/components/Header/Header.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const react_router_dom_1 = __webpack_require__("react-router-dom");
const react_redux_1 = __webpack_require__("react-redux");
// import { Container, Image, Button } from 'web-components';
// import DropDown from './HeaderDropDown';
const style = __webpack_require__("./assets/components/Header/Header.scss");
// const links = [
//   ['Browse', '/browse'],
//   ['Locations', '/locations'],
//   ['Blog', '/blog'],
//   ['About', '/about'],
//   ['Shop', '/shop'],
//   ['Contact', '/contact']
// ]
class Header extends React.Component {
    // renderMobilePanel() {
    //   const { trayOpen } = this.props;
    //   return (
    //     <div className={`${style.leftContainer} ${trayOpen? style.leftOpen : style.leftClosed}`}>
    //       { links.map(([text, link], i) => <Link key={i} to={link} className={style.navItem}>{text.toUpperCase()}</Link>)}
    //     </div>
    //   )
    // }
    render() {
        const { trayOpen, bounds, dispatch, hideMobile = false, hideLinks = false, score } = this.props;
        if (bounds.mobile && hideMobile) {
            return null;
        }
        let scoreDisplay = '';
        if (score.current < score.best) {
            scoreDisplay = `Score ${score.current} Best ${score.best}`;
        } else {
            scoreDisplay = `Best ${score.current}`;
        }
        return React.createElement("div", null, React.createElement("div", { id: "headerContainer", className: style.container }, React.createElement("div", { className: style.leftContainer }, React.createElement("div", null, scoreDisplay)), React.createElement("div", { className: style.rightContainer }, React.createElement(react_router_dom_1.Link, { className: style.navItem, to: "/preferences" }, "Preferences"))), React.createElement("div", { className: style.spacer }));
    }
}
exports.default = react_redux_1.connect(state => Object.assign({}, state.Header, { bounds: state.bounds, score: state.GameBoard.score }))(Header);

/***/ }),

/***/ "./assets/components/Header/Reducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
class Actions {
    static openMenu(openMenu) {
        return {
            type: Actions.OPEN_MENU,
            openMenu
        };
    }
    static toggleTray() {
        return {
            type: Actions.TOGGLE_TRAY
        };
    }
}
Actions.OPEN_MENU = "HEADER_OPEN_MENU";
Actions.TOGGLE_TRAY = 'HEADER_TOGGLE_TRAY';
exports.Actions = Actions;
const initialState = {
    openMenu: 'none',
    trayOpen: false,
    hideLinks: false,
    hideMobile: false,
    hideLinksAt: ['/login'],
    hideMobileAt: ['/login']
};
const hide = (list, pathname) => list && list.indexOf(pathname) > 0;
exports.default = (state = initialState, action) => {
    switch (action.type) {
        case Actions.OPEN_MENU:
            return Object.assign({}, state, { openMenu: state.openMenu !== action.openMenu ? action.openMenu : 'none' });
        case Actions.TOGGLE_TRAY:
            return Object.assign({}, state, { trayOpen: !state.trayOpen });
    }
    if (action.type.indexOf('@@router') === 0) {
        return Object.assign({}, state, { hideMobile: hide(state.hideMobileAt, action.payload.pathname), hideLinks: hide(state.hideLinksAt, action.payload.pathname) });
    }
    return state;
};

/***/ }),

/***/ "./assets/components/Home/Home.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const react_redux_1 = __webpack_require__("react-redux");
const GameBoard_1 = __webpack_require__("./assets/components/GameBoard/GameBoard.tsx");
exports.default = react_redux_1.connect(state => Object.assign({}, state.Home))(() => React.createElement("div", null, React.createElement(GameBoard_1.default, null)));

/***/ }),

/***/ "./assets/components/Home/Reducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const initialState = {};
exports.default = (state = initialState, action) => {
    return state;
};

/***/ }),

/***/ "./assets/components/Login/Actions.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// import { Auth } from '../../utils/Api';

Object.defineProperty(exports, "__esModule", { value: true });
class Actions {
    static login(username, password) {
        let t = Actions.LOGIN;
        // return Auth.Login([ t.PENDING, t.SUCCESS, t.ERROR], {username, password});
    }
    static changeUsername(username) {
        return {
            type: Actions.UPDATE.USERNAME,
            data: username
        };
    }
    static SwitchToRegisterMenu() {
        return {
            type: Actions.MODE.REGISTER
        };
    }
    static SwitchToSignInMenu() {
        return {
            type: Actions.MODE.LOGIN
        };
    }
}
Actions.LOGIN = {
    PENDING: `LOGIN_PENDING`,
    SUCCESS: `LOGIN_SUCCESS`,
    ERROR: `LOGIN_ERROR`
};
Actions.UPDATE = {
    USERNAME: 'LOGIN_UPDATE_USERNAME',
    PASSWORD: 'LOGIN_UPDATE_PASSWORD',
    FIRSTNAME: 'REGISTER_UPDATE_FIRSTNAME',
    LASTNAME: 'REGISTER_UPDATE_LASTNAME',
    PHONE: 'REGISTER_UPDATE_PHONE',
    EMAIL: 'REGISTER_UPDATE_EMAIL'
};
Actions.MODE = {
    LOGIN: 'LOGIN_MODE_LOGIN',
    REGISTER: 'LOGIN_MODE_REGISTER'
};
Actions.REGISTER = {
    FIRSTNAME: 'REGISTER_FIRSTNAME',
    LASTNAME: 'REGISTER_LASTNAME',
    PHONE: 'REGISTER_PHONE',
    EMAIL: 'REGISTER_EMAIL'
};
exports.default = Actions;

/***/ }),

/***/ "./assets/components/Login/Reducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Actions_1 = __webpack_require__("./assets/components/Login/Actions.ts");
const initialState = {
    username: '',
    register: false,
    login: false
};
function default_1(state = initialState, action) {
    switch (action.type) {
        case Actions_1.default.UPDATE.USERNAME:
            return Object.assign({}, state, { username: action.data });
        case Actions_1.default.MODE.REGISTER:
            return Object.assign({}, state, { register: true });
        case Actions_1.default.MODE.LOGIN:
            return Object.assign({}, state, { register: false });
    }
    return state;
}
exports.default = default_1;

/***/ }),

/***/ "./assets/components/Main.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const react_router_dom_1 = __webpack_require__("react-router-dom");
const Home_1 = __webpack_require__("./assets/components/Home/Home.tsx");
// import Login from './Login/Login';
const Preferences_1 = __webpack_require__("./assets/components/Preferences/Preferences.tsx");
const _404_1 = __webpack_require__("./assets/components/404/404.tsx");
// import VariableRoutes from './VariableRoutes';
class Main extends React.Component {
    render() {
        return React.createElement("div", { className: "mainContent" }, React.createElement(react_router_dom_1.Switch, null, React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: Home_1.default }), React.createElement(react_router_dom_1.Route, { path: "/preferences", component: Preferences_1.default }), React.createElement(react_router_dom_1.Route, { component: _404_1.default })));
    }
}
exports.default = Main;

/***/ }),

/***/ "./assets/components/Preferences/Preferences.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"container":"Preferences__container__3HeTI","optionContainer":"Preferences__optionContainer__WwSTG","previewContainer":"Preferences__previewContainer__1-Ott","selected":"Preferences__selected__24K0l","canvas":"Preferences__canvas__3WMKv"};

/***/ }),

/***/ "./assets/components/Preferences/Preferences.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const react_redux_1 = __webpack_require__("react-redux");
const Tetriminos_1 = __webpack_require__("./assets/components/Canvas/Tetriminos.ts");
const Canvas_1 = __webpack_require__("./assets/components/Canvas/Canvas.tsx");
const style = __webpack_require__("./assets/components/Preferences/Preferences.scss");
const Reducer_1 = __webpack_require__("./assets/components/Preferences/Reducer.ts");
class Preferences extends React.Component {
    drawCanvas(colorProfile, i, selectedColorProfile) {
        const { canvasStyle, dispatch } = this.props;
        const selected = Tetriminos_1.arraysAreEqual(selectedColorProfile, Tetriminos_1.COLORTABLE[colorProfile]);
        if (selected) {
            console.log(colorProfile);
        }
        return React.createElement("div", { onClick: () => dispatch(Reducer_1.Actions.setColorTable(Tetriminos_1.COLORTABLE[colorProfile])), className: `${style.previewContainer} ${selected ? style.selected : ''}`, key: i }, React.createElement(Canvas_1.default, { className: style.canvas, width: 80, height: 140, style: Object.assign({}, canvasStyle, { colorTable: Tetriminos_1.COLORTABLE[colorProfile] }), setController: controller => {
                controller.clear();
                controller.draw(Tetriminos_1.PreviewMatrix);
            } }), React.createElement("span", null, colorProfile));
    }
    render() {
        let keys = Object.keys(Tetriminos_1.COLORTABLE);
        const { dispatch } = this.props;
        const { colorTable, drawShadow } = this.props.canvasStyle;
        return React.createElement("div", { className: style.container }, React.createElement("h2", null, "Tetrimino Colors"), React.createElement("div", { className: style.optionContainer }, keys.map((key, i) => this.drawCanvas(key, i, colorTable))), React.createElement("label", null, "Show Shadow"), React.createElement("input", { type: "checkbox", checked: drawShadow, onChange: e => dispatch(Reducer_1.Actions.drawShadow(e.target.checked)) }));
    }
}
exports.default = react_redux_1.connect(state => Object.assign({}, state.Preferences))(Preferences);

/***/ }),

/***/ "./assets/components/Preferences/Reducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const Tetriminos_1 = __webpack_require__("./assets/components/Canvas/Tetriminos.ts");
class Actions {
    static setColorTable(colorTable) {
        return {
            type: Actions.SET_COLOR_TABLE,
            colorTable,
            saveLocally: ['Preferences', 'canvasStyle', 'colorTable']
        };
    }
    static drawShadow(drawShadow) {
        return {
            type: Actions.DRAW_SHADOW,
            drawShadow,
            saveLocally: ['Preferences', 'canvasStyle', 'drawShadow']
        };
    }
}
Actions.SET_COLOR_TABLE = 'PREFERENCES_SET_COLOR_TABLE';
Actions.DRAW_SHADOW = 'PREFERENCES_SET_DRAW_SHADOW';
exports.Actions = Actions;
const initialState = {
    canvasStyle: {
        drawShadow: false,
        colorTable: Tetriminos_1.COLORTABLE['tigrana'],
        clearColor: '#000',
        canvas: { shadowBlur: '1', shadowColor: 'black' }
    }
};
exports.default = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SET_COLOR_TABLE:
            return Object.assign({}, state, { canvasStyle: Object.assign({}, state.canvasStyle, { colorTable: action.colorTable }) });
        case Actions.DRAW_SHADOW:
            return Object.assign({}, state, { canvasStyle: Object.assign({}, state.canvasStyle, { drawShadow: action.drawShadow }) });
    }
    return state;
};

/***/ }),

/***/ "./assets/components/RootReducer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = __webpack_require__("redux");
const react_router_redux_1 = __webpack_require__("react-router-redux");
const Reducer_1 = __webpack_require__("./assets/components/Login/Reducer.ts");
const Reducer_2 = __webpack_require__("./assets/components/Header/Reducer.ts");
const Reducer_3 = __webpack_require__("./assets/components/Home/Reducer.ts");
const Reducer_4 = __webpack_require__("./assets/components/GameBoard/Reducer.ts");
const EventLoopReducer_1 = __webpack_require__("./assets/components/EventLoopReducer.ts");
const Reducer_5 = __webpack_require__("./assets/components/Preferences/Reducer.ts");
const initialWindowState = {
    width:  false ? window.innerWidth : 0,
    height:  false ? window.innerHeight : 0,
    tabletBreakpoint: 1299,
    phoneBreakpoint: 896
};
const SCREEN_RESIZE = 'WINDOW_SCREEN_RESIZE';
function attachResizeListener(store) {
    if (false) {
        let timer;
        window.addEventListener('resize', e => {
            // assuming a large number of components will be using screen size
            // only dispatch the action after the resize has finished
            clearTimeout(timer);
            timer = setTimeout(() => {
                store.dispatch(screenResize(window.innerWidth, window.innerHeight));
            }, 250);
        });
    }
}
exports.attachResizeListener = attachResizeListener;
const phoneBreakpoint = 896,
      tabletBreakpoint = 1299;
const screenResize = (width, height) => ({
    type: SCREEN_RESIZE,
    width,
    height
});
const setBounds = (width, height) => ({
    width,
    height,
    tabletBreakpoint,
    phoneBreakpoint,
    mobile: width < phoneBreakpoint,
    tablet: width < tabletBreakpoint
});
function bounds(state = initialWindowState, action) {
    switch (action.type) {
        case SCREEN_RESIZE:
            return Object.assign({}, state, setBounds(action.width, action.height));
        case '@@router/LOCATION_CHANGE':
            return Object.assign({}, state, setBounds(window.innerWidth, window.innerHeight));
    }
    return state;
}
function pathHistory(state = [], action) {
    if (action.type === 'PATH_TRACKING') {
        let lastPath = state[0];
        return lastPath === action.path ? state : [action.path, ...state];
    }
    return state;
}
exports.default = redux_1.combineReducers({
    Login: Reducer_1.default,
    bounds,
    Header: Reducer_2.default,
    Home: Reducer_3.default,
    GameBoard: Reducer_4.default,
    EventLoop: EventLoopReducer_1.default,
    router: react_router_redux_1.routerReducer,
    Preferences: Reducer_5.default
});

/***/ }),

/***/ "./assets/components/Store.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = __webpack_require__("redux");
const react_router_redux_1 = __webpack_require__("react-router-redux");
const createBrowserHistory_1 = __webpack_require__("history/createBrowserHistory");
const createMemoryHistory_1 = __webpack_require__("history/createMemoryHistory");
const EventLoopReducer_1 = __webpack_require__("./assets/components/EventLoopReducer.ts");
const redux_thunk_1 = __webpack_require__("redux-thunk");
const RootReducer_1 = __webpack_require__("./assets/components/RootReducer.ts");
const Utils_1 = __webpack_require__("./assets/utils/Utils.ts");
const Rest_1 = __webpack_require__("./assets/utils/Rest.ts");
const LocalStorage_1 = __webpack_require__("./assets/utils/LocalStorage.ts");
let localStorage = LocalStorage_1.default("OMARZION_TETRIS", LocalStorage_1.replaceArrOnMerge);
let mw = [Rest_1.default, localStorage, redux_thunk_1.default];
// Add logging to dev environment
if (true) {
    const logger = store => next => action => {
        if (action.type !== EventLoopReducer_1.Actions.UPDATE) console.log('dispatching', action);
        let result = next(action);
        if (action.type !== EventLoopReducer_1.Actions.UPDATE) console.log('next state', store.getState());
        return result;
    };
    const crashReporter = store => next => action => {
        try {
            return next(action);
        } catch (err) {
            console.error('Exception!', err);
            throw err;
        }
    };
    mw = [...mw, logger, crashReporter];
}
const titleSetter = store => next => action => {
    if (action.type === '@@router/LOCATION_CHANGE') {
        let title = action.payload.pathname.replace(/[^a-zA-Z0-9 |:-]/g, ' ');
        document.title = Utils_1.Format.capitalize(title.trim());
    }
    next(action);
};
mw = [...mw, titleSetter];
exports.default = (preloadedState = {}) => {
    const history =  false ? createBrowserHistory_1.default() : createMemoryHistory_1.default();
    const middleware = redux_1.applyMiddleware(...mw, react_router_redux_1.routerMiddleware(history));
    const store = redux_1.createStore(RootReducer_1.default, preloadedState, middleware);
    RootReducer_1.attachResizeListener(store);
    return { store, history: history };
};

/***/ }),

/***/ "./assets/components/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const Header_1 = __webpack_require__("./assets/components/Header/Header.tsx");
const Main_1 = __webpack_require__("./assets/components/Main.tsx");
__webpack_require__("es6-promise/auto");
__webpack_require__("./assets/scss/global.scss");
class App extends React.Component {
    render() {
        return React.createElement("div", null, React.createElement(Header_1.default, null), React.createElement(Main_1.default, null));
    }
}
exports.App = App;

/***/ }),

/***/ "./assets/scss/global.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./assets/utils/LocalStorage.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __webpack_require__("deepmerge");
exports.default = (namespace, deepMergeOpts) => store => next => action => {
    if (typeof action.type === 'undefined' || typeof action.saveLocally === 'undefined') return next(action);
    next(action);
    let mergableState = findIn(store.getState(), action.saveLocally);
    save(namespace, mergableState, deepMergeOpts);
};
function findIn(obj, path) {
    // Get value of interest
    let change = path.reduce((slice, key) => slice[key], obj);
    // rebuild path to value
    return path.reduceRight((slice, key) => ({ [key]: slice }), change);
}
exports.findIn = findIn;
function save(namespace, update, deepMergeOpts) {
    let currentStorage = load(namespace);
    let toStore = deepmerge_1.default(currentStorage, update, deepMergeOpts);
    console.log('save to local storage', toStore);
    localStorage.setItem(namespace, JSON.stringify(toStore));
}
exports.save = save;
function load(namespace) {
    let storage = localStorage.getItem(namespace);
    if (!storage) return {};
    return JSON.parse(storage);
}
exports.load = load;
exports.replaceArrOnMerge = { arrayMerge: (dest, source) => source };
function loadAndMerge(namespace, mergeTo, mergeOpts) {
    return deepmerge_1.default(mergeTo, load(namespace), mergeOpts);
}
exports.loadAndMerge = loadAndMerge;

/***/ }),

/***/ "./assets/utils/Rest.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("isomorphic-fetch");
const Actions_1 = __webpack_require__("./assets/components/Login/Actions.ts");
exports.default = store => next => action => {
    if (typeof action.type === 'undefined' || typeof action.url === 'undefined') return next(action);
    let state = store.getState();
    let [pendingType, successType, errorType] = action.type;
    let { url, method = 'get', contentType = 'application/json', query = {}, data = {}, then } = action;
    let req = {
        headers: { 'Content-Type': contentType },
        method
    };
    let token = window.localStorage.getItem("authorization_token");
    if (method.toLowerCase() === 'post') {
        req['body'] = JSON.stringify(data);
    }
    if (url.indexOf('://') < 0) {
        url = "https://staging.api.wwmach.com/api" + url;
        if (token) {
            req.headers['Authorization'] = token;
        }
    }
    next({ type: pendingType, meta: action.meta });
    if (true) {
        console.log("sending fetch", url, req);
    }
    fetch(url, req).then(r => {
        if (r.status === 401) {
            window.localStorage.removeItem("authorization_token");
            // TODO redirect to login page here
        }
        if (!r.ok) {
            throw r;
        }
        if (r.ok && successType === Actions_1.default.LOGIN.SUCCESS && r.headers.has("Authorization")) {
            window.localStorage.setItem("authorization_token", r.headers.get("Authorization") || '');
            return;
        }
        return r.json();
    }).then(data => {
        next((dispatch, getState) => {
            dispatch({ type: successType, data, meta: action.meta });
            if (then) dispatch(then);
        });
    }).catch(e => {
        next({
            type: errorType,
            error: e,
            meta: action.meta
        });
        return;
    });
};

/***/ }),

/***/ "./assets/utils/Utils.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.for2dTruthy = (matrix, callback) => {
    let y;
    let x;
    let tempReturn = false;
    for (y = 0; y < matrix.length; y++) {
        for (x = 0; x < matrix[y].length; x++) {
            tempReturn = callback(x, y);
            if (tempReturn) return tempReturn;
        }
    }
    return tempReturn;
};
exports.compareWith = (...keys) => (a, b) => a && b ? keys.reduce((acc, cur) => acc && a[cur] === b[cur], true) : false;
function storageAvailable(type) {
    try {
        // test for 'localStorage' and 'sessionStorage'
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuoteExceededError' || e.name === 'NS_ERROR_DOM_QUOTEA_REACHED') && storage.length !== 0;
    }
}
exports.storageAvailable = storageAvailable;
class Format {
    static percentage(percentage) {
        return `${(percentage * 100).toLocaleString()}%`;
    }
    static dateFull(timestamp) {
        return new Date(timestamp).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    static date(timestamp) {
        let date = new Date(timestamp);
        return `${Format.padLeft((date.getMonth() + 1).toString(), 2, '0')}/${Format.padLeft(date.getDate().toString(), 2, '0')}/${date.getFullYear().toString().slice(2)}`;
    }
    static padLeft(str, x, s) {
        str = str.toString();
        if (str.length >= x) return str;
        return Array((x + 1 - str.length) / s.length | 0).join(s) + str;
    }
    static capitalize(str) {
        if (str.length < 1) return str;
        return str[0].toUpperCase() + str.slice(1);
    }
    static pluralize(str, qty) {
        return qty > 1 && str[str.length - 1] !== 's' ? str + 's' : str;
    }
    static depluralize(str) {
        return str[str.length - 1] === 's' ? str.substr(0, str.length - 1) : str;
    }
    static phoneNumber(str) {
        let s = str.replace(/\D/g, '');
        return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
    }
    static stringifyList(strs) {
        return strs.slice(0, -1).join(', ') + ', and ' + strs.slice(-1);
    }
}
exports.Format = Format;
function lockScroll(lock = true, resetScroll = false) {
    if (resetScroll) window.scroll(0, 0);
    document.body.classList.toggle('body-locked', lock);
}
exports.lockScroll = lockScroll;
function getProportionateWidth({ width, height }, targetHeight) {
    return width * targetHeight / height;
}
exports.getProportionateWidth = getProportionateWidth;
function ImageBase64(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.onerror = e => reject(e);
        image.onload = function () {
            let me = this;
            let canvas = document.createElement('canvas');
            canvas.width = me.width;
            canvas.height = me.height;
            let ctx = canvas.getContext('2d');
            if (ctx !== null) {
                // ctx.scale(2,2);
                ctx.drawImage(me, 0, 0);
                let dataUrl = canvas.toDataURL('image/png');
                if (dataUrl) {
                    resolve({
                        data: dataUrl,
                        width: canvas.width,
                        height: canvas.height
                    });
                } else {
                    reject('failed to get dataurl');
                }
            } else {
                reject('failed to create canvas');
            }
        };
        image.src = url;
    });
}
exports.ImageBase64 = ImageBase64;
function serialize(params) {
    return Object.keys(params).map(p => `${p}=${encodeURIComponent(params[p].trim())}`).join('&');
}
exports.serialize = serialize;

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__("./node_modules/webpack/hot/log.js");

	if(unacceptedModules.length > 0) {
		log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if(!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if(typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if(numberIds)
			log("info", "[HMR] Consider using the NamedModulesPlugin for module names.");
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog = (logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if(shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if(shouldLog(level)) {
		if(level === "info") {
			console.log(msg);
		} else if(level === "warning") {
			console.warn(msg);
		} else if(level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if(true) {
	var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);
	var log = __webpack_require__("./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if(module.hot.status() === "idle") {
			module.hot.check(true).then(function(updatedModules) {
				if(!updatedModules) {
					if(fromUpdate) log("info", "[HMR] Update applied.");
					return;
				}
				__webpack_require__("./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
				checkForUpdate(true);
			}).catch(function(err) {
				var status = module.hot.status();
				if(["abort", "fail"].indexOf(status) >= 0) {
					log("warning", "[HMR] Cannot apply update.");
					log("warning", "[HMR] " + err.stack || err.message);
					log("warning", "[HMR] You need to restart the application!");
				} else {
					log("warning", "[HMR] Update failed: " + err.stack || err.message);
				}
			});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}

/* WEBPACK VAR INJECTION */}.call(exports, "?1000"))

/***/ }),

/***/ "./server/HtmlTags.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
let scripts = `
	<script defer type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js'></script>
	<script defer type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js'></script>
	<script defer type='text/javascript' src='/res/main.js'></script>
`;
let styles = `
	<meta name="viewport" content="width=device-width, user-scalable=no"/>
	<link href="https://fonts.googleapis.com/css?family=Signika:300,400,700" rel = "stylesheet" >
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
`;
if (true) {
	styles += `<link rel='stylesheet' type='text/css' href='/res/main.css'>`;
	scripts = `<script src="http://localhost:${+"1335" + 1}/main.js"></script>`;
} else {
	styles += `<link rel="stylesheet" type="text/css" href="http://localhost:${+ENV.port + 1}/main.css">`;
}
exports.default = { styles, scripts };

/***/ }),

/***/ "./server/Utils.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__("react");
const react_redux_1 = __webpack_require__("react-redux");
const react_router_dom_1 = __webpack_require__("react-router-dom");
const index_1 = __webpack_require__("./assets/components/index.tsx");
const server_1 = __webpack_require__("react-dom/server");
const HtmlTags_1 = __webpack_require__("./server/HtmlTags.ts");
exports.discernFile = (req, res, next) => {
  let r = /(\/)(?!.*\/).*/g;
  let match = r.exec(req.originalUrl);
  req.render_page = !(match && match[0].indexOf('.') > 0);
  next();
};
exports.discernMobile = (req, res, next) => {
  req.mobile_client = req.headers['user-agent'].includes('Mobi');
  next();
};
exports.renderApp = (url, store) => server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store }, React.createElement(react_router_dom_1.StaticRouter, { location: url, context: {} }, React.createElement(index_1.App, null))));
exports.renderHtml = (app, state) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>title</title>
      ${HtmlTags_1.default.styles}
    </head>
    <body>
    <div id='root'>${app}</div>
    <script>
      window.__preload_state__ = ${JSON.stringify(state).replace(/</g, '\u003c')}
    </script>
    ${HtmlTags_1.default.scripts}
    </body>
  </html>
`;
exports.desktopStateStub = { bounds: { width: 1300 } };

/***/ }),

/***/ "./server/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http__ = __webpack_require__("http");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server__ = __webpack_require__("./server/server.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__server__);



const server = __WEBPACK_IMPORTED_MODULE_0_http___default.a.createServer(__WEBPACK_IMPORTED_MODULE_1__server___default.a);
const port = "1335";

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));

if (true) {
  let currentApp = __WEBPACK_IMPORTED_MODULE_1__server___default.a;
  module.hot.accept("./server/server.tsx", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_1__server__ = __webpack_require__("./server/server.tsx"); /* harmony import */ __WEBPACK_IMPORTED_MODULE_1__server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__server__); (() => {
    server.removeListener('request', currentApp);
    server.on('request', __WEBPACK_IMPORTED_MODULE_1__server___default.a);
    currentApp = __WEBPACK_IMPORTED_MODULE_1__server___default.a;
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
}

/***/ }),

/***/ "./server/server.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__("express");
const serveStatic = __webpack_require__("serve-static");
const Utils_1 = __webpack_require__("./server/Utils.tsx");
const Store_1 = __webpack_require__("./assets/components/Store.ts");
const app = express();
app.use('/res', serveStatic('assets/res'));
app.use('/res', serveStatic('bin/'));
app.use(Utils_1.discernFile);
app.use(Utils_1.discernMobile);
app.get('/*', (req, res) => {
    // Work around to allow sending files
    if (!req.render_page) return res.send('');
    console.log(req.url);
    let initialState = req.mobile_client ? { Home: {} } : Utils_1.desktopStateStub;
    let siteData = {};
    // fetch(ENV.backendApi+'/site/load?url=wwmach.com')
    // .then(res => res.json())
    // .then(siteData => {
    // console.log(siteData);
    initialState.Home = Object.assign({}, initialState.Home, { initialData: siteData });
    let { store, history } = Store_1.default(initialState);
    let application = Utils_1.renderApp(req.url, store);
    let preloadState = store.getState();
    res.send(Utils_1.renderHtml(application, preloadState));
    // })
});
exports.default = app;

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./server/index.js");
module.exports = __webpack_require__("./node_modules/webpack/hot/poll.js?1000");


/***/ }),

/***/ "deepmerge":
/***/ (function(module, exports) {

module.exports = require("deepmerge");

/***/ }),

/***/ "es6-promise/auto":
/***/ (function(module, exports) {

module.exports = require("es6-promise/auto");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "history/createBrowserHistory":
/***/ (function(module, exports) {

module.exports = require("history/createBrowserHistory");

/***/ }),

/***/ "history/createMemoryHistory":
/***/ (function(module, exports) {

module.exports = require("history/createMemoryHistory");

/***/ }),

/***/ "http":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "isomorphic-fetch":
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-redux":
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-router-dom":
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "react-router-redux":
/***/ (function(module, exports) {

module.exports = require("react-router-redux");

/***/ }),

/***/ "redux":
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-thunk":
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ "serve-static":
/***/ (function(module, exports) {

module.exports = require("serve-static");

/***/ })

/******/ });