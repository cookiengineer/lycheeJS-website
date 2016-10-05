
lychee.define('app.state.Examples').requires([
	'lychee.data.HTML',
	'lychee.data.MD'
]).includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	var _README  = {
		'default': '<p>No instructions given.</p>'
	};
	var _RELEASE = [];



	/*
	 * HELPERS
	 */

	var _replace_template = function(template) {

		template = template.replace(/\.\/asset\//g, './download/example/asset/');

		return template;

	};

	var _ui_update = function() {

		_ui_render_selection.call(this);
		_ui_render_details.call(this);

	};

	var _ui_render_selection = function() {

		if (_RELEASE.length > 0) {

			var code = '';
			var id   = (this.__example !== null ? this.__example.identifier : 'boilerplate');


			code = _RELEASE.map(function(example, index) {

				var checked = id === example.identifier;
				var chunk   = '';

				chunk += '<li>';
				chunk += '<input id="examples-selection-content-' + index + '" name="identifier" type="radio" value="' + example.identifier + '"' + (checked ? ' checked' : '') + '>';
				chunk += '<label for="examples-selection-content-' + index + '">' + example.identifier + '</label>';
				chunk += '</li>';

				return chunk;

			}).join('');


			ui.render(code, '#examples-selection-content');

		} else {

			ui.render('<li>Server is re-bundling.</li>', '#examples-selection-content');

		}

	};

	var _ui_render_details = function() {

		var that = this;


		var example = this.__example || null;
		if (example !== null) {

			var readme = _README[example.readme] || null;
			if (readme !== null) {

				var code = '';
				var size = parseInt(example.size, 10);
				if (!isNaN(size)) {
					size = (size / 1000 / 1000).toFixed(2) + ' MB';
				}


				code += '<h3><b>2</b>Play ' + example.identifier + ' Example</h3>';
				code += _replace_template(readme);
				code += '<table>';
				code += '<tr><th>Fertilizer</th><th>Target</th><th>Download</th></tr>';
				code += '<tr>' + example.packages.map(function(pkg) {

					var chunk = '';

					chunk += '<td>' + pkg.fertilizer   + '</td>';
					chunk += '<td>' + pkg.target       + ' (' + pkg.architecture + ')</td>';
					chunk += '<td><button class="ico-download" onclick="MAIN.state.trigger(\'download\', [\'' + pkg.download + '\'])" title="Download ' + pkg.download + '">' + pkg.download.split('.').slice(-1) + '</button></td>';

					return chunk;

				}).join('</tr><tr>') + '</tr>';
				code += '</table>';

				ui.render(code, '#examples-detail');

			} else if (example.readme !== undefined) {

				readme = new Stuff('./download/example/' + example.readme);
				readme.onload = function() {

					var data = lychee.data.HTML.encode(lychee.data.MD.decode(this.buffer));
					if (data !== null) {
						_README[example.readme] = data;
					} else {
						_README[example.readme] = _README['default'];
					}

					_ui_render_details.call(that);

				};
				readme.load();

			} else {

				example.readme = 'default';
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


		this.__example = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('submit', function(id, settings) {

			if (id === 'examples-selection') {

				var identifier = settings.identifier || null;
				if (identifier !== null) {

					var filtered = _RELEASE.filter(function(example) {
						return example.identifier === identifier;
					});

					if (filtered.length > 0) {
						this.__example = filtered[0];
						_ui_render_details.call(this);
					}

				}

			}

		}, this);

		this.bind('download', function(download) {
			global.open('https://github.com/Artificial-Engineering/lycheejs-website/releases/download/' + lychee.VERSION + '/' + download);
		}, this);

		this.bind('github', function() {

			var example = this.__example || null;
			if (example !== null) {
				global.open('https://github.com/Artificial-Engineering/lycheejs/tree/development/projects/' + example.identifier + '/');
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
			var config = new Config('./download/example/release.json');

			config.onload = function() {

				var buffer = this.buffer;
				if (buffer !== null) {

					_RELEASE = Object.values(buffer.examples);

					that.__example = _RELEASE.filter(function(example) {
						return example.identifier === 'boilerplate';
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

