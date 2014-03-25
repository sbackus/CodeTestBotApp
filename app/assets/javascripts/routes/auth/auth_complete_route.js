CodeTestBotApp.AuthCompleteRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        controller.storeToken(model.token);

        this.controllerFor('auth').set('loggedIn', true);

        var previous = this.controllerFor('application').get('dataStore').getItem('previousTransition');
        if (previous != null) {
            this.transitionTo(previous);
        } else {
            this.transitionTo('/');
        }
    }
});