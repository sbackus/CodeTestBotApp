CodeTestBotApp.AuthCompleteRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this.controllerFor('application').set('sessionToken', CodeTestBotApp.ApiSessionToken.create({ token: model.token }));
        localStorage.setItem('session_token', model.token);
        var previous = localStorage.getItem('previousTransition');
        this.controllerFor('auth').set('loggedIn', true);
        this.transitionTo(previous);
    }
});