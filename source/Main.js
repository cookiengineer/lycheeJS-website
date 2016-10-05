
lychee.define('app.Main').requires([
	'app.state.Examples',
	'app.state.FAQ',
	'app.state.Features',
	'app.state.Install',
	'app.state.Tutorials',
	'app.state.Vision'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	var _app    = lychee.import('app');
	var _CONFIG = attachments["json"].buffer;
	var _STATE  = 'vision';



	/*
	 * FEATURE DETECTION
	 */

	(function(global) {

		var location = global.location || null;
		if (location instanceof Object) {

			var hash = location.hash || '';
			if (hash.indexOf('#!') !== -1) {
				_STATE = hash.split('!')[1];
			}

		}

		var change = 'onhashchange' in global;
		if (change === true) {

			global.onhashchange = function() {

				var hash = location.hash || '';
				if (hash.indexOf('#!') !== -1) {

					var state = hash.split('!')[1] || '';
					if (state !== '') {
						ui.changeState(state);
					}

				}

			};

		}

	})(global);



	/*
	 * IMPLEMENTATION
	 */

	var Composite = function(data) {

		var settings = Object.assign({}, _CONFIG, data);


		lychee.app.Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {
			oncomplete(true);
		}, this, true);

		this.bind('init', function() {

			this.setState('vision',    new _app.state.Vision(this));
			this.setState('features',  new _app.state.Features(this));
			this.setState('examples',  new _app.state.Examples(this));
			this.setState('install',   new _app.state.Install(this));
			this.setState('tutorials', new _app.state.Tutorials(this));
			this.setState('faq',       new _app.state.FAQ(this));

			ui.changeState(_STATE);

		}, this, true);

	};


	Composite.prototype = {

	};


	return Composite;

});

