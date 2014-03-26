CodeTestBotApp.AuthCompleteRoute = Ember.Route.extend({
    setupController: function(controller, model) {
        this.controllerFor('auth').login(model.token);

        var previous = CodeTestBotApp.get('dataStore').getItem('previousTransition');
        if (previous != null) {
            this.transitionTo(previous);
        } else {
            this.transitionTo('/');
        }
    }
});