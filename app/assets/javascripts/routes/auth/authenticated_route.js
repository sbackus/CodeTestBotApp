CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function (transition) {
        var self = this;
        var authController = this.controllerFor('auth');
        if (!authController.get('loggedIn')) {
            localStorage.setItem('previousTransition', transition.intent.url);
            return CodeTestBotApp.ApiSessionToken.acquire().then(function (apiToken) {

                authController.set('loggedIn', true);
            }, function (failure) {
                if (failure.reason === 'expired') {
                    self.controllerFor('auth.login').set('auth_url', failure.auth_url);
                    self.transitionTo('auth.login');
                }
            });
        }
    }
});