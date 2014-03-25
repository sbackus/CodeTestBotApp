CodeTestBotApp.AuthLogoutRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        this.controllerFor('auth').logout();
        this.transitionTo('/');
    }
});