/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import('bower_components/foundation/js/foundation.js');
app.import('bower_components/modernizr/modernizr.js');
app.import('bower_components/ember-simple-auth/ember-simple-auth.js');
app.import('bower_components/ember-simple-auth/ember-simple-auth-oauth2.js');
app.import('bower_components/momentjs/moment.js');
app.import('bower_components/marked/lib/marked.js');
app.import('bower_components/raven-js/dist/raven.js');
app.import('bower_components/d3/d3.min.js');

module.exports = app.toTree();
