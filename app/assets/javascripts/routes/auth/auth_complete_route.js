CodeTestBotApp.AuthCompleteRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this.controllerFor('auth').login(model.token);

        var previous = this.controllerFor('application').get('dataStore').getItem('previousTransition');
        if (previous != null) {
            this.transitionTo(previous);
        } else {
            this.transitionTo('/');
        }
    }
});