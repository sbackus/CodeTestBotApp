import Resolver from 'ember/resolver';
import 'ember-simple-auth';
import 'ember-simple-auth-oauth2';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
    modulePrefix: 'code-test-bot-app', // TODO: loaded via config
    Resolver: Resolver
});

loadInitializers(App, 'code-test-bot-app');

export default App;
