
lychee.define('app.state.Install').includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	const _Emitter = lychee.import('lychee.event.Emitter');
	const _State   = lychee.import('lychee.app.State');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		_State.call(this, main);
		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('download', function(name, bundle) {
			global.open('https://github.com/Artificial-Engineering/lycheejs-bundle/releases/download/' + lychee.VERSION + '/lycheejs-' + lychee.VERSION + '-' + bundle);
		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Install';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		update: function(clock, delta) {

		},

		enter: function(oncomplete) {
			oncomplete(true);
		},

		leave: function(oncomplete) {
			oncomplete(true);
		}

	};


	return Composite;

});

