//= require local_store

CodeTestBotApp.ApplicationController = Ember.Controller.extend({
    needs: ['auth'],
    loggedIn: Ember.computed.alias('controllers.auth.loggedIn')
});