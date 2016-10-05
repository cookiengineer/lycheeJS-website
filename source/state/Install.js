
lychee.define('app.state.Install').includes([
	'lychee.app.State',
	'lychee.event.Emitter'
]).tags({
	platform: 'html'
}).exports(function(lychee, global, attachments) {

	var Composite = function(main) {

		lychee.app.State.call(this, main);
		lychee.event.Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		this.bind('download', function(name, bundle) {
			global.open('https://github.com/Artificial-Engineering/lycheejs-bundle/releases/download/' + lychee.VERSION + '/lycheejs-' + lychee.VERSION + '-' + bundle);
		}, this);

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

