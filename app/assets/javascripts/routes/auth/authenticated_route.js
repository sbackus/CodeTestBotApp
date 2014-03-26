CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        var authController = this.controllerFor('auth');
        if (!authController.get('loggedIn')) {
            localStorage.setItem('previousTransition', transition.intent.url);
            return CodeTestBotApp.ApiSessionToken.acquire().then(function(response) {
                authController.handleAuthResponse(response, false);
            });
        }
    }
});