#!/usr/local/bin/lycheejs-helper env:node



/*
 * BOOTSTRAP
 */

const _fs      = require('fs');
const _ROOT    = '/opt/lycheejs';
const _PROJECT = '/projects/lycheejs-website';

require(_ROOT + '/libraries/lychee/build/node/core.js')(_ROOT + _PROJECT);



/*
 * IMPLEMENTATION
 */

let core  = _fs.readFileSync(lychee.ROOT.lychee  + '/libraries/lychee/build/html/core.js').toString('utf8');
let index = _fs.readFileSync(lychee.ROOT.project + '/build/html/main/index.js').toString('utf8');
let main  = _fs.readFileSync(lychee.ROOT.project + '/index.html').toString('utf8');
let json  = '{"api":{"files":{}},"build":{"files":{}},"source":{"files":{}}}';


let tmp = '';
let i1  = 0;
let i2  = 0;


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


core  = core.split('\tconst').join('\tvar');
core  = core.split('\tlet').join('\tvar');
index = index.split('\\tconst').join('\\tvar');
index = index.split('\\tlet').join('\\tvar');


_fs.writeFileSync(lychee.ROOT.project + '/build/core.js',    core);
_fs.writeFileSync(lychee.ROOT.project + '/build/index.js',   index);
_fs.writeFileSync(lychee.ROOT.project + '/build/index.html', main);
_fs.writeFileSync(lychee.ROOT.project + '/build/lychee.pkg', json);

