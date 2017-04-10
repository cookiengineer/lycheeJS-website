#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

const _fs   = require('fs');
const _path = require('path');
const _ROOT = _path.resolve(__dirname, '../');



/*
 * IMPLEMENTATION
 */


_fs.readdir(_ROOT + '/build/examples', function(err, identifiers) {

	identifiers.forEach(function(identifier) {

		let file = _fs.readFileSync(_ROOT + '/build/examples/' + identifier + '/index.html').toString('utf8');


		file = file.split('\n').map(function(line, l) {

			let tmp = line.trim();
			if (tmp.startsWith('lychee.envinit(environment')) {
				return line.replace('"/api/server', '"http://harvester.artificial.engineering:4848/api/server');
			}

			return line;

		}).join('\n');


		_fs.writeFileSync(_ROOT + '/build/examples/' + identifier + '/index.html', file, 'utf8');

	});

});

