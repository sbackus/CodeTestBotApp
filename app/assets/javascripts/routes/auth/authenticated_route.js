CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function (transition) {
        var self = this;
        var authController = this.controllerFor('auth');
        if (!authController.get('loggedIn')) {
            localStorage.setItem('previousTransition', transition.intent.url);
            return CodeTestBotApp.ApiSessionToken.acquire(null,this.controllerFor('application').get('dataStore')).then(function (apiToken) {
                authController.set('loggedIn', true);

                if (apiToken.reason === 'expired') {
                    self.controllerFor('auth.login').set('auth_url', apiToken.auth_url);
                    self.transitionTo('auth.login');
                }
            });
        }
    }
});