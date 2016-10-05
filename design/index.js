
ui = (function(global) {

	/*
	 * HELPERS
	 */

	var _set_active = function(element) {

		var classnames = element.className.split(' ');
		if (classnames.indexOf('active') === -1) {
			classnames.push('active');
		}

		element.className = classnames.join(' ');

	};

	var _set_inactive = function(element) {

		var classnames = element.className.split(' ');
		var classindex = classnames.indexOf('active');
		if (classindex !== -1) {
			classnames.splice(classindex, 1);
		}

		element.className = classnames.join(' ');

	};

	var _encode_form = function(type, elements) {

		var data = null;


		if (type === 'application/json') {

			data = {};


			elements.forEach(function(element) {

				if (element.tagName === 'INPUT') {

					var type = element.type;
					if (type === 'radio' && element.checked === true) {

						var tmp2 = parseInt(element.value, 10);
						if (!isNaN(tmp2) && (tmp).toString() === element.value) {
							data[element.name] = tmp2;
						} else {
							data[element.name] = element.value;
						}

					}

				}

			});

		}


		return data;

	};

	var _resolve_target = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

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
	 * POLYFILLS
	 */

	var _refresh = function() {

		var forms = [].slice.call(document.querySelectorAll('form[method="javascript"]'));
		if (forms.length > 0) {

			forms.forEach(function(form) {

				form.onsubmit = typeof form.onsubmit === 'function' ? form.onsubmit : function() {

					try {

						var data   = _encode_form(form.getAttribute('enctype'), [].slice.call(form.querySelectorAll('input')));
						var target = _resolve_target.call(global, form.getAttribute('action'));

						if (target !== null) {

							if (target instanceof Function) {

								target(data);

							} else if (target instanceof Object && typeof target.trigger === 'function') {

								var id = form.getAttribute('id') || null;
								if (id !== null) {
									target.trigger('submit', [   id, data ]);
								} else {
									target.trigger('submit', [ null, data ]);
								}

							}

						}

					} catch(e) {
						console.log(e);
					}


					return false;

				};

			});


			forms.forEach(function(form) {

				if (typeof form.onsubmit === 'function') {

					var elements = [].slice.call(form.querySelectorAll('input'));
					if (elements.length > 0) {

						elements.forEach(function(element) {

							if (element.type === 'radio') {

								element.onclick = typeof element.onclick === 'function' ? element.onclick : function() {
									form.onsubmit();
								};

							} else {

								element.onchange = typeof element.onchange === 'function' ? element.onchange : function() {

									if (this.checkValidity() === true) {
										form.onsubmit();
									}

								};

							}

						});

					}

				}

			});

		}


		var menu  = document.querySelector('menu');
		var items = [].slice.call(document.querySelectorAll('menu li'));

		if (items.length > 0) {

			var _active = 0;

			items.forEach(function(item, index) {

				if (item.className.indexOf('active') !== -1) {
					_active = index;
				}

			});

			_set_active(items[_active]);


			items.forEach(function(item) {

				item.addEventListener('click', function() {

					items.forEach(function(other) { _set_inactive(other); });
					_active = items.indexOf(this);
					_set_active(this);

				});

			});

		}

		var toggle = document.querySelector('menu > b');
		if (toggle !== null) {

			toggle.onclick = function() {

				if (menu.className.match('active')) {
					_set_inactive(menu);
				} else {
					_set_active(menu);
				}

			};

		}

		var codes = [].slice.call(document.querySelectorAll('code'));
		if (codes.length > 0) {

			codes.forEach(function(code) {
				hljs.highlightBlock(code);
			});

		}

	};

	var _refresh_menu = function() {

		var menu  = document.querySelector('menu');
		var width = global.innerWidth;
		if (menu !== null) {

			if (width < 712) {
				menu.className = '';
			} else if (width > 1024) {
				menu.className = 'active';
			}

		}

	};



	global.addEventListener('resize', function() {
		_refresh_menu();
	}, true);

	global.addEventListener('orientationchange', function() {
		_refresh_menu();
	}, true);


	document.addEventListener('DOMContentLoaded', function() {

		_refresh();
		_refresh_menu();

	}, true);



	/*
	 * IMPLEMENTATION
	 */

	return {

		changeState: function(identifier, data) {

			data = data instanceof Object ? data : null;


			var menu   = [].slice.call(document.querySelectorAll('menu li'));
			var states = [].slice.call(document.querySelectorAll('section[id]'));


			if (menu.length > 0 && states.length > 0) {

				menu.forEach(function(item) {

					var id = (item.innerText || item.innerHTML).toLowerCase();
					if (id === identifier) {
						_set_active(item);
					} else {
						_set_inactive(item);
					}

				});

				states.forEach(function(state) {

					if (state.id === identifier) {
						_set_active(state);
					} else {
						_set_inactive(state);
					}

				});


				var target = _resolve_target.call(global, 'MAIN');
				if (target !== null) {

					if (target instanceof Function) {
						target(identifier, data);
					} else if (target instanceof Object && typeof target.changeState === 'function') {
						target.changeState(identifier, data);
					}

				}

			}


			var location = global.location || null;
			if (location instanceof Object) {
				location.hash = '#!' + identifier;
			}

		},

		render: function(code, query) {

			query = typeof query === 'string' ? query : 'section.active';


			var node = document.querySelector(query);
			if (node !== null) {

				if (node.value !== undefined) {
					node.value = code;
				} else if (node.src !== undefined) {
					node.src = code;
				} else {
					node.innerHTML = code;
				}

				_refresh();

			}

		}

	};

})(this);

