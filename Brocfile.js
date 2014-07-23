/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

var app = new EmberApp({
    name: require('./package.json').name,

    minifyCSS: {
        enabled: true,
        options: {}
    },

    getEnvJSON: require('./config/environment')
});

// Use this to add additional libraries to the generated output files.
app.import({
    development: 'vendor/ember-data/ember-data.js',
    production: 'vendor/ember-data/ember-data.prod.js'
}, {
    exports: {
        'ember-data': [
            'default'
        ]
    }
});
app.import('vendor/foundation/foundation.js');
app.import('vendor/modernizr/modernizr.js');
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-simple-auth/ember-simple-auth-oauth2.js');
app.import('vendor/momentjs/moment.js');
app.import('vendor/marked/lib/marked.js');
app.import('vendor/raven-js/dist/raven.js');

// If the library that you are including contains AMD or ES6 modules that
// you would like to import into your application please specify an
// object with the list of modules as keys along with the exports of each
// module as its value.
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
    exports: {
        'ic-ajax': [
            'default',
            'defineFixture',
            'lookupFixture',
            'raw',
            'request',
        ]
    }
});

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

