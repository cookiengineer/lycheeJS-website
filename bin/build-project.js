#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

var _fs   = require('fs');
var _root = __dirname.split('/').slice(0, 3).join('/');

require(_root + '/libraries/lychee/build/node/core.js')(__dirname.split('/').slice(0, -1).join('/'));



/*
 * IMPLEMENTATION
 */

var core  = _fs.readFileSync(lychee.ROOT.lychee  + '/libraries/lychee/build/html/core.js').toString('utf8');
var index = _fs.readFileSync(lychee.ROOT.project + '/build/html/main/index.js').toString('utf8');
var main  = _fs.readFileSync(lychee.ROOT.project + '/index.html').toString('utf8');
var json  = '{"api":{"files":{}},"build":{"files":{}},"source":{"files":{}}}';


var tmp = '';
var i1  = 0;
var i2  = 0;


tmp  = '<!-- BOOTSTRAP -->\n';
tmp += '\t<script src="core.js"></script>'
tmp += '\n\n';
i1   = main.indexOf('<!-- BOOTSTRAP -->');
i2   = main.indexOf('\n\t<style>', i1);
i2   = i2 !== -1 ? i2 : main.indexOf('</head>', i1);
main = main.substr(0, i1) + tmp + main.substr(i2);


tmp  = '<script src="index.js"></script>\n';
tmp += '<script>\n\n';
tmp += '\tlychee.inject(null);\n';
tmp += '\n';
tmp += '\tlychee.ROOT.lychee  = \'\';\n';
tmp += '\tlychee.ROOT.project = \'\';\n';
tmp += '\n';
tmp += '\n';
tmp += '\tsetTimeout(function() {\n';
tmp += '\t\tlychee.envinit(lychee.environment);\n';
tmp += '\t\tlychee.inject(lychee.ENVIRONMENTS[\'' + lychee.ROOT.project.substr(lychee.ROOT.lychee.length) + '/main\']);\n';
tmp += '\t}, 200);\n\n';
i1   = main.indexOf('<script>\n');
i2   = main.indexOf('</script>', i1);
main = main.substr(0, i1) + tmp + main.substr(i2);


_fs.writeFileSync(lychee.ROOT.project + '/build/core.js',    core);
_fs.writeFileSync(lychee.ROOT.project + '/build/index.js',   index);
_fs.writeFileSync(lychee.ROOT.project + '/build/index.html', main);
_fs.writeFileSync(lychee.ROOT.project + '/build/lychee.pkg', json);

