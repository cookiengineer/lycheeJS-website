
lychee.define('app.Main').requires([
	'app.state.About',
	'app.state.Examples',
	'app.state.FAQ',
	'app.state.Features',
	'app.state.Install',
	'app.state.Vision',
	'app.state.Workflow'
]).includes([
	'lychee.app.Main'
]).exports(function(lychee, global, attachments) {

	const _app    = lychee.import('app');
	const _Main   = lychee.import('lychee.app.Main');
	const _CONFIG = attachments["json"].buffer;
	const _STATE  = 'about';



	/*
	 * FEATURE DETECTION
	 */

	(function(global) {

		let location = global.location || null;
		if (location instanceof Object) {

			let hash = location.hash || '';
			if (hash.indexOf('#!') !== -1) {
				_STATE = hash.split('!')[1];
			}

		}

		let change = 'onhashchange' in global;
		if (change === true) {

			global.onhashchange = function() {

				let hash = location.hash || '';
				if (hash.indexOf('#!') !== -1) {

					let state = hash.split('!')[1] || '';
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

	let Composite = function(data) {

		let settings = Object.assign({}, _CONFIG, data);


		_Main.call(this, settings);



		/*
		 * INITIALIZATION
		 */

		this.bind('load', function(oncomplete) {
			oncomplete(true);
		}, this, true);

		this.bind('init', function() {

			this.setState('about',    new _app.state.About(this));
			this.setState('vision',   new _app.state.Vision(this));
			this.setState('features', new _app.state.Features(this));
			this.setState('workflow', new _app.state.Workflow(this));
			this.setState('examples', new _app.state.Examples(this));
			this.setState('install',  new _app.state.Install(this));
			this.setState('faq',      new _app.state.FAQ(this));

			ui.changeState(_STATE);

		}, this, true);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _Main.prototype.serialize.call(this);
			data['constructor'] = 'app.Main';


			return data;

		}

	};


	return Composite;

});

