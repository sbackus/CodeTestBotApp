/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
});

app.import('bower_components/bootstrap/dist/css/bootstrap.css');

app.import('bower_components/bootstrap/dist/js/bootstrap.js');
//app.import('bower_components/ember-breadcrumbs/dist/ember-breadcrumbs.js');
app.import('vendor/ember-breadcrumbs/ember-breadcrumbs.js');
app.import('bower_components/ember-simple-auth/ember-simple-auth.js');
app.import('bower_components/ember-simple-auth/ember-simple-auth-oauth2.js');
app.import('bower_components/momentjs/moment.js');
app.import('bower_components/marked/lib/marked.js');
app.import('bower_components/raven-js/dist/raven.js');
app.import('bower_components/d3/d3.min.js');
app.import('bower_components/matchHeight/jquery.matchHeight.js');

module.exports = app.toTree();
