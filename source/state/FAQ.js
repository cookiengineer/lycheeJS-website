
lychee.define('app.state.FAQ').includes([
	'lychee.app.State'
]).tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	var Composite = function(main) {

		lychee.app.State.call(this, main);

	};


	Composite.prototype = {

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

