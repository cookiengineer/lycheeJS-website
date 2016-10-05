
lychee.define('app.state.About').includes([
	'lychee.app.State'
]).exports(function(lychee, global, attachments) {

	const _State = lychee.import('lychee.app.State');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(main) {

		_State.call(this, main);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			let data = _State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.About';


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

