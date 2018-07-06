
(function(global) {

	var doc = global.document || null;
	if (doc !== null) {

		doc.addEventListener('DOMContentLoaded', function() {

			var images = [].slice.call(doc.querySelectorAll('figure > img'));
			if (images.length > 0) {

				images.forEach(function(image) {

					image.style.cursor = 'pointer';
					image.onclick = function() {
						window.open(this.src);
					};

				});

			}

		}, true);

	}

})(typeof global !== 'undefined' ? global : this);

