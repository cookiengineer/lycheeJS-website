
lychee = (function(global) {

	if (typeof lychee !== 'undefined') {
		return lychee;
	}



	const _BLOBOF_CACHE      = {};
	const _INTERFACEOF_CACHE = {};



	/*
	 * POLYFILLS
	 */

	if (typeof Array.from !== 'function') {

		Array.from = function(alike/*, predicate, thisArg */) {

			if (alike === null || alike === undefined) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}


			let construct = this;
			let list      = Object(alike);
			let predicate = arguments.length > 1 ? arguments[1] : void 0;
			let thisArg   = arguments.length > 2 ? arguments[2] : void 0;

			if (typeof predicate !== 'undefined') {

				if (typeof predicate !== 'function') {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

			}

			let length = list.length >>> 0;
			let array  = typeof construct === 'function' ? Object(new construct(length)) : new Array(length);

			for (let i = 0; i < length; i++) {

				let value = list[i];

				if (predicate !== undefined) {

					if (thisArg === undefined) {
						array[i] = predicate(value, i);
					} else {
						array[i] = predicate.call(thisArg, value, i);
					}

				} else {
					array[i] = value;
				}

			}

			array.length = length;

			return array;

		};

	}

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let list    = Object(this);
			let length  = list.length >>> 0;
			let thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			let value;

			for (let i = 0; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (predicate.call(thisArg, value, i, list)) {
						return value;
					}

				}

			}


			return undefined;

		};

	}

	if (typeof Array.prototype.includes !== 'function') {

		Array.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.includes called on null or undefined');
			}


			let list   = Object(this);
			let length = list.length >>> 0;
			let from   = arguments.length >= 2 ? arguments[1] : 0;
			let value;


			if (length === 0 || from >= length) {
				return false;
			}


			let start = Math.max(from >= 0 ? from : (length - Math.abs(from)), 0);

			for (let i = start; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (value === search || (isNaN(value) && isNaN(search))) {
						return true;
					}

				}

			}


			return false;

		};

	}

	if (typeof Array.prototype.unique !== 'function') {

		Array.prototype.unique = function() {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.unique called on null or undefined');
			}


			let clone  = [];
			let list   = Object(this);
			let length = this.length >>> 0;
			let value;

			for (let i = 0; i < length; i++) {

				value = list[i];

				if (clone.indexOf(value) === -1) {
					clone.push(value);
				}
			}

			return clone;

		};

	}

	if (typeof Boolean.prototype.toJSON !== 'function') {

		Boolean.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Date.prototype.toJSON !== 'function') {

		let _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				let str = '';

				str += this.getUTCFullYear()                + '-';
				str += _format_date(this.getUTCMonth() + 1) + '-';
				str += _format_date(this.getUTCDate())      + 'T';
				str += _format_date(this.getUTCHours())     + ':';
				str += _format_date(this.getUTCMinutes())   + ':';
				str += _format_date(this.getUTCSeconds())   + 'Z';

				return str;

			}


			return null;

		};

	}

	if (typeof Number.prototype.toJSON !== 'function') {

		Number.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Object.assign !== 'function') {

		Object.assign = function(object /*, ... sources */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.assign called on a non-object');
			}


			for (let a = 1, al = arguments.length; a < al; a++) {

				let source = arguments[a];
				if (source !== undefined && source !== null) {

					for (let key in source) {

						if (Object.prototype.hasOwnProperty.call(source, key) === true) {
							object[key] = source[key];
						}

					}

				}

			}


			return object;

		};

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let props   = [];
			let values  = [];
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			let filtered = {};

			for (let i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}

			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}

			return undefined;

		};

	}

	if (typeof Object.map !== 'function') {

		Object.map = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.map called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let clone   = {};
			let keys    = Object.keys(object).sort();
			let length  = keys.length >>> 0;
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;
			let key;
			let value;
			let tmp;


			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];
				tmp   = predicate.call(thisArg, value, key);

				if (tmp !== undefined) {
					clone[key] = tmp;
				}

			}


			return clone;

		};

	}

	if (typeof Object.sort !== 'function') {

		Object.sort = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.sort called on a non-object');
			}


			let clone  = {};
			let keys   = Object.keys(object).sort();
			let length = keys.length >>> 0;
			let key;
			let value;

			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];

				if (value instanceof Array) {

					clone[key] = value.map(function(element) {

						if (element instanceof Array) {
							return element;
						} else if (element instanceof Object) {
							return Object.sort(element);
						} else {
							return element;
						}

					});

				} else if (value instanceof Object) {

					clone[key] = Object.sort(value);

				} else {

					clone[key] = value;

				}

			}

			return clone;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			let values = [];

			for (let prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.endsWith !== 'function') {

		String.prototype.endsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.endsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : value.length;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from - length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.includes !== 'function') {

		String.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.includes called on null or undefined');
			}


			let value  = String(this);
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;

			if (from + length > value.length) {
				return false;
			}


			return value.indexOf(search, from) !== -1;

		};

	}

	if (typeof String.prototype.replaceObject !== 'function') {

		String.prototype.replaceObject = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('String.prototype.replaceObject called on a non-object');
			}


			let clone  = '' + this;
			let keys   = Object.keys(object);
			let values = Object.values(object);


			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key   = keys[k];
				let value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value);
				} else if (value instanceof Object) {
					value = JSON.stringify(value);
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				let pointers = [];
				let pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				let offset = 0;

				for (let p = 0, pl = pointers.length; p < pl; p++) {

					let index = pointers[p];

					clone   = clone.substr(0, index + offset) + value + clone.substr(index + offset + key.length + 3);
					offset += (value.length - (key.length + 3));

				}

			}


			return clone;

		};

	}

	if (typeof String.prototype.startsWith !== 'function') {

		String.prototype.startsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.startsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from, length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.toJSON !== 'function') {

		String.prototype.toJSON = function() {
			return this.valueOf();
		};

	}



	/*
	 * HELPERS
	 */

	let _environment = null;
	let _simulation  = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	const _bootstrap_simulation = function() {

		_bootstrap_environment.call(this);


		if (_simulation === null) {

			_simulation = new lychee.Simulation({
				environment: this.environment
			});

		}


		if (this.simulation === null) {
			this.setSimulation(_simulation);
		}

	};

	const _validate_environment = function(environment) {

		if (environment instanceof lychee.Environment) {
			return true;
		} else if (environment instanceof lychee.Simulation) {
			return true;
		}


		return false;

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		debug: true,

		environment: _environment,
		simulation:  _simulation,

		ENVIRONMENTS: {},
		FEATURES:     {},
		FILENAME:     null,
		PLATFORMS:    [],
		SIMULATIONS:  {},

		ROOT: {
			lychee:  '/opt/lycheejs',
			project: null
		},

		VERSION: "2018-Q2",



		/*
		 * LIBRARY API
		 */

		assignsafe: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue === null && ovalue !== null) {

								target[prop] = object[prop];

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		assignunlink: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let ovalue = object[prop];
							if (ovalue instanceof Array) {

								target[prop] = [];
								Module.assignunlink(target[prop], object[prop]);

							} else if (ovalue instanceof Object) {

								target[prop] = {};
								Module.assignunlink(target[prop], object[prop]);

							} else {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		blobof: function(template, blob) {

			template = template !== undefined ? template : null;
			blob     = blob instanceof Object ? blob     : null;


			if (template !== null && blob !== null) {

				let tname    = template.displayName;
				let bname    = blob.reference || blob.constructor || null;
				let hashable = typeof tname === 'string' && typeof bname === 'string';
				let hashmap  = _BLOBOF_CACHE;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][bname] !== undefined) {

						return hashmap[tname][bname];

					} else if (tname === bname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][bname] = true;

						return hashmap[tname][bname];

					} else if (tname !== bname) {

						let instance = lychee.deserialize(blob);
						if (lychee.interfaceof(template, instance) === true) {

							if (hashmap[tname] === undefined) {
								hashmap[tname] = {};
							}

							hashmap[tname][bname] = true;

							return hashmap[tname][bname];

						}

					}

				}

			}


			return false;

		},

		diff: function(aobject, bobject) {

			aobject = aobject !== undefined ? aobject : undefined;
			bobject = bobject !== undefined ? bobject : undefined;


			if (aobject === bobject) {

				return false;

			} else if (aobject instanceof Array && bobject instanceof Array) {

				for (let a = 0, al = aobject.length; a < al; a++) {

					if (bobject[a] !== undefined) {

						if (aobject[a] !== null && bobject[a] !== null) {

							if (aobject[a] instanceof Object && bobject[a] instanceof Object) {

								if (Module.diff(aobject[a], bobject[a]) === true) {

									// Allows aobject[a].builds = {} and bobject[a].builds = { stuff: {}}
									if (Object.keys(aobject[a]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[a] !== typeof bobject[a]) {
								return true;
							} else if (aobject[a] !== bobject[a]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject instanceof Date && bobject instanceof Date) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof RegExp && bobject instanceof RegExp) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof Object && bobject instanceof Object) {

				let akeys = Object.keys(aobject);
				let bkeys = Object.keys(bobject);

				if (akeys.length !== bkeys.length) {
					return true;
				}


				for (let a = 0, al = akeys.length; a < al; a++) {

					let key = akeys[a];

					if (bobject[key] !== undefined) {

						if (aobject[key] !== null && bobject[key] !== null) {

							if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

								if (Module.diff(aobject[key], bobject[key]) === true) {

									// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
									if (Object.keys(aobject[key]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[key] !== typeof bobject[key]) {
								return true;
							} else if (aobject[key] !== bobject[key]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject !== bobject) {

				return true;

			}


			return false;

		},

		enumof: function(template, value) {

			template = template instanceof Object ? template : null;
			value    = typeof value === 'number'  ? value    : null;


			if (template !== null && value !== null) {

				let valid = false;

				for (let val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}

				return valid;

			}


			return false;

		},

		interfaceof: function(template, instance) {

			template = template !== undefined ? template : null;
			instance = instance !== undefined ? instance : null;


			if (template !== null && instance !== null) {

				let tname    = template.displayName;
				let iname    = instance.displayName;
				let hashable = typeof tname === 'string' && typeof iname === 'string';
				let hashmap  = _INTERFACEOF_CACHE;
				let valid    = false;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][iname] !== undefined) {

						return hashmap[tname][iname];

					} else if (tname === iname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][iname] = true;

						return hashmap[tname][iname];

					}

				}


				// 1. Interface validation on Template
				if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
							valid = false;
							break;
						}

					}


				// 2. Interface validation on Instance
				} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance[method]) {
							valid = false;
							break;
						}

					}


				// 3. Interface validation on Struct
				} else if (template instanceof Object && instance instanceof Object) {

					valid = true;

					for (let property in template) {

						if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

							if (typeof template[property] !== typeof instance[property]) {
								valid = false;
								break;
							}

						}

					}

				}


				if (hashable === true) {

					if (hashmap[tname] === undefined) {
						hashmap[tname] = {};
					}

					hashmap[tname][iname] = valid;

				}


				return valid;

			}


			return false;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			try {
				data = JSON.parse(JSON.stringify(data));
			} catch (err) {
				data = null;
			}


			if (data !== null) {

				let instance = null;
				let scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					let resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					let resolved_composite = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_composite === 'function') {

						let bindargs = Array.from(data.arguments).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								let resolved = _resolve_reference.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_composite);
						bindargs.reverse();


						instance = new (
							resolved_composite.bind.apply(
								resolved_composite,
								bindargs
							)
						)();

					}

				} else if (data instanceof Object) {

					instance = data;

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						let blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					console.info('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			let data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else if (typeof definition.displayName !== 'undefined') {

						if (definition.prototype instanceof Object) {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.prototype.serialize() to serialize it.');
						} else {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.serialize() to serialize it.');
						}

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch (err) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		assimilate: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				_bootstrap_environment.call(this);


				let that = this;


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let asset = new lychee.Asset(target, null, false);
				if (asset !== null) {
					asset.load();
				}


				return asset;

			} else {

				console.warn('lychee.assimilate: Invalid target');
				console.info('lychee.assimilate: Use lychee.assimilate(target) where target is a path to an Asset');

			}


			return null;

		},

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				let that       = this;
				let definition = new lychee.Definition({
					id:  identifier,
					url: lychee.FILENAME || null
				});


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				definition.exports = function(callback) {

					lychee.Definition.prototype.exports.call(this, callback);
					that.environment.define(this, false);

				};


				return definition;

			} else {

				console.warn('lychee.define: Invalid identifier');
				console.info('lychee.define: Use lychee.define(id).exports(function(lychee, global, attachments) {})');

			}


			return null;

		},

		export: function(reference, sandbox) {

			reference = typeof reference === 'string' ? reference : null;
			sandbox   = sandbox !== undefined         ? sandbox   : global;


			if (reference !== null && sandbox !== null) {

				_bootstrap_environment.call(this);


				let definition = this.environment.definitions[reference] || null;
				if (definition !== null) {
					return definition.export(sandbox);
				}

			}


			return false;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				let instance = null;
				let that     = this;

				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let resolved_module = _resolve_reference.call(that.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {
					console.info('lychee.deserialize: Require ' + (reference) + ' to import it.');
				}


				return instance;

			} else {

				console.warn('lychee.import: Invalid reference');
				console.info('lychee.import: Use lychee.import(reference)');

			}


			return null;

		},

		init: function(environment, settings, callback) {

			let message = environment !== null;

			environment = _validate_environment(environment) === true ? environment : null;
			settings    = settings instanceof Object                  ? settings    : null;
			callback    = callback instanceof Function                ? callback    : null;


			_bootstrap_environment.call(this);
			_bootstrap_simulation.call(this);


			if (environment !== null && settings !== null) {

				if (_environment !== null) {

					if (environment instanceof lychee.Environment) {

						Object.values(_environment.definitions).forEach(function(definition) {
							environment.define(definition, true);
						});

					} else if (environment instanceof lychee.Simulation) {

						Object.values(_environment.definitions).forEach(function(definition) {
							environment.environment.define(definition, true);
						});

					}

				}


				if (environment.id.startsWith('lychee-Environment-')) {
					environment.setId((lychee.ROOT.project || '').substr((lychee.ROOT.lychee || '').length) + '/custom');
				}

				for (let id in settings) {

					let method = 'set' + id.charAt(0).toUpperCase() + id.substr(1);
					if (typeof environment[method] === 'function') {
						environment[method](settings[id]);
					}

				}


				if (environment instanceof lychee.Environment) {

					if (callback === null) {

						let code    = '';
						let profile = settings.profile || {};

						code += '\n\n';
						code += 'if (sandbox === null) {\n';
						code += '\tconsole.error(\'lychee: environment.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'let lychee = sandbox.lychee;\n';

						let packages = environment.packages;
						if (packages instanceof Object && Array.isArray(packages) === false) {

							for (let pid in packages) {

								if (pid !== 'lychee' && /$([a-z]+)/g.test(pid)) {
									code += 'let ' + pid + ' = sandbox.' + pid + ';\n';
								}

							}

						}

						code += '\n\n';
						code += 'sandbox.MAIN = new ' + environment.target + '(' + JSON.stringify(profile) + ');\n';
						code += '\n\n';
						code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
						code += '\tsandbox.MAIN.init();\n';
						code += '}\n';

						callback = new Function('sandbox', code);

					}


					lychee.setEnvironment(environment);
					environment.init(callback);

				} else if (environment instanceof lychee.Simulation) {

					let simulation = environment;

					environment = simulation.environment;


					if (callback === null) {

						let code = '';

						code += '\n\n';
						code += 'if (sandbox_sim === null) {\n';
						code += '\tconsole.error(\'lychee: simulation.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'console.info(\'lychee: simulation.init() succeeded.\');\n';

						callback = new Function('sandbox_sim', code);

					}


					lychee.setEnvironment(environment);

					environment.init(function(sandbox) {

						if (sandbox === null) {
							console.error('lychee: environment.init() failed.');
							return;
						}


						console.info('lychee: environment.init() succeeded.');

						lychee.setSimulation(simulation);
						simulation.init(callback);

					});

				}


				return true;

			} else if (message === true) {

				console.warn('lychee.init: Invalid environment');
				console.info('lychee.init: Use lychee.init(env, settings, callback) where env can be a lychee.Environment or lychee.Simulation instance.');

			}


			return false;

		},

		inject: function(environment) {

			let message = environment !== null;

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment.call(this);


			if (environment !== null) {

				if (this.environment !== null) {

					let that = this;

					Object.values(environment.definitions).forEach(function(definition) {
						that.environment.define(definition, true);
					});

					let build_old = this.environment.definitions[this.environment.target] || null;
					let build_new = environment.definitions[environment.target]           || null;

					if (build_old === null && build_new !== null) {
						this.environment.target = environment.target;
						this.environment.type   = environment.type;
					}


					return true;

				} else {

					console.warn('lychee.inject: Invalid default environment for injection.');
					console.info('lychee.inject: Use lychee.setEnvironment(env) before using lychee.inject(other).');

				}

			} else if (message === true) {

				console.warn('lychee.inject: Invalid environment');
				console.info('lychee.inject: Use lychee.inject(env) where env is a lychee.Environment instance');

			}


			return false;

		},

		pkg: function(type, id, callback) {

			type     = typeof type === 'string'     ? type       : null;
			id       = typeof id === 'string'       ? id         : null;
			callback = callback instanceof Function ? callback   : null;


			if (id !== null && type !== null && callback !== null) {

				if (/^(build|review|source)$/g.test(type)) {

					let config = new Config('./lychee.pkg');

					config.onload = function() {

						let buffer = this.buffer || null;
						if (buffer instanceof Object) {

							let settings = buffer[type].environments[id] || null;
							if (settings instanceof Object) {

								let environment = null;
								let profile     = settings.profile || null;

								if (profile !== null) {
									delete settings.profile;
								}

								if (type === 'build' || type === 'source') {
									environment = new lychee.Environment(JSON.parse(JSON.stringify(settings)));
								} else if (type === 'review') {
									environment = new lychee.Simulation(JSON.parse(JSON.stringify(settings)));
								}

								callback(environment, profile);

							} else {

								console.warn('lychee.pkg: Invalid settings for "' + id + '" in lychee.pkg.');
								console.info('lychee.pkg: Insert settings at "/' + type + '/environments/' + id + '" in lychee.pkg.');

								callback(null, null);

							}

						} else {

							console.warn('lychee.pkg: Invalid package at "' + this.url + '".');
							console.info('lychee.pkg: Replace lychee.pkg with the one from "/projects/boilerplate".');

							callback(null, null);

						}

					};

					config.load();

					return true;

				}

			}


			return false;

		},

		specify: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_simulation.call(this);


				let that          = this;
				let specification = new lychee.Specification({
					id:  identifier,
					url: lychee.FILENAME || null
				});


				specification.exports = function(callback) {

					lychee.Specification.prototype.exports.call(this, callback);
					that.simulation.specify(this, false);

				};


				return specification;

			} else {

				console.warn('lychee.specify: Invalid identifier');
				console.info('lychee.specify: Use lychee.specify(id).exports(function(lychee, global, simulation) {})');

			}


			return null;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug       = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug       = this.environment.debug;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = _simulation;

			}


			return false;

		}

	};


	if (typeof lychee === 'undefined') {
		lychee = global.lychee = Object.assign({}, Module);
	}


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	/*
	 * HELPERS
	 */

	const _resolve_constructor = function(type) {

		let construct = null;


		if (type === 'fnt')   construct = global.Font;
		if (type === 'json')  construct = global.Config;
		if (type === 'msc')   construct = global.Music;
		if (type === 'pkg')   construct = global.Config;
		if (type === 'png')   construct = global.Texture;
		if (type === 'snd')   construct = global.Sound;
		if (type === 'store') construct = global.Config;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		let asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.startsWith('data:')) {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			let construct = _resolve_constructor(type);
			if (construct !== null) {

				if (url.startsWith('data:')) {

					asset = new construct('/tmp/Asset.' + type, ignore);
					asset.deserialize({
						buffer: url
					});

				} else {

					asset = new construct(url, ignore);

				}

			}

		}


		return asset;

	};


	Callback.displayName = 'lychee.Asset';


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	let _client      = null;
	let _environment = null;
	let _error_trace = Error.prepareStackTrace;


	const _bootstrap_environment = function() {

		if (_environment === null) {

			let currentenv = lychee.environment;
			lychee.setEnvironment(null);

			let defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	const _diff_environment = function(environment) {

		let cache1 = {};
		let cache2 = {};

		let global1 = _environment.global;
		let global2 = environment.global;

		for (let prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (let prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		let diff = Object.assign({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	const _report_error = function(environment, data) {

		let info1 = 'Report from ' + data.file + '#L' + data.line + ' in ' + data.method;
		let info2 = data.message.trim();
		let info3 = data.stacktrace.map(function(callsite) {
			return callsite.file + '#L' + callsite.line + ' in ' + callsite.method;
		}).join('\n');


		let main = environment.global.MAIN || null;
		if (main !== null) {

			let client = main.client || null;
			if (client !== null) {

				let service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger: ' + info1, data);
				}

			}

		}


		console.error('lychee.Debugger: ' + info1);

		if (info2.length > 0) {
			console.error('lychee.Debugger: ' + info2);
		}

		if (info3.length > 0) {

			info3.split('\n').forEach(function(line) {
				console.error('lychee.Debugger: ' + line);
			});

		}
	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : lychee.environment;


			_bootstrap_environment();


			if (environment !== null && environment !== _environment) {

				let project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						let diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, referer) {

			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			referer     = referer instanceof Object                 ? referer     : null;


			if (environment !== null && error !== null) {

				let definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				let data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        null,
					message:     error.message || '',
					stacktrace:  []
				};


				if (typeof error.stack === 'string') {

					let header = error.stack.trim().split('\n')[0].trim();
					let check1 = header.split(':')[0].trim();
					let check2 = header.split(':').slice(1).join(':').trim();

					if (/^(ReferenceError|SyntaxError)$/g.test(check1)) {
						data.type    = check1;
						data.message = check2;
					}


					let stacktrace = error.stack.trim().split('\n').map(function(raw) {

						let file   = null;
						let line   = null;
						let method = null;

						let chunk = raw.trim();
						if (chunk.startsWith('at')) {

							let tmp1 = chunk.substr(2).trim().split(' ');
							if (tmp1.length === 2) {

								method = tmp1[0].trim();

								if (tmp1[1].startsWith('(')) tmp1[1] = tmp1[1].substr(1).trim();
								if (tmp1[1].endsWith(')'))   tmp1[1] = tmp1[1].substr(0, tmp1[1].length - 1).trim();

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						} else if (chunk.includes('@')) {

							let tmp1 = chunk.split('@');
							if (tmp1.length === 2) {

								if (tmp1[0] !== '') {
									method = tmp1[0];
								}

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						}


						if (file !== null) {

							if (file.startsWith('/opt/lycheejs')) {
								file = file.substr(13);
							}

						}

						if (line !== null) {

							let num = parseInt(line, 10);
							if (!isNaN(num)) {
								line = num;
							}

						}


						return {
							method: method,
							file:   file,
							line:   line
						};

					}).filter(function(callsite) {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.method     = callsite.method;
						data.file       = callsite.file;
						data.line       = callsite.line;
						data.stacktrace = stacktrace;

					}

				} else if (typeof Error.captureStackTrace === 'function') {

					Error.prepareStackTrace = function(err, stack) {
						return stack;
					};
					Error.captureStackTrace(error);
					Error.prepareStackTrace = _error_trace;


					let stacktrace = Array.from(error.stack).map(function(frame) {

						let file   = frame.getFileName()     || null;
						let line   = frame.getLineNumber()   || null;
						let method = frame.getFunctionName() || frame.getMethodName() || null;


						if (method !== null) {

							let type = frame.getTypeName() || null;
							if (type !== null) {
								method = type + '.' + method;
							}

						}

						if (file !== null && file.startsWith('/opt/lycheejs')) {
							file = file.substr(13);
						}


						return {
							file:   file,
							line:   line,
							method: method
						};

					}).filter(function(callsite) {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.file       = callsite.file;
						data.line       = callsite.line;
						data.method     = callsite.method;
						data.stacktrace = stacktrace;

					}

				}


				_report_error(environment, data);


				return true;

			} else if (error !== null) {

				console.error(error);

			}


			return false;

		}

	};


	Module.displayName = 'lychee.Debugger';


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _DETECTOR_CACHE = {};
	const _WARNING_CACHE  = {};

	const _create_detector = function(platform) {

		platform = typeof platform === 'string' ? platform : null;


		if (platform !== null) {

			let sandbox = _DETECTOR_CACHE[platform] || null;
			if (sandbox === null) {

				if (platform.includes('-') === true) {

					let major = platform.split('-')[0];
					let minor = platform.split('-')[1];
					let clone = Object.assign({}, lychee.FEATURES[major], lychee.FEATURES[major + '-' + minor]);
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				} else {

					let clone = lychee.FEATURES[platform] || null;
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				}


				_DETECTOR_CACHE[platform] = sandbox;

			}


			return sandbox;

		}


		return null;

	};

	const _create_proxy = function(source, path) {

		path = typeof path === 'string' ? path : 'global';


		if (source === null) {
			return source;
		}


		if (typeof Proxy !== 'undefined') {

			let clone = {};
			let proxy = new Proxy(clone, {

				get: function(target, name) {

					// XXX: Remove this and console will crash the program
					if (name === 'splice') return undefined;


					if (target[name] === undefined) {

						let type = typeof source[name];
						if (/boolean|number|string|function/g.test(type)) {
							target[name] = source[name];
						} else if (/object/g.test(type)) {
							target[name] = _create_proxy(source[name], path + '.' + name);
						} else if (/undefined/g.test(type)) {
							target[name] = undefined;
						}


						if (target[name] === undefined) {

							let warned = _WARNING_CACHE[path + '.' + name] || false;
							if (warned === false) {
								_WARNING_CACHE[path + '.' + name] = true;
								console.warn('lychee.Definition: Unknown feature (data type) "' + path + '.' + name + '" in FEATURES.js');
							}

						}

					}


					return target[name];

				}

			});


			proxy.toJSON = function() {

				let data = {};

				Object.keys(clone).forEach(function(key) {

					if (/toJSON/g.test(key) === false) {

						let type = typeof clone[key];
						if (/boolean|number|string|function/g.test(type)) {
							data[key] = type;
						} else if (/object/g.test(type)) {
							data[key] = clone[key];
						}

					}

				});

				return data;

			};


			return proxy;

		}


		return source;

	};

	const _fuzz_asset = function(type) {

		let asset = {
			url:       '/tmp/Dummy.' + type,
			_is_dummy: true,
			serialize: function() {
				return null;
			}
		};


		let url = this.url;
		if (url !== null) {
			asset.url = url.split('.').slice(0, -1).join('.') + '.' + type;
		}


		Object.defineProperty(asset, 'buffer', {
			get: function() {
				return null;
			},
			set: function() {
				return false;
			},
			enumerable:   true,
			configurable: false
		});


		return asset;

	};

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('source');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._attaches = {
			'json':  _fuzz_asset.call(this, 'json'),
			'fnt':   _fuzz_asset.call(this, 'fnt'),
			'msc':   _fuzz_asset.call(this, 'msc'),
			'pkg':   _fuzz_asset.call(this, 'pkg'),
			'png':   _fuzz_asset.call(this, 'png'),
			'snd':   _fuzz_asset.call(this, 'snd'),
			'store': _fuzz_asset.call(this, 'store')
		};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				let attachesmap = {};

				for (let aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			if (typeof blob.supports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(function(name) {
					return name.trim();
				});

				let check = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.supports.indexOf('{') + 1;
				let i2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(i1, i2 - i1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(function(name) {
					return name.trim();
				});

				let check = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.exports.indexOf('{') + 1;
				let i2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(i1, i2 - i1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (let aid in this._attaches) {

					let asset = this._attaches[aid];
					if (asset.url.startsWith('/tmp/Dummy') === false) {

						let data = lychee.serialize(asset);
						if (data !== null) {
							blob.attaches[aid] = data;
						}

					}

				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (let tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Definition: Injecting Identifier "' + fuzzed + '" (' + this.url + ')');

						return true;

					} else {

						console.error('lychee.Definition: Invalid Identifier "' + id + '" (' + this.url + ')');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let id in map) {

					let value = map[id];
					if (value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		check: function(target) {

			target = target instanceof Object ? target : {};


			let features  = null;
			let supported = true;
			let tagged    = true;


			for (let key in this._tags) {

				let tag = this._tags[key];
				let val = target[key] || null;
				if (val instanceof Array) {

					if (val.includes(tag) === false) {
						tagged = false;
						break;
					}

				} else if (typeof val === 'string') {

					if (val !== tag) {
						tagged = false;
						break;
					}

				}

			}


			if (this._supports !== null) {

				supported = false;


				let platform = this._tags.platform || null;
				if (platform !== null) {

					let detector = _create_detector(platform);
					if (detector !== null) {
						supported = this._supports.call(detector, lychee, detector);
						features  = JSON.parse(JSON.stringify(detector));
						detector  = null;
					} else {
						supported = this._supports.call(global, lychee, global);
					}

				} else {

					supported = this._supports.call(global, lychee, global);

				}

			}


			return {
				features:  features,
				supported: supported,
				tagged:    tagged
			};

		},

		export: function(sandbox) {

			sandbox = sandbox !== undefined ? sandbox : global;


			let check = _resolve.call(sandbox, this.id);
			if (check === null) {

				let console   = sandbox.console || global.console;
				let id        = this.id;
				let namespace = _resolve.call(sandbox, id.split('.').slice(0, -1).join('.'));
				let name      = id.split('.').pop();

				if (this._exports !== null) {

					let includes = this._includes.map(function(id) {
						return _resolve.call(sandbox, id);
					});

					let requires = this._requires.map(function(id) {
						return _resolve.call(sandbox, id);
					});


					if (includes.includes(null) === false && requires.includes(null) === false) {

						let template = null;

						try {

							template = this._exports.call(
								this._exports,
								sandbox.lychee,
								sandbox,
								this._attaches
							) || null;

						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						if (template !== null) {

							if (includes.length > 0) {

								let own_enums   = null;
								let own_methods = null;
								let own_keys    = Object.keys(template);
								let own_proto   = template.prototype;


								if (own_keys.length > 0) {

									own_enums = {};

									for (let ok = 0, okl = own_keys.length; ok < okl; ok++) {

										let own_key = own_keys[ok];
										if (own_key === own_key.toUpperCase()) {
											own_enums[own_key] = template[own_key];
										}

									}

									if (Object.keys(own_enums).length === 0) {
										own_enums = null;
									}

								}


								if (own_proto instanceof Object) {

									own_methods = {};

									for (let own_method in own_proto) {
										own_methods[own_method] = own_proto[own_method];
									}

									if (Object.keys(own_methods).length === 0) {
										own_methods = null;
									}

								}


								Object.defineProperty(namespace, name, {
									value:        template,
									writable:     false,
									enumerable:   true,
									configurable: false
								});

								namespace[name].displayName = id;
								namespace[name].prototype   = {};


								let tpl_enums   = {};
								let tpl_methods = [ namespace[name].prototype ];


								for (let i = 0, il = includes.length; i < il; i++) {

									let include  = includes[i];
									let inc_keys = Object.keys(include);
									if (inc_keys.length > 0) {

										for (let ik = 0, ikl = inc_keys.length; ik < ikl; ik++) {

											let inc_key = inc_keys[ik];
											if (inc_key === inc_key.toUpperCase()) {
												tpl_enums[inc_key] = include[inc_key];
											}

										}

									}

									tpl_methods.push(include.prototype);

								}


								if (own_enums !== null) {

									for (let e in own_enums) {
										tpl_enums[e] = own_enums[e];
									}

								}

								if (own_methods !== null) {
									tpl_methods.push(own_methods);
								}

								for (let e in tpl_enums) {
									namespace[name][e] = tpl_enums[e];
								}


								Object.assign.apply(lychee, tpl_methods);
								namespace[name].prototype.displayName = id;

								Object.freeze(namespace[name].prototype);


								return true;

							} else {

								namespace[name]             = template;
								namespace[name].displayName = id;


								if (template instanceof Object) {
									Object.freeze(namespace[name]);
								}

								if (namespace[name].prototype instanceof Object) {
									namespace[name].prototype.displayName = id;
									Object.freeze(namespace[name].prototype);
								}


								return true;

							}

						} else {

							namespace[name]                       = function() {
								console.warn('Dummy Composite: Replace me with a real Definition!');
							};
							namespace[name].displayName           = id;
							namespace[name].prototype             = {};
							namespace[name].prototype.displayName = id;

							Object.freeze(namespace[name].prototype);

							console.error('lychee.Definition ("' + id + '"): Invalid Definition, replaced with Dummy Composite.');


							return true;

						}

					} else {

						let invalid_includes = this._includes.filter(function(id, i) {
							return includes[i] === null;
						});

						if (invalid_includes.length > 0) {

							for (let i = 0, il = invalid_includes.length; i < il; i++) {
								let tmp = invalid_includes[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Inclusion of "' + tmp + '".');
							}

						}


						let invalid_requires = this._requires.filter(function(id, r) {
							return requires[r] === null;
						});

						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}


				return false;

			}


			return true;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._exports = callback;
			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._includes.includes(definition) === false) {
								this._includes.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Inclusion #' + d + '.');
					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Requirement #' + d + '.');
					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._supports = callback;
			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let tag in map) {

					let val = map[tag];
					if (typeof val === 'string') {
						this._tags[tag] = val;
					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Tag "' + tag + '".');
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Definition';
	Composite.prototype.displayName = 'lychee.Definition';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * EVENTS
	 */

	const _build_loop = function(cache) {

		let load        = cache.load;
		let required_by = cache.required_by;
		let trace       = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier = load[l];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				required_by.splice(l, 1);
				load.splice(l, 1);

				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				let dependencies = _resolve_dependencies.call(this, definition);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							let result = this.load(dependency);
							if (result === true) {
								required_by.push(identifier);
								load.push(dependency);
							}

						}

					}

				} else {

					definition.export(this.global);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(this.global, this.global);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.warn('lychee.Environment ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		// XXX: Always show Dependency Errors
		if (cache.load.length > 0) {

			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map(function(value, index) {

				let other = cache.required_by[index] || null;
				if (other === null) {
					other = 'lychee.environment';
				}

				return '\t - ' + value + ' (required by ' + other + ')';

			}).join('\n') + '.');

		}


		try {
			callback.call(this.global, null);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};



	/*
	 * HELPERS
	 */

	const _inject_features = function(source, features) {

		let that = this;

		Object.keys(features).forEach(function(key) {

			let type = features[key];
			if (/boolean|number|string|function/g.test(type)) {

				that[key] = source[key];

			} else if (typeof type === 'object') {

				if (typeof source[key] === 'object') {

					that[key] = source[key];

					_inject_features.call(that[key], source[key], type);

				}

			}

		});

	};

	const _validate_definition = function(definition) {

		if (definition instanceof _lychee.Definition) {

			let check = definition.check(this.tags);
			let type  = this.type;


			if (check.features !== null) {

				if (type === 'source' || type === 'export') {
					this.__features = _lychee.assignunlink(this.__features, check.features);
				}

				let sandbox = this.sandbox;
				if (sandbox === true) {
					_inject_features.call(this.global, global, check.features);
				}

			}


			if (type === 'build') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'export') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'source') {

				if (check.supported === false) {

					let platforms = this.tags.platform || [];
					if (platforms.length > 0) {

						let info = platforms.map(function(val) {
							return 'lychee.FEATURES[\'' + val + '\']';
						}).join(' or ');
						this.global.console.warn('lychee.Environment ("' + this.id + '"): Unsupported Definition "' + definition.id + '" (missing ' + info + ' entry).');

					}

				}

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.supported && check.tagged;

			}

		}


		return false;

	};

	const _resolve = function(identifier) {

		let pointer = this;
		let path    = identifier.split('.');

		for (let p = 0, pl = path.length; p < pl; p++) {

			let name = path[p];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else if (pointer[name] === undefined) {
				pointer = null;
				break;
			}

		}

		return pointer;

	};

	const _resolve_dependencies = function(definition) {

		let dependencies = [];

		if (definition instanceof _lychee.Definition) {

			for (let i = 0, il = definition._includes.length; i < il; i++) {

				let inc   = definition._includes[i];
				let check = _resolve.call(this.global, inc);
				if (check === null) {
					dependencies.push(inc);
				}

			}

			for (let r = 0, rl = definition._requires.length; r < rl; r++) {

				let req   = definition._requires[r];
				let check = _resolve.call(this.global, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * STRUCTS
	 */

	const _Sandbox = function(settings, platforms) {

		settings  = settings instanceof Object ? settings  : null;
		platforms = platforms instanceof Array ? platforms : [];


		let _std_err = '';
		let _std_out = '';


		this.console = {};
		this.console.log = function() {

			let str = '\n';

			for (let a = 0, al = arguments.length; a < al; a++) {

				let arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.startsWith('\n(E)\t')) {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			let args = [ '(I)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			let args = [ '(W)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			let args = [ '(E)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			let blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.debug        = global.lychee.debug;
		this.lychee.environment  = null;
		this.lychee.simulation   = null;
		this.lychee.ENVIRONMENTS = global.lychee.ENVIRONMENTS;
		this.lychee.FEATURES     = global.lychee.FEATURES;
		this.lychee.FILENAME     = global.lychee.FILENAME;
		this.lychee.PLATFORMS    = global.lychee.PLATFORMS;
		this.lychee.SIMULATIONS  = global.lychee.SIMULATIONS;
		this.lychee.ROOT         = {};
		this.lychee.ROOT.lychee  = global.lychee.ROOT.lychee;
		this.lychee.ROOT.project = global.lychee.ROOT.project;
		this.lychee.VERSION      = global.lychee.VERSION;

		[
			// core/lychee.js
			'assignsafe',
			'assignunlink',
			'blobof',
			'diff',
			'enumof',
			'interfaceof',
			'deserialize',
			'serialize',

			'assimilate',
			'define',
			'import',
			'init',
			'inject',
			'pkg',
			'setEnvironment',
			'setSimulation',

			// core/<Identifier>.js
			'Asset',
			'Debugger',
			'Definition',
			'Environment',
			'Package',
			'Simulation',
			'Specification'

		].forEach(function(identifier) {

			this.lychee[identifier] = _lychee[identifier];

		}.bind(this));


		this.require = function(path) {
			return global.require(path);
		};

		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * GLOBAL INJECTION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(function(key) {

				let instance = _lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			}.bind(this));

		}

		/*
		 * FEATURE INJECTION
		 */

		if (platforms.length > 0) {

			platforms.reverse().forEach(function(platform) {

				let features = _lychee.FEATURES[platform] || null;
				if (features instanceof Object) {

					for (let gid in features) {

						if (this[gid] === undefined) {

							let reference = global[gid];
							if (reference instanceof Object) {

								this[gid] = reference;

							} else if (typeof reference === 'function') {

								this[gid] = function() {
									return global[gid].apply(global, arguments);
								};

							} else {

								this[gid] = reference;

							}

						}

					}

				}

			}.bind(this));

		}

	};

	_Sandbox.prototype = {

		displayName: '_Sandbox',

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			Object.keys(this).filter(function(key) {
				return key.charAt(0) !== '_' && key === key.toUpperCase();
			}).forEach(function(key) {
				states[key] = _lychee.serialize(this[key]);
			}.bind(this));


			blob.lychee          = {};
			blob.lychee.debug    = this.lychee.debug;
			blob.lychee.FILENAME = this.lychee.FILENAME;
			blob.lychee.VERSION  = this.lychee.VERSION;
			blob.lychee.ROOT     = this.lychee.ROOT;


			let data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.debug       = true;
		this.definitions = {};
		this.global      = global !== undefined ? global : {};
		this.packages    = {};
		this.sandbox     = false;
		this.tags        = {};
		this.target      = 'app.Main';
		this.timeout     = 10000;
		this.type        = 'source';

		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         [],
			required_by:   []
		};
		this.__features = {};


		// Alternative API for lychee.pkg

		if (states.packages instanceof Array) {

			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Packages.');
			delete states.packages;

		} else if (states.packages instanceof Object) {

			for (let pid in states.packages) {

				let value = states.packages[pid];
				if (typeof value === 'string') {

					states.packages[pid] = new _lychee.Package({
						id:          pid,
						url:         value,
						type:        'source',
						environment: this
					});

				}

			}

		}


		this.setSandbox(states.sandbox);
		this.setDebug(states.debug);

		this.setDefinitions(states.definitions);
		this.setId(states.id);
		this.setPackages(states.packages);
		this.setTags(states.tags);
		this.setTimeout(states.timeout);

		// Needs this.packages to be ready
		this.setType(states.type);

		// Needs this.type to be ready
		this.setTarget(states.target);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (let did in blob.definitions) {
					this.definitions[did] = _lychee.deserialize(blob.definitions[did]);
				}

			}

			let features = _lychee.deserialize(blob.features);
			if (features !== null) {
				this.__features = features;
			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0], this.tags.platform || null);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')             states.id      = this.id;
			if (this.debug !== true)        states.debug   = this.debug;
			if (this.sandbox !== false)     states.sandbox = this.sandbox;
			if (this.timeout !== 10000)     states.timeout = this.timeout;
			if (this.target !== 'app.Main') states.target  = this.target;
			if (this.type !== 'source')     states.type    = this.type;


			if (Object.keys(this.packages).length > 0) {

				states.packages = {};

				for (let pid in this.packages) {
					states.packages[pid] = this.packages[pid].url;
				}

			}

			if (Object.keys(this.tags).length > 0) {

				states.tags = {};

				for (let tagid in this.tags) {
					states.tags[tagid] = this.tags[tagid];
				}

			}


			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (let did in this.definitions) {
					blob.definitions[did] = _lychee.serialize(this.definitions[did]);
				}

			}

			if (Object.keys(this.__features).length > 0) blob.features = _lychee.serialize(this.__features);

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else {

					let pkg = this.packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee.Environment ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		define: function(definition, inject) {

			definition = definition instanceof _lychee.Definition ? definition : null;
			inject     = inject === true;


			if (definition !== null) {

				let url = definition.url || null;
				if (url !== null && inject === false) {

					let assimilation = true;
					let new_pkg_id   = null;
					let old_pkg_id   = definition.id.split('.')[0];
					let packages     = this.packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Assimilating Definition "' + definition.id + '".');
						}


						this.__cache.assimilations.push(definition.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Definition "' + definition.id + '" into Package "' + new_pkg_id + '".');
						}


						definition.id = new_pkg_id + '.' + definition.id.split('.').slice(1).join('.');

						for (let i = 0, il = definition._includes.length; i < il; i++) {

							let inc = definition._includes[i];
							if (inc.startsWith(old_pkg_id)) {
								definition._includes[i] = new_pkg_id + inc.substr(old_pkg_id.length);
							}

						}

						for (let r = 0, rl = definition._requires.length; r < rl; r++) {

							let req = definition._requires[r];
							if (req.startsWith(old_pkg_id)) {
								definition._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (_validate_definition.call(this, definition) === true) {

					if (this.debug === true) {
						let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ')') : '.';
						this.global.console.log('lychee.Environment ("' + this.id + '"): Mapping Definition "' + definition.id + '"' + info);
					}

					this.definitions[definition.id] = definition;


					return true;

				}

			}


			let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ').') : '.';
			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Definition "' + definition.id + '"' + info);


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			let cache  = this.__cache;
			let target = this.target;

			if (target !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start       = Date.now();
					cache.timeout     = Date.now() + this.timeout;
					cache.load        = [ target ];
					cache.trace       = [];
					cache.required_by = [];
					cache.active      = true;


					let interval = setInterval(function() {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier = assimilations[a];
									let definition = this.definitions[identifier] || null;
									if (definition !== null) {
										definition.export(this.global);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}.bind(this), (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 10) {

						if (this.debug === true) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(function() {
							this.init(callback);
						}.bind(this), 100);

					} else {

						this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(this.global, null);
						} catch (err) {
							_lychee.Debugger.report(this, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(this.global, null);
			} catch (err) {
				_lychee.Debugger.report(this, err, null);
			}


			return false;

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			let proto = path.split(':')[0] || '';
			if (/^http|https/g.test(proto) === false) {

				if (path.startsWith(_lychee.ROOT.lychee) === false) {

					if (path.startsWith('/')) {
						path = _lychee.ROOT.lychee + path;
					} else {
						path = _lychee.ROOT.project + '/' + path;
					}

				}

			}


			let tmp = path.split('/');

			for (let t = 0, tl = tmp.length; t < tl; t++) {

				if (tmp[t] === '.') {
					tmp.splice(t, 1);
					tl--;
					t--;
				} else if (tmp[t] === '..') {
					tmp.splice(t - 1, 2);
					tl -= 2;
					t  -= 2;
				}

			}

			return tmp.join('/');

		},

		setDebug: function(debug) {

			debug = typeof debug === 'boolean' ? debug : null;


			if (debug !== null) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (let identifier in definitions) {

					let definition = definitions[identifier];
					if (definition instanceof _lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Object ? packages : null;


			if (packages !== null) {

				for (let pid in this.packages) {

					if (pid !== 'lychee') {
						this.packages[pid].setEnvironment(null);
						delete this.packages[pid];
					}

				}


				for (let pid in packages) {

					let pkg = packages[pid];
					if (pkg instanceof _lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Adding Package "' + pkg.id + '".');
						}

						pkg.setEnvironment(this);
						this.packages[pid] = pkg;

					}

				}


				let type = this.type;
				if (/^(export|source)$/g.test(type)) {

					let lychee_pkg = this.packages['lychee'] || null;
					if (lychee_pkg === null) {

						lychee_pkg = new _lychee.Package({
							id:          'lychee',
							url:         '/libraries/lychee/lychee.pkg',
							environment: this
						});

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Package "lychee".');
						}

						this.packages['lychee'] = lychee_pkg;

					}

				}

				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'boolean' ? sandbox : null;


			if (sandbox !== null) {

				if (sandbox !== this.sandbox) {

					this.sandbox = sandbox;


					if (sandbox === true) {

						this.global = new _Sandbox(null, this.tags.platform || null);
						this.global.lychee.setEnvironment(this);

					} else {

						this.global = global;

					}

				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};

				for (let type in tags) {

					let values = tags[type];
					if (values instanceof Array) {

						this.tags[type] = values.filter(function(value) {
							return typeof value === 'string';
						});

					}

				}

				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let type = this.type;
				if (type === 'build') {

					this.target = identifier;

					return true;

				} else {

					let pid = identifier.split('.')[0];
					let pkg = this.packages[pid] || null;
					if (pkg !== null) {

						this.target = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(build|export|source)$/g.test(type)) {

					this.type = type;


					if (type === 'export') {
						type = 'source';
					}


					for (let pid in this.packages) {
						this.packages[pid].setType(type);
					}


					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Environment';
	Composite.prototype.displayName = 'lychee.Environment';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	const lychee = global.lychee;


	/*
	 * HELPERS
	 */

	const _resolve_root = function() {

		let root = this.root;
		let type = this.type;

		if (type === 'build') {
			root += '/build';
		} else if (type === 'review') {
			root += '/review';
		} else if (type === 'source') {
			root += '/source';
		}

		return root;

	};

	const _CORE_MAP = {
		'':              'lychee',
		'Asset':         'Asset',
		'Debugger':      'Debugger',
		'Definition':    'Definition',
		'Environment':   'Environment',
		'Package':       'Package',
		'Simulation':    'Simulation',
		'Specification': 'Specification'
	};

	const _resolve_path = function(candidate) {

		let config = this.config;
		let path   = typeof candidate === 'string' ? candidate.split('/') : null;

		if (config !== null && path !== null) {

			let pointer = config.buffer[this.type].files || null;
			if (pointer !== null) {

				for (let p = 0, pl = path.length; p < pl; p++) {

					let name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}


			return pointer !== null ? true : false;

		}


		return false;

	};

	const _resolve_attachments = function(candidate) {

		let config      = this.config;
		let attachments = {};
		let path        = candidate.split('/');

		if (config !== null && path.length > 0) {

			let pointer = config.buffer.source.files || null;
			if (pointer !== null) {

				for (let pa = 0, pal = path.length; pa < pal; pa++) {

					let name = path[pa];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}


				if (pointer !== null && pointer instanceof Array) {

					let definition_path = _resolve_root.call(this) + '/' + path.join('/');

					for (let po = 0, pol = pointer.length; po < pol; po++) {

						let type = pointer[po];
						if (type !== 'js') {
							attachments[type] = definition_path + '.' + type;
						}

					}

				}

			}

		}


		return attachments;

	};

	const _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		let that          = this;
		let candidatepath = id.split('.').join('/');
		let candidates    = [];
		let filter_values = function(tags, tag) {

			if (tags[tag] instanceof Array) {

				return tags[tag].map(function(value) {
					return _resolve_tag.call(that, tag, value) + '/' + candidatepath;
				}).filter(function(path) {
					return _resolve_path.call(that, path);
				});

			}

			return [];

		};


		if (tags !== null) {

			for (let tag in tags) {

				let values = filter_values(tags, tag);
				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		let core_path = _CORE_MAP[candidatepath] || null;
		if (core_path !== null && this.id === 'lychee' && this.type !== 'source') {

			candidates.push(core_path);

		} else {

			if (_resolve_path.call(this, candidatepath) === true) {
				candidates.push(candidatepath);
			}

		}


		return candidates;

	};

	const _resolve_files = function(node, files, path, extensions) {

		files      = files instanceof Array   ? files : [];
		path       = typeof path === 'string' ? path  : '';
		extensions = extensions === true;


		if (node instanceof Array) {

			if (extensions === true) {

				for (let n = 0, nl = node.length; n < nl; n++) {
					files.push(path + '.' + node[n]);
				}

			} else {

				files.push(path);

			}

		} else if (node instanceof Object) {

			Object.keys(node).forEach(function(child) {

				if (child.includes('__') === false) {
					_resolve_files(node[child], files, path + '/' + child, extensions);
				}

			});

		}

		return files;

	};

	const _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		let config = this.config;

		if (config !== null && tag !== null && value !== null) {

			let pointer = config.buffer[this.type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					let path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	const _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			let map = {
				id:           id,
				candidate:    null,
				candidates:   Array.from(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1,
				type:         this.type
			};


			this.__requests[id] = map;


			let candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				let url            = _resolve_root.call(this) + '/' + candidate + '.js';
				let implementation = new lychee.Asset(url, null, false);
				let attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	const _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		let that       = this;
		let type       = map.type;
		let identifier = this.id + '.' + map.id;
		if (identifier.endsWith('.')) {
			identifier = identifier.substr(0, identifier.length - 1);
		}


		implementation.onload = function(result) {

			map.loading--;


			if (result === true) {

				if (type === 'export' || type === 'source') {

					let environment = that.environment || null;
					if (environment !== null) {

						let definition = environment.definitions[identifier] || null;
						if (definition !== null) {

							map.candidate = this;


							let attachment_ids = Object.keys(attachments);
							if (attachment_ids.length > 0) {

								// Temporarily remove definition to prevent misusage
								delete environment.definitions[identifier];

								map.loading += attachment_ids.length;


								attachment_ids.forEach(function(assetId) {

									let url   = attachments[assetId];
									let asset = new lychee.Asset(url);
									if (asset !== null) {

										asset.onload = function(result) {

											map.loading--;

											let tmp = {};
											if (result === true) {
												tmp[assetId] = this;
											} else {
												tmp[assetId] = null;
											}

											definition.attaches(tmp);


											if (map.loading === 0) {
												environment.definitions[identifier] = definition;
											}

										};

										asset.load();

									} else {

										map.loading--;

									}

								});

							}


							for (let i = 0, il = definition._includes.length; i < il; i++) {
								environment.load(definition._includes[i]);
							}

							for (let r = 0, rl = definition._requires.length; r < rl; r++) {
								environment.load(definition._requires[r]);
							}

						} else {

							// Invalid Definition format
							delete environment.definitions[identifier];

						}

					}

				} else if (type === 'review') {

					let simulation = that.simulation || null;
					if (simulation !== null) {

						let specification = simulation.specifications[identifier] || null;
						if (specification !== null) {

							for (let r = 0, rl = specification._requires.length; r < rl; r++) {
								simulation.load(specification._requires[r]);
							}

						} else {

							// Invalid Specification format
							delete simulation.specifications[identifier];

						}

					}

				}

			}


			that.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(that, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'app';
		this.config      = null;
		this.environment = null;
		this.root        = null;
		this.simulation  = null;
		this.type        = 'source';
		this.url         = null;

		this.__blacklist = {};
		this.__requests  = {};
		this.__warnings  = {};


		this.setId(states.id);
		this.setUrl(states.url);

		this.setEnvironment(states.environment);
		this.setSimulation(states.simulation);
		this.setType(states.type);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.config instanceof Object) {
				this.config = lychee.deserialize(blob.config);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')         states.id   = this.id;
			if (this.type !== 'source') states.type = this.type;
			if (this.url !== '')        states.url  = this.url;


			if (this.config !== null) {
				blob.config = lychee.serialize(this.config);
			}


			return {
				'constructor': 'lychee.Package',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		getDefinitions: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root = buffer[type].files || null;
					if (root !== null) {
						_resolve_files(root, files, '', false);
					}


					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {

											let id = file.substr(1 + prefix.length + 1).split('/').join('.');
											if (filtered.includes(id) === false) {
												filtered.push(id);
											}

										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {

										let id = file.substr(1 + prefix.length + 1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					} else {

						let tags     = [];
						let prefixes = [];
						let pointer  = config.buffer[this.type].tags || null;
						if (pointer !== null) {

							for (let tag in pointer) {

								tags.push(tag);


								let pkg_tags = pointer[tag];
								if (pkg_tags instanceof Object) {

									for (let id in pkg_tags) {

										let prefix = pkg_tags[id] || null;
										if (prefix !== null) {
											prefixes.push(prefix);
										}

									}

								}

							}

						}


						for (let f = 0, fl = files.length; f < fl; f++) {

							let file = files[f];

							for (let p = 0, pl = prefixes.length; p < pl; p++) {

								let prefix = prefixes[p];

								if (file.startsWith('/' + prefix + '/')) {

									let id = file.substr(1 + prefix.length + 1).split('/').join('.');
									if (filtered.includes(id) === false) {
										filtered.push(id);
									}

								} else {

									let untagged = true;

									for (let t = 0, tl = tags.length; t < tl; t++) {

										let tag = tags[t];

										if (file.startsWith('/' + tag)) {
											untagged = false;
											break;
										}

									}

									if (untagged === true) {

										let id = file.substr(1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					}

				}

			}

			return filtered.sort();

		},

		getFiles: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root = buffer[type].files || null;
					if (root !== null) {
						_resolve_files(root, files, '', true);
					}


					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {
											filtered.push(file.substr(1));
										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {
										filtered.push(file.substr(1));
									}

								}

							}

						}

					} else {

						for (let f = 0, fl = files.length; f < fl; f++) {
							filtered.push(files[f].substr(1));
						}

					}

				}

			}

			return filtered.sort();

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config = this.config;

			if (id !== null && config !== null) {

				let request = this.__requests[id] || null;
				if (request === null) {

					let candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						let check = this.__warnings[id] || null;
						if (check === null) {

							if (tags !== null) {
								let info = Object.keys(tags).length > 0 ? (' (' + JSON.stringify(tags) + ')') : '.';
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '"' + info);
							} else {
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '"');
							}

							this.__warnings[id] = 1;

						}

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		resolve: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config   = this.config;
			let filtered = [];

			if (id !== null && config !== null) {

				let candidates = _resolve_candidates.call(this, id, tags);
				if (candidates.length > 0) {

					for (let c = 0, cl = candidates.length; c < cl; c++) {
						filtered.push(candidates[c]);
					}

				}

			}

			return filtered;

		},

		setId: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null && /^([a-z]+)$/g.test(identifier)) {

				this.id = identifier;

				return true;

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null && url.endsWith('/lychee.pkg')) {

				this.config = null;
				this.root   = url.split('/').slice(0, -1).join('/');
				this.url    = url;


				let that   = this;
				let config = new Config(url);

				config.onload = function(result) {

					let buffer = this.buffer || null;
					if (
						buffer !== null
						&& buffer instanceof Object
						&& buffer.build instanceof Object
						&& buffer.review instanceof Object
						&& buffer.source instanceof Object
					) {

						console.info('lychee.Package ("' + that.id + '"): Config "' + this.url + '" ready.');

						that.config = this;

					} else {

						console.error('lychee.Package ("' + that.id + '"): Config "' + this.url + '" corrupt.');

					}

				};

				config.load();


				return true;

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			} else {

				this.environment = null;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = null;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(build|review|source)$/g.test(type)) {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Package';
	Composite.prototype.displayName = 'lychee.Package';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Simulation = typeof lychee.Simulation !== 'undefined' ? lychee.Simulation : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * HELPERS
	 */

	const _get_debug = function() {

		let debug       = _lychee.debug;
		let environment = this.environment;
		if (environment !== null) {
			debug = environment.debug;
		}

		return debug;

	};

	const _get_console = function() {

		let console     = _console;
		let environment = this.environment;
		if (environment !== null) {
			console = environment.global.console;
		}

		return console;

	};

	const _get_global = function() {

		let pointer     = global;
		let environment = this.environment;
		if (environment !== null) {
			pointer = environment.global;
		}

		return pointer;

	};

	const _build_loop = function(cache) {

		let load  = cache.load;
		let trace = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier    = load[l];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				load.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				let dependencies = _resolve_dependencies.call(this, specification);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							this.load(dependency);
							load.push(dependency);

						}

					}

				} else {

					specification.export(this.sandboxes);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;
		let sandboxes   = this.sandboxes;


		if (debug === true) {
			console.info('lychee.Simulation ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(environment.global, sandboxes);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;


		if (debug === true) {
			console.warn('lychee.Simulation ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		if (cache.load.length > 0) {

			console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map(function(value) {
				return '\t - ' + value;
			}).join('\n') + '.');

		}


		try {
			callback.call(environment.global, null);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _resolve_dependencies = function(specification) {

		let dependencies = [];

		if (specification instanceof _lychee.Specification) {

			for (let r = 0, rl = specification._requires.length; r < rl; r++) {

				let req   = specification._requires[r];
				let check = _resolve.call(this.sandboxes, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id             = 'lychee-Simulation-' + _id++;
		this.environment    = null;
		this.specifications = {};
		this.target         = 'app.Main';
		this.timeout        = 10000;

		this.sandboxes  = {};
		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         []
		};
		this.__packages = {};


		this.setId(states.id);
		this.setSpecifications(states.specifications);
		this.setEnvironment(states.environment);

		this.setTarget(states.target);
		this.setTimeout(states.timeout);


		states = null;

	};


	Composite.prototype = {

		deserialize: function(blob) {

			if (blob.specifications instanceof Object) {

				for (let id in blob.specifications) {
					this.specifications[id] = lychee.deserialize(blob.specifications[id]);
				}

			}

			if (blob.environment instanceof Object) {
				this.setEnvironment(lychee.deserialize(blob.environment));
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')             states.id      = this.id;
			if (this.target !== 'app.Main') states.target  = this.target;
			if (this.timeout !== 10000)     states.timeout = this.timeout;


			if (Object.keys(this.specifications).length > 0) {

				blob.specifications = {};

				for (let sid in this.specifications) {
					blob.specifications[sid] = lychee.serialize(this.specifications[sid]);
				}

			}


			return {
				'constructor': 'lychee.Simulation',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let specification = this.specifications[identifier] || null;
				if (specification !== null) {

					return true;

				} else {

					let pkg = this.__packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id);
						if (result === true) {

							let debug = _get_debug.call(this);
							if (debug === true) {
								console.log('lychee.Simulation ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		specify: function(specification, inject) {

			specification = specification instanceof lychee.Specification ? specification : null;
			inject        = inject === true;


			let console = _get_console.call(this);
			let debug   = _get_debug.call(this);


			if (specification !== null) {

				let url = specification.url || null;
				if (url !== null && inject === false) {

					let old_pkg_id   = specification.id.split('.')[0];
					let new_pkg_id   = null;
					let assimilation = true;


					let packages = this.__packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Assimilating Specification "' + specification.id + '".');
						}


						this.__cache.assimilations.push(specification.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Injecting Specification "' + specification.id + '" into Package "' + new_pkg_id + '".');
						}


						specification.id = new_pkg_id + '.' + specification.id.split('.').slice(1).join('.');

						for (let r = 0, rl = specification._requires.length; r < rl; r++) {

							let req = specification._requires[r];
							if (req.startsWith(old_pkg_id)) {
								specification._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (debug === true) {
					console.log('lychee.Simulation ("' + this.id + '"): Mapping Specification "' + specification.id + '".');
				}


				this.specifications[specification.id] = specification;


				return true;

			}


			console.error('lychee.Simulation ("' + this.id + '"): Invalid Specification "' + specification.id + '".');


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : null;


			let cache       = this.__cache;
			let console     = _get_console.call(this);
			let debug       = _get_debug.call(this);
			let environment = this.environment;
			let target      = this.target;


			if (debug === true) {
				global.lychee.SIMULATIONS[this.id] = this;
			}


			if (target !== null && environment !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (debug === true) {
						console.info('lychee.Simulation ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ target ];
					cache.trace   = [];
					cache.active  = true;


					let interval = setInterval(function() {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier    = assimilations[a];
									let specification = this.specifications[identifier] || null;
									if (specification !== null) {
										specification.export(this.sandboxes);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}.bind(this), (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 3) {

						if (debug === true) {
							console.warn('lychee.Simulation ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(function() {
							this.init(callback);
						}.bind(this), 100);

					} else {

						console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(environment.global || null, null);
						} catch (err) {
							_lychee.Debugger.report(environment, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(environment.global || null, null);
			} catch (err) {
				_lychee.Debugger.report(environment, err, null);
			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.__packages  = {};

				for (let pid in environment.packages) {

					let pkg = environment.packages[pid];

					this.__packages[pid] = new lychee.Package({
						id:         pkg.id,
						url:        pkg.url,
						type:       'review',
						simulation: this
					});

				}

				return true;

			} else {

				this.environment = null;
				this.__packages  = {};

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setSpecifications: function(specifications) {

			specifications = specifications instanceof Object ? specifications : null;


			if (specifications !== null) {

				for (let identifier in specifications) {

					let specification = specifications[identifier];
					if (specification instanceof lychee.Specification) {
						this.specifications[identifier] = specification;
					}

				}


				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let pid = identifier.split('.')[0];
				let pkg = this.__packages[pid] || null;
				if (pkg !== null) {

					this.target = identifier;

					return true;
				}

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		}

	};


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Specification = typeof lychee.Specification !== 'undefined' ? lychee.Specification : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('review');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _assert = function(a, b) {

		let result = lychee.diff(a, b);
		if (result === false) {
			this.results.ok++;
		}

		this.results.all++;

	};

	const _expect = function(assert, callback) {

		this._expect++;


		let that = this;

		callback(function(a, b) {
			that._expect--;
			assert(a, b);
		});

	};

	const _Sandbox = function(identifier) {

		this._IDENTIFIER = identifier || null;
		this._INSTANCE   = null;

		this.blob       = {};
		this.states     = {};
		this.properties = {};
		this.enums      = {};
		this.events     = {};
		this.methods    = {};

	};

	_Sandbox.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.instance instanceof Object) {
				this._INSTANCE = lychee.deserialize(blob.instance);
			}

			if (blob.states instanceof Object) {
				this.states = lychee.deserialize(blob.states);
			}

			if (blob.properties instanceof Object) {

				for (let p in blob.properties) {
					this.properties[p] = lychee.deserialize(blob.properties[p]);
				}

			}

			if (blob.enums instanceof Object) {

				for (let e in blob.enums) {
					this.enums[e] = lychee.deserialize(blob.enums[e]);
				}

			}

			if (blob.events instanceof Object) {

				for (let e in blob.events) {
					this.events[e] = lychee.deserialize(blob.events[e]);
				}

			}

			if (blob.methods instanceof Object) {

				for (let m in blob.methods) {
					this.methods[m] = lychee.deserialize(blob.methods[m]);
				}

			}

		},

		serialize: function() {

			let blob = {};


			if (Object.keys(this.states).length > 0) {
				blob.states = lychee.serialize(this.states);
			}

			if (Object.keys(this.properties).length > 0) {

				blob.properties = {};

				for (let p in this.properties) {
					blob.properties[p] = lychee.serialize(this.properties[p]);
				}

			}

			if (Object.keys(this.enums).length > 0) {

				blob.enums = {};

				for (let e in this.enums) {
					blob.enums[e] = lychee.serialize(this.enums[e]);
				}

			}

			if (Object.keys(this.events).length > 0) {

				blob.events = {};

				for (let e in this.events) {
					blob.events[e] = lychee.serialize(this.events[e]);
				}

			}

			if (Object.keys(this.methods).length > 0) {

				blob.methods = {};

				for (let m in this.methods) {
					blob.methods[m] = lychee.serialize(this.methods[m]);
				}

			}


			if (this._INSTANCE !== null) {
				blob.instance = lychee.serialize(this._INSTANCE);
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ this._IDENTIFIER ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		evaluate: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let statistics = {
					properties: {},
					enums:      {},
					events:     {},
					methods:    {}
				};


				if (this._IDENTIFIER !== null) {

					let Definition = lychee.import(this._IDENTIFIER);
					if (Definition !== null) {

						if (Definition.prototype instanceof Object) {

							this._INSTANCE = new Definition(this.states);

							if (
								Object.keys(this.blob).length > 0
								&& typeof this._INSTANCE.deserialize === 'function'
							) {
								this._INSTANCE.deserialize(this.blob);
							}

						} else {
							this._INSTANCE = Definition;
						}

					}


					if (this._INSTANCE !== null) {

						for (let id in this.properties) {

							statistics.properties[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.properties[id]);
							let expect = _expect.bind(statistics.properties[id], assert);

							this.properties[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.enums) {

							statistics.enums[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.enums[id]);
							let expect = _expect.bind(statistics.enums[id], assert);

							this.enums[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.events) {

							statistics.events[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.events[id]);
							let expect = _expect.bind(statistics.events[id], assert);

							this.events[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.methods) {

							statistics.methods[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.methods[id]);
							let expect = _expect.bind(statistics.methods[id], assert);

							this.methods[id].call(this._INSTANCE, assert, expect);

						}


						let timeout  = Date.now() + 5000;
						let interval = setInterval(function() {

							if (Date.now() > timeout) {

								clearInterval(interval);
								interval = null;

								callback(statistics);

							} else {

								let stop = true;

								for (let type in statistics) {

									for (let id in statistics[type]) {

										if (statistics[type][id]._expect > 0) {
											stop = false;
											break;
										}

									}

								}

								if (stop === true) {

									clearInterval(interval);
									interval = null;

									callback(statistics);

								}

							}

						}.bind(this), 500);

					} else {

						if (callback !== null) {
							callback(null);
						}

					}

				} else {

					if (callback !== null) {
						callback(null);
					}

				}

			}

		},

		setBlob: function(blob) {

			blob = blob instanceof Object ? blob : null;


			if (blob !== null) {

				this.blob = blob;

				return true;

			}


			return false;

		},

		setStates: function(states) {

			states = states instanceof Object ? states : null;


			if (states !== null) {

				this.states = states;

				return true;

			}


			return false;

		},

		setEnum: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.enums[name] = callback;

				return true;

			}


			return false;

		},

		setEvent: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.events[name] = callback;

				return true;

			}


			return false;

		},

		setMethod: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.methods[name] = callback;

				return true;

			}


			return false;

		},

		setProperty: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.properties[name] = callback;

				return true;

			}


			return false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._requires = [];
		this._exports  = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}


			let index1   = 0;
			let index2   = 0;
			let tmp      = null;
			let bindargs = null;

			if (typeof blob.exports === 'string') {

				// Function head
				tmp      = blob.exports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.exports.indexOf('{') + 1;
				index2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(index1, index2 - index1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;

			if (this._requires.length > 0)         blob.requires = this._requires.slice(0);
			if (this._exports instanceof Function) blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Specification',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Specification: Injecting Identifier "' + fuzzed + '" (' + this.url + ')');

						return true;

					} else {

						console.error('lychee.Specification: Invalid Identifier "' + id + '" (' + this.url + ')');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		export: function(sandboxes) {

			sandboxes = sandboxes instanceof Object ? sandboxes : global;


			let check = _resolve.call(sandboxes, this.id);
			if (check === null) {

				if (this._exports !== null) {

					let requires = this._requires.map(function(id) {
						return _resolve.call(sandboxes, id);
					});


					if (requires.includes(null) === false) {

						let id        = this.id;
						let namespace = _resolve.call(sandboxes, id.split('.').slice(0, -1).join('.'));
						let name      = id.split('.').pop();
						let sandbox   = new _Sandbox(id);


						try {
							this._exports.call(
								this._exports,
								lychee,
								sandbox
							) || null;
						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						namespace[name] = sandbox;


						return true;

					} else {

						let invalid_requires = this._requires.filter(function(id, r) {
							return requires[r] === null;
						});

						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Specification ("' + this.id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}

			}


			return false;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._exports = callback;
			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						let is_namespace  = definition === definition.toLowerCase();

						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						} else if (is_namespace === true) {
							this._requires.push(definition);
						}

					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Specification';
	Composite.prototype.displayName = 'lychee.Specification';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


["html","html-nwjs","html-webview","nidium","node","node-sdl"].forEach(function(platform) {
	if (lychee.PLATFORMS.includes(platform) === false) {
		lychee.PLATFORMS.push(platform);
	}
});


(function(lychee, global) {

	let has_console = 'console' in global && typeof console !== 'undefined';
	if (has_console === false) {
		console = {};
	}

	const  _clear   = console.clear || function() {};
	const  _log     = console.log   || function() {};
	const  _info    = console.info  || console.log;
	const  _warn    = console.warn  || console.log;
	const  _error   = console.error || console.log;
	let    _std_out = '';
	let    _std_err = '';



	/*
	 * HELPERS
	 */

	const _INDENT         = '    ';
	const _args_to_string = function(args) {

		let output = [];

		for (let a = 0, al = args.length; a < al; a++) {

			let value = args[a];
			let o     = 0;

			if (typeof value === 'function') {

				let tmp = (value).toString().split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t]);
				}

				o = output.length - 1;

			} else if (value instanceof Object) {

				let tmp = [];

				try {

					let cache = [];

					tmp = JSON.stringify(value, function(key, value) {

						if (value instanceof Object) {

							if (cache.indexOf(value) === -1) {
								cache.push(value);
								return value;
							} else {
								return undefined;
							}

						} else {
							return value;
						}

					}, _INDENT).split('\n');

				} catch (err) {
				}

				if (tmp.length > 1) {

					for (let t = 0, tl = tmp.length; t < tl; t++) {
						output.push(tmp[t]);
					}

					o = output.length - 1;

				} else {

					let chunk = output[o];
					if (chunk === undefined) {
						output[o] = tmp[0].trim();
					} else {
						output[o] = (chunk + ' ' + tmp[0]).trim();
					}

				}

			} else if (typeof value === 'string' && value.includes('\n')) {

				let tmp = value.split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t]);
				}

				o = output.length - 1;

			} else {

				let chunk = output[o];
				if (chunk === undefined) {
					output[o] = ('' + value).replace(/\t/g, _INDENT).trim();
				} else {
					output[o] = (chunk + (' ' + value).replace(/\t/g, _INDENT)).trim();
				}

			}

		}


		let ol = output.length;
		if (ol > 1) {
			return output.join('\n');
		} else {
			return output[0];
		}

	};



	/*
	 * IMPLEMENTATION
	 */

	console.clear = function() {
		_clear.call(console);
	};

	console.log = function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		_log.apply(console, args);

	};

	console.info = function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		_info.apply(console, args);

	};

	console.warn = function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		_warn.apply(console, args);

	};

	console.error = function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_err += _args_to_string(args) + '\n';

		_error.apply(console, args);

	};

	console.deserialize = function(blob) {

		if (typeof blob.stdout === 'string') {
			_std_out = blob.stdout;
		}

		if (typeof blob.stderr === 'string') {
			_std_err = blob.stderr;
		}

	};

	console.serialize = function() {

		let blob = {};


		if (_std_out.length > 0) blob.stdout = _std_out;
		if (_std_err.length > 0) blob.stderr = _std_err;


		return {
			'reference': 'console',
			'blob':      Object.keys(blob).length > 0 ? blob : null
		};

	};



	/*
	 * EASTER EGG
	 */

	(function(log, console) {

		let ver = lychee.VERSION;
		let css = [
			'font-family:monospace;color:#405050;background:#405050',
			'font-family:monospace;color:#ffffff;background:#405050',
			'font-family:monospace;color:#d0494b;background:#405050'
		];

		let is_chrome  = /Chrome/g.test(navigator.userAgent.split(' ').slice(-2, -1)[0] || '');
		let is_opera   = /OPR/g.test(navigator.userAgent.split(' ').slice(-1) || '');
		let is_safari  = /AppleWebKit/g.test(navigator.userAgent);
		let is_firefox = !!(console.firebug || console.exception);


		if (is_chrome || is_opera) {

			log.call(console, '%c\u2588\u2588\u2588\u2588\u2588%c\u2584\u2584%c\u2588\u2588\u2588\u2588\u2588 %clychee.%cjs%c ' + ver + '     ', css[0], css[2], css[0], css[1], css[2], css[1]);
			log.call(console, '%c\u2588%c\u2580\u2584\u2584%c\u2588%c\u2580\u2580%c\u2588%c\u2584\u2584\u2580%c\u2588 %cIsomorphic Engine     ', css[0], css[1], css[0], css[2], css[0], css[1], css[0], css[1]);
			log.call(console, '%c\u2588%c\u2584\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2584%c\u2588 %chttps://lychee.js.org ',         css[0], css[1], css[0], css[1]);

		} else if (is_firefox || is_safari) {

			log.call(console, '%c\u2588\u2588\u2588\u2588\u2588%c\u2584\u2584%c\u2588\u2588\u2588\u2588\u2588 %clychee.%cjs%c ' + ver + '     ', css[0], css[2], css[0], css[1], css[2], css[1]);
			log.call(console, '%c\u2588%c\u2580\u2584\u2584%c\u2588%c\u2580\u2580%c\u2588%c\u2584\u2584\u2580%c\u2588 %cIsomorphic Engine     ', css[0], css[1], css[0], css[2], css[0], css[1], css[0], css[1]);
			log.call(console, '%c\u2588%c\u2584\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2584%c\u2588 %chttps://lychee.js.org ',         css[0], css[1], css[0], css[1]);

			log.call(console, '%c                                     ', css[1]);
			log.call(console, '%c   Please use Chrome/Chromium/Opera  ', css[1]);
			log.call(console, '%c   We recommend the Blink Dev Tools  ', css[1]);
			log.call(console, '%c                                     ', css[1]);

		} else {

			log.call(console, 'lychee.js ' + ver);
			log.call(console, 'Isomorphic Engine');
			log.call(console, '');
			log.call(console, 'Please use Chrome/Chromium/Opera');
			log.call(console, 'We recommend the Blink Dev Tools');
			log.call(console, '');

		}

	})(_log, console);

})(this.lychee, this);


(function(lychee, global) {

	const _document = global.document;


	(function(location, selfpath) {

		let origin   = location.origin || '';
		let cwd      = (location.pathname || '');
		let protocol = origin.split(':')[0];


		// Hint: CDNs might have no proper redirect to index.html
		if (/\.(htm|html)$/g.test(cwd.split('/').pop()) === true) {
			cwd = cwd.split('/').slice(0, -1).join('/');
		}


		if (/^(http|https)$/g.test(protocol)) {

			// Hint: The harvester (HTTP server) understands
			// /projects/* and /libraries/* requests.

			lychee.ROOT.lychee = '';


			if (cwd !== '') {
				lychee.ROOT.project = cwd === '/' ? '' : cwd;
			}

		} else if (/^(app|file|chrome-extension)$/g.test(protocol)) {

			let tmp1 = selfpath.indexOf('/libraries/lychee');
			let tmp2 = selfpath.indexOf('://');

			if (tmp1 !== -1 && tmp2 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1).substr(tmp2 + 3);
			} else if (tmp1 !== -1) {
				lychee.ROOT.lychee = selfpath.substr(0, tmp1);
			}


			let tmp3 = selfpath.split('/').slice(0, 3).join('/');
			if (tmp3.startsWith('/opt/lycheejs')) {
				lychee.ROOT.lychee = tmp3;
			}

			if (cwd !== '') {
				lychee.ROOT.project = cwd;
			}

		}

	})(global.location || {}, (_document.currentScript || {}).src || '');



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		const _buffer_cache = {};
		const _load_buffer  = function(url) {

			let cache = _buffer_cache[url] || null;
			if (cache === null) {

				let xhr = new XMLHttpRequest();

				xhr.open('GET', url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function() {
					cache = _buffer_cache[url] = Buffer.from(xhr.response);
				};
				xhr.onerror = xhr.ontimeout = function() {
					cache = _buffer_cache[url] = Buffer.alloc(0);
				};
				xhr.send(null);

			}

			return cache;

		};


		let audio = 'Audio' in global && typeof Audio !== 'undefined';
		if (audio === false) {

			Audio = function() {

				this.src         = '';
				this.currentTime = 0;
				this.volume      = 0;
				this.autobuffer  = false;
				this.preload     = false;

				this.onload  = null;
				this.onerror = null;

			};


			Audio.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				},

				play: function() {

				},

				pause: function() {

				},

				addEventListener: function() {

				}

			};

		}


		Audio.prototype.toString = function(encoding) {

			if (encoding === 'base64' || encoding === 'binary') {

				let url = this.src;
				if (url !== '' && url.startsWith('data:') === false) {

					let buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString(encoding);
					}

				}


				let index = url.indexOf('base64,') + 7;
				if (index > 7) {

					let tmp = url.substr(index, url.length - index);
					if (tmp.length > 0) {
						return Buffer.from(tmp, 'base64').toString(encoding);
					}

				}


				return '';

			}


			return Object.prototype.toString.call(this);

		};


		let image = 'Image' in global && typeof Image !== 'undefined';
		if (image === false) {

			Image = function() {

				this.src    = '';
				this.width  = 0;
				this.height = 0;

				this.onload  = null;
				this.onerror = null;

			};


			Image.prototype = {

				load: function() {

					if (this.onerror !== null) {
						this.onerror.call(this);
					}

				}

			};

		}


		Image.prototype.toString = function(encoding) {

			if (encoding === 'base64' || encoding === 'binary') {

				let url = this.src;
				if (url !== '' && url.startsWith('data:') === false) {

					let buffer = _load_buffer(url);
					if (buffer !== null) {
						return buffer.toString(encoding);
					}

				}


				let index = url.indexOf('base64,') + 7;
				if (index > 7) {

					let tmp = url.substr(index, url.length - index);
					if (tmp.length > 0) {
						return Buffer.from(tmp, 'base64').toString(encoding);
					}

				}


				return '';

			}


			return Object.prototype.toString.call(this);

		};

	})();



	/*
	 * EXPORTS
	 */

	Object.defineProperty(lychee, 'FILENAME', {

		get: function() {

			let script = _document.currentScript || null;
			if (script !== null) {
				return script._filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});

})(this.lychee, this);


(function(lychee, global) {

	/*
	 * HELPERS
	 */

	const _coerce = function(num) {
		num = ~~Math.ceil(+num);
		return num < 0 ? 0 : num;
	};

	const _clean_base64 = function(str) {

		str = str.trim().replace(/[^+/0-9A-z]/g, '');

		while (str.length % 4 !== 0) {
			str = str + '=';
		}

		return str;

	};

	const _utf8_to_bytes = function(str) {

		let bytes = [];

		for (let s = 0; s < str.length; s++) {

			let byt = str.charCodeAt(s);
			if (byt <= 0x7F) {
				bytes.push(byt);
			} else {

				let start = s;
				if (byt >= 0xD800 && byt <= 0xDFF) s++;

				let tmp = encodeURIComponent(str.slice(start, s + 1)).substr(1).split('%');
				for (let t = 0; t < tmp.length; t++) {
					bytes.push(parseInt(tmp[t], 16));
				}

			}

		}

		return bytes;

	};

	const _decode_utf8_char = function(str) {

		try {
			return decodeURIComponent(str);
		} catch (err) {
			return String.fromCharCode(0xFFFD);
		}

	};

	const _utf8_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';
		let tmp = '';

		for (let b = start; b < end; b++) {

			if (buffer[b] <= 0x7F) {
				str += _decode_utf8_char(tmp) + String.fromCharCode(buffer[b]);
				tmp = '';
			} else {
				tmp += '%' + buffer[b].toString(16);
			}

		}

		return str + _decode_utf8_char(tmp);

	};

	const _decode_base64 = (function() {

		const _PLUS   = '+'.charCodeAt(0);
		const _SLASH  = '/'.charCodeAt(0);
		const _NUMBER = '0'.charCodeAt(0);
		const _LOWER  = 'a'.charCodeAt(0);
		const _UPPER  = 'A'.charCodeAt(0);

		return function(elt) {

			let code = elt.charCodeAt(0);

			if (code === _PLUS)        return 62;
			if (code === _SLASH)       return 63;
			if (code  <  _NUMBER)      return -1;
			if (code  <  _NUMBER + 10) return code - _NUMBER + 26 + 26;
			if (code  <  _UPPER  + 26) return code - _UPPER;
			if (code  <  _LOWER  + 26) return code - _LOWER  + 26;

		};

	})();

	const _base64_to_bytes = function(str) {

		if (str.length % 4 === 0) {

			let length       = str.length;
			let placeholders = '=' === str.charAt(length - 2) ? 2 : '=' === str.charAt(length - 1) ? 1 : 0;

			let bytes = new Array(length * 3 / 4 - placeholders);
			let l     = placeholders > 0 ? str.length - 4 : str.length;

			let tmp;
			let b = 0;
			let i = 0;

			while (i < l) {

				tmp = (_decode_base64(str.charAt(i)) << 18) | (_decode_base64(str.charAt(i + 1)) << 12) | (_decode_base64(str.charAt(i + 2)) << 6) | (_decode_base64(str.charAt(i + 3)));

				bytes[b++] = (tmp & 0xFF0000) >> 16;
				bytes[b++] = (tmp & 0xFF00)   >>  8;
				bytes[b++] =  tmp & 0xFF;

				i += 4;

			}


			if (placeholders === 2) {

				tmp = (_decode_base64(str.charAt(i)) << 2)  | (_decode_base64(str.charAt(i + 1)) >> 4);

				bytes[b++] = tmp        & 0xFF;

			} else if (placeholders === 1) {

				tmp = (_decode_base64(str.charAt(i)) << 10) | (_decode_base64(str.charAt(i + 1)) << 4) | (_decode_base64(str.charAt(i + 2)) >> 2);

				bytes[b++] = (tmp >> 8) & 0xFF;
				bytes[b++] =  tmp       & 0xFF;

			}


			return bytes;

		}


		return [];

	};

	const _encode_base64 = (function() {

		const _TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		return function(num) {
			return _TABLE.charAt(num);
		};

	})();

	const _base64_to_string = function(buffer, start, end) {

		let bytes      = buffer.slice(start, end);
		let extrabytes = bytes.length % 3;
		let l          = bytes.length - extrabytes;
		let str        = '';


		let tmp;

		for (let i = 0; i < l; i += 3) {

			tmp = (bytes[i] << 16) + (bytes[i + 1] << 8) + (bytes[i + 2]);

			str += (_encode_base64(tmp >> 18 & 0x3F) + _encode_base64(tmp >> 12 & 0x3F) + _encode_base64(tmp >> 6 & 0x3F) + _encode_base64(tmp & 0x3F));

		}


		if (extrabytes === 2) {

			tmp = (bytes[bytes.length - 2] << 8) + (bytes[bytes.length - 1]);

			str += _encode_base64(tmp >> 10);
			str += _encode_base64((tmp >> 4) & 0x3F);
			str += _encode_base64((tmp << 2) & 0x3F);
			str += '=';

		} else if (extrabytes === 1) {

			tmp = bytes[bytes.length - 1];

			str += _encode_base64(tmp >> 2);
			str += _encode_base64((tmp << 4) & 0x3F);
			str += '==';

		}


		return str;

	};

	const _binary_to_bytes = function(str) {

		let bytes = [];

		for (let s = 0; s < str.length; s++) {
			bytes.push(str.charCodeAt(s) & 0xFF);
		}

		return bytes;

	};

	const _binary_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';

		for (let b = start; b < end; b++) {
			str += String.fromCharCode(buffer[b]);
		}

		return str;

	};

	const _hex_to_string = function(buffer, start, end) {

		end = Math.min(buffer.length, end);


		let str = '';

		for (let b = start; b < end; b++) {
			str += String.fromCharCode(buffer[b]);
		}

		return str;

	};

	const _copy_buffer = function(source, target, offset, length) {

		let i = 0;

		for (i = 0; i < length; i++) {

			if (i + offset >= target.length) break;
			if (i >= source.length)          break;

			target[i + offset] = source[i];

		}

		return i;

	};

	const _copy_hexadecimal = function(source, target, offset, length) {

		let strlen = source.length;
		if (strlen % 2 !== 0) {
			throw new Error('Invalid hex string');
		}

		if (length > strlen / 2) {
			length = strlen / 2;
		}


		let i = 0;

		for (i = 0; i < length; i++) {

			let num = parseInt(source.substr(i * 2, 2), 16);
			if (isNaN(num)) {
				return i;
			}

			target[i + offset] = num;

		}


		return i;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Buffer = function(subject, encoding) {

		let type = typeof subject;
		if (type === 'string' && encoding === 'base64') {
			subject = _clean_base64(subject);
		}


		this.length = 0;


		if (type === 'string') {

			this.length = Buffer.byteLength(subject, encoding);

			this.write(subject, 0, encoding);

		} else if (type === 'number') {

			this.length = _coerce(subject);

			for (let n = 0; n < this.length; n++) {
				this[n] = 0;
			}

		} else if (Buffer.isBuffer(subject)) {

			this.length = subject.length;

			for (let b = 0; b < this.length; b++) {
				this[b] = subject[b];
			}

		}


		return this;

	};

	Buffer.alloc = function(size, fill, encoding) {

		size     = typeof size === 'number'     ? size     : 0;
		encoding = typeof encoding === 'string' ? encoding : 'utf8';


		let buffer = new Buffer(size);


		if (typeof fill === 'string') {

			let other = Buffer.from(fill, encoding);
			let ol    = other.length;

			for (let b = 0, bl = buffer.length; b < bl; b++) {
				buffer[b] = other[b % ol];
			}

		} else if (typeof fill === 'number') {

			for (let b = 0, bl = buffer.length; b < bl; b++) {
				buffer[b] = fill & 0xff;
			}

		} else if (fill instanceof Buffer) {

			let fl = fill.length;

			for (let b = 0, bl = buffer.length; b < bl; b++) {
				buffer[b] = fill[b % fl];
			}

		} else {

			for (let b = 0, bl = buffer.length; b < bl; b++) {
				buffer[b] = 0;
			}

		}


		return buffer;

	};

	Buffer.byteLength = function(str, encoding) {

		str      = typeof str === 'string'      ? str      : '';
		encoding = typeof encoding === 'string' ? encoding : 'utf8';


		let length = 0;

		if (encoding === 'utf8') {
			length = _utf8_to_bytes(str).length;
		} else if (encoding === 'base64') {
			length = _base64_to_bytes(str).length;
		} else if (encoding === 'binary') {
			length = str.length;
		} else if (encoding === 'hex') {
			length = str.length >>> 1;
		}


		return length;

	};

	Buffer.from = function(subject, encoding) {

		encoding = typeof encoding === 'string' ? encoding : 'utf8';


		if (subject instanceof ArrayBuffer) {

			let tmp    = new Uint8Array(subject);
			let length = tmp.length;
			let buffer = new Buffer(length);

			for (let b = 0; b < length; b++) {
				buffer[b] = tmp[b];
			}

			return buffer;

		} else if (subject instanceof Buffer) {

			let length = subject.length;
			let buffer = new Buffer(length);

			for (let b = 0; b < length; b++) {
				buffer[b] = subject[b];
			}

			return buffer;

		} else if (subject instanceof Array) {

			let length = typeof subject.length === 'number' ? (subject.length | 0) : 0;
			let buffer = new Buffer(length);

			for (let b = 0; b < length; b++) {
				buffer[b] = subject[b] & 0xff;
			}

			return buffer;

		} else if (typeof subject === 'string' && encoding !== null) {

			let length = Buffer.byteLength(subject, encoding);
			let buffer = new Buffer(length);

			buffer.write(subject, 0, encoding);

			return buffer;

		}


		return null;

	};

	Buffer.isBuffer = function(buffer) {

		if (buffer instanceof Buffer) {
			return true;
		}

		return false;

	};

	Buffer.prototype = {

		serialize: function() {

			return {
				'constructor': 'Buffer',
				'arguments':   [ this.toString('base64'), 'base64' ]
			};

		},

		copy: function(target, target_start, start, end) {

			target_start = typeof target_start === 'number' ? (target_start | 0) : 0;
			start        = typeof start === 'number'        ? (start | 0)        : 0;
			end          = typeof end === 'number'          ? (end   | 0)        : this.length;


			if (start === end)       return;
			if (target.length === 0) return;
			if (this.length === 0)   return;


			end = Math.min(end, this.length);

			let diff        = end - start;
			let target_diff = target.length - target_start;
			if (target_diff < diff) {
				end = target_diff + start;
			}


			for (let b = 0; b < diff; b++) {
				target[b + target_start] = this[b + start];
			}

		},

		map: function(callback) {

			callback = callback instanceof Function ? callback : null;


			let clone = Buffer.alloc(this.length);

			if (callback !== null) {

				for (let b = 0; b < this.length; b++) {
					clone[b] = callback(this[b], b);
				}

			} else {

				for (let b = 0; b < this.length; b++) {
					clone[b] = this[b];
				}

			}

			return clone;

		},

		slice: function(start, end) {

			let length = this.length;

			start = typeof start === 'number' ? (start | 0) : 0;
			end   = typeof end === 'number'   ? (end   | 0) : length;

			start = Math.min(start, length);
			end   = Math.min(end,   length);


			let diff  = end - start;
			let clone = Buffer.alloc(diff);

			for (let b = 0; b < diff; b++) {
				clone[b] = this[b + start];
			}

			return clone;

		},

		write: function(str, offset, length, encoding) {

			offset   = typeof offset === 'number'   ? offset   : 0;
			encoding = typeof encoding === 'string' ? encoding : 'utf8';


			let remaining = this.length - offset;
			if (typeof length === 'string') {
				encoding = length;
				length   = remaining;
			}

			if (length > remaining) {
				length = remaining;
			}


			let diff = 0;

			if (encoding === 'utf8') {
				diff = _copy_buffer(_utf8_to_bytes(str),   this, offset, length);
			} else if (encoding === 'base64') {
				diff = _copy_buffer(_base64_to_bytes(str), this, offset, length);
			} else if (encoding === 'binary') {
				diff = _copy_buffer(_binary_to_bytes(str), this, offset, length);
			} else if (encoding === 'hex') {
				diff = _copy_hexadecimal(str, this, offset, length);
			}


			return diff;

		},

		toString: function(encoding, start, end) {

			encoding = typeof encoding === 'string' ? encoding : 'utf8';
			start    = typeof start === 'number'    ? start    : 0;
			end      = typeof end === 'number'      ? end      : this.length;


			if (start === end) {
				return '';
			}


			let str = '';

			if (encoding === 'utf8') {
				str = _utf8_to_string(this,   start, end);
			} else if (encoding === 'base64') {
				str = _base64_to_string(this, start, end);
			} else if (encoding === 'binary') {
				str = _binary_to_string(this, start, end);
			} else if (encoding === 'hex') {
				str = _hex_to_string(this, start, end);
			}


			return str;

		}

	};


	global.Buffer = Buffer;

})(this.lychee, this);


(function(lychee, global) {

	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});



	/*
	 * HELPERS
	 */

	const _CONFIG_CACHE = {};

	const _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_CONFIG_CACHE[url] !== undefined) {
				_clone_config(_CONFIG_CACHE[url], this);
			} else {
				_CONFIG_CACHE[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {

				let tmp1 = JSON.stringify(this.buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);
			let xhr  = new XMLHttpRequest();

			if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
				xhr.open('GET', _protocol + '://' + path, true);
			} else {
				xhr.open('GET', path, true);
			}

			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');

			xhr.onload = function() {

				let data = null;

				try {
					data = JSON.parse(xhr.responseText);
				} catch (err) {
				}

				this.buffer = data;
				this.__load = false;

				if (data === null) {

					console.warn('Invalid Config at "' + this.url + '" (No JSON file).');

					if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
						console.warn(_protocol + '://' + path);
					} else {
						console.warn(path);
					}

				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}.bind(this);

			xhr.onerror = xhr.ontimeout = function() {

				this.buffer = null;
				this.__load = false;

				console.warn('Invalid Config at "' + this.url + '" (No JSON file).');

				if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
					console.warn(_protocol + '://' + path);
				} else {
					console.warn(path);
				}

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}.bind(this);

			xhr.send(null);

		}

	};


	global.Config = Config;

})(this.lychee, this);


(function(lychee, global) {

	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});



	/*
	 * HELPERS
	 */

	const _parse_font = function() {

		let data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			let texture = new Texture(data.texture);
			let that    = this;

			texture.onload = function() {
				that.texture = this;
			};

			texture.load();

		} else {

			console.warn('Invalid Font at "' + this.url + '" (No FNT file).');

		}


		this.baseline   = typeof data.baseline === 'number'   ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'    ? data.charset    : this.charset;
		this.lineheight = typeof data.lineheight === 'number' ? data.lineheight : this.lineheight;
		this.kerning    = typeof data.kerning === 'number'    ? data.kerning    : this.kerning;
		this.spacing    = typeof data.spacing === 'number'    ? data.spacing    : this.spacing;


		if (data.font instanceof Object) {

			this.__font.color   = data.font.color   || '#ffffff';
			this.__font.family  = data.font.family  || 'Ubuntu Mono';
			this.__font.outline = data.font.outline || 0;
			this.__font.size    = data.font.size    || 16;
			this.__font.style   = data.font.style   || 'normal';

		}


		_parse_font_characters.call(this);

	};

	const _parse_font_characters = function() {

		let data = this.__buffer;
		let url  = this.url;

		if (_CHAR_CACHE[url] === undefined) {
			_CHAR_CACHE[url] = {};
		}

		if (data.map instanceof Array) {

			let offset = this.spacing;

			for (let c = 0, cl = this.charset.length; c < cl; c++) {

				let id  = this.charset[c];
				let chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;

				_CHAR_CACHE[url][id] = chr;

			}

		}

	};


	const _CHAR_CACHE = {};
	const _FONT_CACHE = {};

	const _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.kerning    = 0;
		this.spacing    = 0;
		this.lineheight = 0;

		this.__buffer   = null;
		this.__font     = {
			color:   '#ffffff',
			family:  'Ubuntu Mono',
			outline: 0,
			size:    16,
			style:   'normal'
		};
		this.__load     = true;


		if (url !== null) {

			if (_CHAR_CACHE[url] === undefined) {

				_CHAR_CACHE[url]     = {};
				_CHAR_CACHE[url][''] = {
					width:      0,
					height:     this.lineheight,
					realwidth:  0,
					realheight: this.lineheight,
					x:          0,
					y:          0
				};

			}


			if (_FONT_CACHE[url] !== undefined) {
				_clone_font(_FONT_CACHE[url], this);
			} else {
				_FONT_CACHE[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.__buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load   = false;
				_parse_font.call(this);

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer !== null) {

				let tmp1 = JSON.stringify(this.__buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : '';


			let buffer = this.__buffer;
			if (buffer !== null) {

				// Cache Usage
				if (this.__load === false) {

					let cache = _CHAR_CACHE[this.url] || null;
					if (cache !== null) {

						let tl = text.length;
						if (tl === 1) {

							if (cache[text] !== undefined) {
								return cache[text];
							}

						} else if (tl > 1) {

							let data = cache[text] || null;
							if (data === null) {

								let width = 0;
								let map   = buffer.map;

								for (let t = 0; t < tl; t++) {

									let m = this.charset.indexOf(text[t]);
									if (m !== -1) {
										width += map[m] + this.kerning;
									}

								}

								if (width > 0) {

									// TODO: Embedded Font ligatures will set x and y values based on settings.map
									data = cache[text] = {
										width:      width,
										height:     this.lineheight,
										realwidth:  width,
										realheight: this.lineheight,
										x:          0,
										y:          0
									};

								}

							}


							return data;

						}


						return cache[''];

					}

					// Temporary Usage
				} else {

					let tl = text.length;
					if (tl === 1) {

						let m = this.charset.indexOf(text);
						if (m !== -1) {

							let offset  = this.spacing;
							let spacing = this.spacing;
							let map     = buffer.map;

							for (let c = 0; c < m; c++) {
								offset += map[c] + spacing * 2;
							}

							return {
								width:      map[m] + spacing * 2,
								height:     this.lineheight,
								realwidth:  map[m],
								realheight: this.lineheight,
								x:          offset - spacing,
								y:          0
							};

						}

					} else if (tl > 1) {

						let width = 0;
						let map   = buffer.map;

						for (let t = 0; t < tl; t++) {

							let m = this.charset.indexOf(text[t]);
							if (m !== -1) {
								width += map[m] + this.kerning;
							}

						}

						if (width > 0) {

							return {
								width:      width,
								height:     this.lineheight,
								realwidth:  width,
								realheight: this.lineheight,
								x:          0,
								y:          0
							};

						}

					}


					return {
						width:      0,
						height:     this.lineheight,
						realwidth:  0,
						realheight: this.lineheight,
						x:          0,
						y:          0
					};

				}

			}


			return null;

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);
			let xhr  = new XMLHttpRequest();

			if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
				xhr.open('GET', _protocol + '://' + path, true);
			} else {
				xhr.open('GET', path, true);
			}

			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8');

			xhr.onload = function() {

				let data = null;

				try {
					data = JSON.parse(xhr.responseText);
				} catch (err) {
				}

				this.__buffer = data;
				this.__load   = false;

				if (data !== null) {
					_parse_font.call(this);
				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}.bind(this);

			xhr.onerror = xhr.ontimeout = function() {

				this.__buffer = null;
				this.__load   = false;

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}.bind(this);

			xhr.send(null);

		}

	};


	global.Font = Font;

})(this.lychee, this);


(function(lychee, global) {

	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});

	const _supports = (function() {

		let supports = {
			ogg: false,
			mp3: false
		};

		let audio = 'Audio' in global && typeof Audio !== 'undefined';
		if (audio === true) {

			let tmp = new Audio();

			[ 'application/ogg', 'audio/ogg', 'audio/ogg; codecs=theora, vorbis' ].forEach(function(variant) {

				if (tmp.canPlayType(variant)) {
					supports.ogg = true;
				}

			});

			[ 'audio/mpeg' ].forEach(function(variant) {

				if (tmp.canPlayType(variant)) {
					supports.mp3 = true;
				}

			});

			tmp = null;

		}

		return supports;

	})();



	/*
	 * HELPERS
	 */

	const _MUSIC_CACHE = {};

	const _clone_music = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.play();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_MUSIC_CACHE[url] !== undefined) {
				_clone_music(_MUSIC_CACHE[url], this);
			} else {
				_MUSIC_CACHE[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						this.play();
					}.bind(this), true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = blob.buffer.ogg;
					buffer.load();

					this.__buffer.ogg = buffer;

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						this.play();
					}.bind(this), true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = blob.buffer.mp3;
					buffer.load();

					this.__buffer.mp3 = buffer;

				}


				if (_supports.ogg === true) {
					this.buffer = this.__buffer.ogg || null;
				} else if (_supports.mp3 === true) {
					this.buffer = this.__buffer.mp3 || null;
				}

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url  = this.url;
			let type = null;

			if (_supports.ogg === true) {
				type = type || 'ogg';
			} else if (_supports.mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				let buffer = new Audio();


				buffer.onloadedmetadata = function() {

					this.buffer         = buffer;
					this.__buffer[type] = buffer;

					this.__load = false;

					if (this.onload instanceof Function) {
						this.onload(true);
						this.onload = null;
					}

				}.bind(this);

				buffer.onloadeddata = function() {
					this.toString('base64');
				};

				// XXX: onerror is fired after onload -_-
				buffer.onerror = function() {

					if (this.buffer === buffer) {
						this.buffer         = null;
						this.__buffer[type] = null;
					}

					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}.bind(this);

				buffer.addEventListener('ended', function() {
					this.play();
				}.bind(this), true);

				buffer.autobuffer = true;
				buffer.preload    = true;


				let path = lychee.environment.resolve(url + '.' + type);
				if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
					buffer.src = _protocol + '://' + path;
				} else {
					buffer.src = path;
				}


				buffer.load();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

				if (this.buffer.currentTime === 0) {

					let p = this.buffer.play();
					if (typeof p === 'object' && typeof p.catch === 'function') {
						p.catch(function(err) {});
					}

					this.isIdle = false;
				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {

				let p = this.buffer.play();
				if (typeof p === 'object' && typeof p.catch === 'function') {
					p.catch(function(err) {});
				}

				this.isIdle = false;

			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};


	global.Music = Music;

})(this.lychee, this);


(function(lychee, global) {

	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});

	const _supports = (function() {

		let supports = {
			ogg: false,
			mp3: false
		};

		let audio = 'Audio' in global && typeof Audio !== 'undefined';
		if (audio === true) {

			let tmp = new Audio();

			[ 'application/ogg', 'audio/ogg', 'audio/ogg; codecs=theora, vorbis' ].forEach(function(variant) {

				if (tmp.canPlayType(variant)) {
					supports.ogg = true;
				}

			});

			[ 'audio/mpeg' ].forEach(function(variant) {

				if (tmp.canPlayType(variant)) {
					supports.mp3 = true;
				}

			});

			tmp = null;

		}

		return supports;

	})();



	/*
	 * HELPERS
	 */

	const _SOUND_CACHE = {};

	const _clone_sound = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer            = new Audio();
			clone.buffer.autobuffer = true;
			clone.buffer.preload    = true;
			clone.buffer.src        = origin.buffer.src;
			clone.buffer.load();

			clone.buffer.addEventListener('ended', function() {
				clone.isIdle = true;
				clone.stop();
			}, true);

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 1.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_SOUND_CACHE[url] !== undefined) {
				_clone_sound(_SOUND_CACHE[url], this);
			} else {
				_SOUND_CACHE[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						this.stop();
					}.bind(this), true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = blob.buffer.ogg;
					buffer.load();

					this.__buffer.ogg = buffer;

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let buffer = new Audio();

					buffer.addEventListener('ended', function() {
						this.stop();
					}.bind(this), true);

					buffer.autobuffer = true;
					buffer.preload    = true;
					buffer.src        = blob.buffer.mp3;
					buffer.load();

					this.__buffer.mp3 = buffer;

				}


				if (_supports.ogg === true) {
					this.buffer = this.__buffer.ogg || null;
				} else if (_supports.mp3 === true) {
					this.buffer = this.__buffer.mp3 || null;
				}

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url  = this.url;
			let type = null;

			if (_supports.ogg === true) {
				type = type || 'ogg';
			} else if (_supports.mp3 === true) {
				type = type || 'mp3';
			}


			if (url !== null && type !== null) {

				let buffer = new Audio();

				buffer.onloadedmetadata = function() {

					this.buffer         = buffer;
					this.__buffer[type] = buffer;

					this.__load = false;

					if (this.onload instanceof Function) {
						this.onload(true);
						this.onload = null;
					}

				}.bind(this);

				buffer.onloadeddata = function() {
					this.toString('base64');
				};

				// XXX: onerror is fired after onload -_-
				buffer.onerror = function() {

					if (this.buffer === buffer) {
						this.buffer         = null;
						this.__buffer[type] = null;
					}

					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}.bind(this);

				buffer.addEventListener('ended', function() {
					this.isIdle = true;
					this.stop();
				}.bind(this), true);

				buffer.autobuffer = true;
				buffer.preload    = true;


				let path = lychee.environment.resolve(url + '.' + type);
				if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
					buffer.src = _protocol + '://' + path;
				} else {
					buffer.src = path;
				}


				buffer.load();

			} else {

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {

			if (this.buffer !== null) {

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

				if (this.buffer.currentTime === 0) {

					let p = this.buffer.play();
					if (typeof p === 'object' && typeof p.catch === 'function') {
						p.catch(function(err) {});
					}

					this.isIdle = false;

				}

			}

		},

		pause: function() {

			if (this.buffer !== null) {
				this.buffer.pause();
				this.isIdle = true;
			}

		},

		resume: function() {

			if (this.buffer !== null) {

				let p = this.buffer.play();
				if (typeof p === 'object' && typeof p.catch === 'function') {
					p.catch(function(err) {});
				}

				this.isIdle = false;

			}

		},

		stop: function() {

			if (this.buffer !== null) {

				this.buffer.pause();
				this.isIdle = true;

				try {
					this.buffer.currentTime = 0;
				} catch (err) {
				}

			}

		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			if (volume !== null && this.buffer !== null) {

				volume = Math.min(Math.max(0, volume), 1);

				this.buffer.volume = volume;
				this.volume        = volume;

				return true;

			}


			return false;

		}

	};


	global.Sound = Sound;

})(this.lychee, this);


(function(lychee, global) {

	const _document = global.document;
	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});



	/*
	 * HELPERS
	 */

	const _STUFF_CACHE = {};

	const _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	const _execute_stuff = function(callback) {

		let url    = this.url;
		let ignore = this.__ignore;

		if (url.endsWith('.js') && ignore === false) {

			let tmp = _document.createElement('script');

			tmp._filename = url;
			tmp.async     = true;

			tmp.onload = function() {

				callback.call(this, true);
				_document.body.removeChild(tmp);

			}.bind(this);

			tmp.onerror = function() {

				callback.call(this, false);
				_document.body.removeChild(tmp);

			}.bind(this);

			let path = lychee.environment.resolve(url);
			if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
				tmp.src = _protocol + '://' + path;
			} else {
				tmp.src = path;
			}

			_document.body.appendChild(tmp);

		} else {

			callback.call(this, true);

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_STUFF_CACHE[url] !== undefined) {
				_clone_stuff(_STUFF_CACHE[url], this);
			} else {
				_STUFF_CACHE[url] = this;
			}

		}

	};


	Stuff.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				this.buffer = tmp2.toString('utf8');
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};
			let mime = 'application/octet-stream';


			if (this.url.endsWith('.js')) {
				mime = 'application/javascript';
			}


			if (this.buffer !== null) {

				let tmp = Buffer.from(this.buffer, 'utf8');

				blob.buffer = 'data:' + mime + ';base64,' + tmp.toString('base64');

			}


			return {
				'constructor': 'Stuff',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				_execute_stuff.call(this, function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				});


				return;

			}


			let path = lychee.environment.resolve(this.url);
			let xhr  = new XMLHttpRequest();

			if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
				xhr.open('GET', _protocol + '://' + path, true);
			} else {
				xhr.open('GET', path, true);
			}

			xhr.onload = function() {

				let raw = xhr.responseText || null;
				if (raw !== null) {
					this.buffer = raw;
					this.__load = false;
				}


				_execute_stuff.call(this, function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				});

			}.bind(this);

			xhr.onerror = xhr.ontimeout = function() {

				this.buffer = '';
				this.__load = false;

				if (this.onload instanceof Function) {
					this.onload(false);
					this.onload = null;
				}

			}.bind(this);

			xhr.send(null);

		}

	};


	global.Stuff = Stuff;

})(this.lychee, this);


(function(lychee, global) {

	const _protocol = (function(location) {

		let origin   = location.origin || '';
		let protocol = origin.split(':')[0] || '';

		if (/^(http|https)$/g.test(protocol)) {
			return protocol;
		} else if (/^(file|chrome-extension)$/g.test(protocol)) {
			return 'file';
		} else {
			return null;
		}

	})(global.location || {});



	/*
	 * HELPERS
	 */

	let   _TEXTURE_ID    = 0;
	const _TEXTURE_CACHE = {};

	const _clone_texture = function(origin, clone) {

		// Keep reference of Texture ID for OpenGL alike platforms
		clone.id = origin.id;


		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _TEXTURE_ID++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.startsWith('data:image') === false) {

			if (_TEXTURE_CACHE[url] !== undefined) {
				_clone_texture(_TEXTURE_CACHE[url], this);
			} else {
				_TEXTURE_CACHE[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let that  = this;
				let image = new Image();

				image.onload = function() {
					that.buffer = this;
					that.width  = this.width;
					that.height = this.height;
				};

				image.src   = blob.buffer;
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let buffer;
			let that = this;

			let url = this.url;
			if (url.startsWith('data:')) {

				if (url.startsWith('data:image/png;')) {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('Invalid Texture at data:image/png; (NOT power-of-two).');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};

					buffer.src = url;

				} else {

					console.warn('Invalid Texture at "' + url.substr(0, 15) + '" (No PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			} else {

				if (url.endsWith('.png')) {

					buffer = new Image();

					buffer.onload = function() {

						that.buffer = this;
						that.width  = this.width;
						that.height = this.height;

						that.__load = false;
						that.buffer.toString('base64');


						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('Invalid Texture at "' + this.url + '" (NOT power-of-two).');
						}


						if (that.onload instanceof Function) {
							that.onload(true);
							that.onload = null;
						}

					};

					buffer.onerror = function() {

						if (that.onload instanceof Function) {
							that.onload(false);
							that.onload = null;
						}

					};


					let path = lychee.environment.resolve(url);
					if (path.startsWith('/opt/lycheejs') && _protocol !== null) {
						buffer.src = _protocol + '://' + path;
					} else {
						buffer.src = path;
					}

				} else {

					console.warn('Invalid Texture at "' + this.url + '" (no PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};


	global.Texture = Texture;

})(this.lychee, this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _ELEMENT = {
		id:        '',
		className: '',
		style:     {
			position:        'static',
			width:           1337,
			height:          1337,
			backgroundColor: '#000000',
			pointerEvents:   'none',
			transform:       '',
			zIndex:          0
		}
	};

	_ELEMENT.prototype = {

		getBoundingClientRect: function() {

			return {
				left: 1337,
				top:  1337
			};

		}

	};

	const _CANVAS = Object.assign({}, _ELEMENT);

	_CANVAS.prototype = Object.assign({}, _ELEMENT.prototype, {

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	});

	const _INPUT = {

		oncancel:     function() {},
		onchange:     function() {},
		onclick:      function() {},
		value:        '',

		click:        function() {},
		setAttribute: function(name, value) {}

	};

	const _FEATURES = {

		innerWidth:  1337,
		innerHeight: 1337,

		CanvasRenderingContext2D: function() {},
		FileReader:               function() {},
		Storage:                  function() {},
		WebSocket:                function(url, protocols) {},
		XMLHttpRequest:           function() {},

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			createElement: function(type) {

				if (type === 'a' || type === 'div') {
					return _ELEMENT;
				} else if (type === 'input') {
					return _INPUT;
				} else if (type === 'canvas') {
					return _CANVAS;
				}

				return null;

			},

			querySelectorAll: function(query) {

				if (query === '.lychee-Renderer') {
					return [ _ELEMENT ];
				}

				return null;

			},
			body: {
				appendChild: function(element) {}
			}
		},

		location: {
			href: 'file:///tmp/index.html'
		},

		localStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		},

		sessionStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		}

	};

	_FEATURES.FileReader.prototype.readAsDataURL = function() {};


	lychee.FEATURES['html'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _ELEMENT = {
		id:        '',
		className: '',
		style:     {
			position:        'static',
			width:           1337,
			height:          1337,
			backgroundColor: '#000000',
			pointerEvents:   'none',
			transform:       '',
			zIndex:          0
		}
	};

	_ELEMENT.prototype = {

		getBoundingClientRect: function() {

			return {
				left: 1337,
				top:  1337
			};

		}

	};

	const _CANVAS = Object.assign({}, _ELEMENT);

	_CANVAS.prototype = Object.assign({}, _ELEMENT.prototype, {

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	});

	const _INPUT = {

		oncancel:     function() {},
		onchange:     function() {},
		onclick:      function() {},
		value:        '',

		click:        function() {},
		setAttribute: function(name, value) {}

	};

	const _FEATURES = {

		innerWidth:  1337,
		innerHeight: 1337,

		CanvasRenderingContext2D: function() {},
		FileReader:               function() {},
		Storage:                  function() {},
		WebSocket:                function(url, protocols) {},
		XMLHttpRequest:           function() {},

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			createElement: function(type) {

				if (type === 'a' || type === 'div') {
					return _ELEMENT;
				} else if (type === 'input') {
					return _INPUT;
				} else if (type === 'canvas') {
					return _CANVAS;
				}

				return null;

			},

			querySelectorAll: function(query) {

				if (query === '.lychee-Renderer') {
					return [ _ELEMENT ];
				}

				return null;

			},
			body: {
				appendChild: function(element) {}
			}
		},

		location: {
			href: 'file:///tmp/index.html'
		},

		localStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		},

		sessionStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		}

	};

	_FEATURES.FileReader.prototype.readAsDataURL = function() {};


	lychee.FEATURES['html'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	// XXX: This is an incremental platform of 'html'

	lychee.FEATURES['html-nwjs'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['html-webview'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _Canvas = function(width, height, options) {
		this.width  = 1337;
		this.height = 1337;
		this.__left = 0;
		this.__top  = 0;
	};

	_Canvas.prototype = {

		clear: function() {},

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	};

	const _File = function(path, options, callback) {
		this.filesize = 1337;
	};

	_File.prototype = {
		openSync:  function(mode, callback) {},
		readSync:  function(bytes, callback) {},
		writeSync: function(buffer, callback) {},
		closeSync: function() {}
	};

	_File.read = function(path, options, callback) {
	};

	const _Socket = function(host, port) {
		this.binary       = false;
		this.encoding     = 'utf8';
		this.onconnect    = null;
		this.ondisconnect = null;
		this.ondrain      = null;
		this.onmessage    = null;
	};

	_Socket.prototype = {
		close:   function() {},
		connect: function(mode) {},
		listen:  function(mode) {},
		write:   function(data) {}
	};


	const _FEATURES = {

		Canvas:                   _Canvas,
		CanvasRenderingContext2D: _CONTEXT,
		File:                     _File,
		Socket:                   _Socket,

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			canvas: {

				add:    function(canvas) {},
				remove: function(canvas) {}

			}

		},

		window: {

			innerWidth:  1337,
			innerHeight: 1337,
			left:        0,
			top:         0,

			_onblur:     null,
			_onfocus:    null,

			__nidium__:  {
				build:    'abcdef0123456789',
				revision: 'abcdef0123456789',
				version:  '0.2'
			},

			addEventListener:      function(event, callback) {},
			exec:                  function(cmd) {},
			openFileDialog:        function(types, callback) {},
			requestAnimationFrame: function(callback) {},
			setSize:               function(width, height) {}

		}

	};


	lychee.FEATURES['nidium'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);

(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	lychee.FEATURES['node'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['node-sdl'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);

