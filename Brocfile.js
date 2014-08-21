/* global require, module */
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import('vendor/foundation/foundation.js');
app.import('vendor/modernizr/modernizr.js');
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-simple-auth/ember-simple-auth-oauth2.js');
app.import('vendor/momentjs/moment.js');
app.import('vendor/marked/lib/marked.js');
app.import('vendor/raven-js/dist/raven.js');
app.import('vendor/d3/d3.min.js');

var qunitBdd = pickFiles('vendor/qunit-bdd/lib', {
    srcDir: '/',
    files: ['qunit-bdd.js'],
    destDir: '/assets'
});

var sinon = pickFiles('vendor/sinonjs', {
    srcDir: '/',
    files: ['sinon.js'],
    destDir: '/assets'
});

module.exports = mergeTrees([app.toTree(), qunitBdd, sinon]);
