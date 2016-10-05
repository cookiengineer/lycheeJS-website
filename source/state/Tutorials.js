
lychee.define('app.state.Tutorials').requires([
	'lychee.data.HTML',
	'lychee.data.MD'
]).includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	var _CONTENT = {
		'default': '<p>Tutorial does not yet exist :(</p>'
	};
	var _RELEASE = [];



	/*
	 * HELPERS
	 */

	var _replace_template = function(template) {

		template = template.replace(/\.\/asset\//g, '/download/tutorial/asset/');

		return template;

	};

	var _ui_update = function() {

		_ui_render_selection.call(this);
		_ui_render_details.call(this);

	};

	var _ui_render_selection = function() {

		if (_RELEASE.length > 0) {

			var code = '';
			var id   = (this.__tutorial !== null ? this.__tutorial.identifier : 'Introduction');


			code = _RELEASE.map(function(tutorial, index) {

				var checked = id === tutorial.identifier;
				var chunk   = '';

				chunk += '<li>';
				chunk += '<input id="tutorials-selection-content-' + index + '" name="identifier" type="radio" value="' + tutorial.identifier + '"' + (checked ? ' checked' : '') + '>';
				chunk += '<label for="tutorials-selection-content-' + index + '">' + tutorial.identifier + '</label>';
				chunk += '</li>';

				return chunk;

			}).join('');


			ui.render(code, '#tutorials-selection-content');

		} else {

			ui.render('<li>Server is re-bundling.</li>', '#tutorials-selection-content');

		}

	};

	var _ui_render_details = function() {

		var that = this;


		var tutorial = this.__tutorial || null;
		if (tutorial !== null) {

			var content = _CONTENT[tutorial.content] || null;
			if (content !== null) {

				var code = '';


				code += '<h3><b>2</b>Read ' + tutorial.identifier + '</h3>';

				code += _replace_template(content);

				ui.render(code, '#tutorials-detail');


				setTimeout(function() {

					var codes = [].slice.call(document.querySelectorAll('#tutorials-detail code'));
					if (codes.length > 0) {

						codes.forEach(function(code) {
							hljs.highlightBlock(code);
						});

					}

				}, 0);

			} else if (tutorial.content !== undefined) {

				content = new Stuff('/download/tutorial/' + tutorial.content);
				content.onload = function() {

					var data = lychee.data.HTML.encode(lychee.data.MD.decode(this.buffer));
					if (data !== null) {
						_CONTENT[tutorial.content] = data;
					} else {
						_CONTENT[tutorial.content] = _CONTENT['default'];
					}

					_ui_render_details.call(that);

				};
				content.load();

			} else {

				tutorial.content = 'default';
				_ui_render_details.call(that);

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var Composite = function(main) {

		lychee.app.State.call(this, main);
		lychee.event.Emitter.call(this);


		this.__tutorial = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('submit', function(id, settings) {

			if (id === 'tutorials-selection') {

				var identifier = settings.identifier || null;
				if (identifier !== null) {

					var filtered = _RELEASE.filter(function(tutorial) {
						return tutorial.identifier === identifier;
					});

					if (filtered.length > 0) {
						this.__tutorial = filtered[0];
						_ui_render_details.call(this);
					}

				}

			}

		}, this);

		this.bind('download', function() {

			var tutorial = this.__tutorial || null;
			if (tutorial !== null) {

				var file = tutorial.package;
				if (file === null) {
					file = tutorial.content;
				}

				global.open(global.location.origin + '/download/tutorial/' + file);

			}

		}, this);

	};


	Composite.prototype = {

		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {

		},

		enter: function(oncomplete) {

			var that   = this;
			var config = new Config('/download/tutorial/release.json');

			config.onload = function() {

				var buffer = this.buffer;
				if (buffer !== null) {

					_RELEASE = Object.values(buffer.tutorials);

					that.__tutorial = _RELEASE.filter(function(bundle) {
						return bundle.identifier === 'Introduction';
					})[0] || null;

				}


				_ui_update.call(that);
				oncomplete(true);

			};

			config.load();

		},

		leave: function(oncomplete) {

			oncomplete(true);

		}

	};


	return Composite;

});

