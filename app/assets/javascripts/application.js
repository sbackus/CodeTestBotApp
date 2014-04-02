// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require foundation.topbar
//= require foundation.dropdown
//= require handlebars
//= require ./features
//= require ember-canary
//= require ember-canary-data
//= require ember-simple-auth
//= require Math.uuid
//= require local_store
//= require_self
//= require code_test_bot_app

Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        container.register('authenticators:out-of-band-token', Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator);
        Ember.SimpleAuth.setup(container, application, {
            authenticationRoute: 'auth.login',
            crossOriginWhitelist: [CONFIG.SERVER_HOST]
        });
    }
});

window.CodeTestBotApp = Ember.Application.create({
    dataStore: LocalStore.create(),
    ready: function() {
        Foundation.set_namespace = function() {}; // Fix for teaspoon CLI runner... should revisit this periodically
        $(document).foundation();
    }
});

if (window.TESTING === true) {
    CodeTestBotApp.setupForTesting();
    CodeTestBotApp.injectTestHelpers();
}