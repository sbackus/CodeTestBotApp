import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
    modulePrefix: 'code-test-bot-app', // TODO: loaded via config
    Resolver: Resolver,
    ready: function() {
        Ember.$(document).foundation();
    }
});

loadInitializers(App, 'code-test-bot-app');

export default App;
