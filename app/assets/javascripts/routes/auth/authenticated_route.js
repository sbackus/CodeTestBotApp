CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        var self = this;
        var authController = this.controllerFor('auth');
        if (!authController.get('loggedIn')) {
            localStorage.setItem('previousTransition', transition.intent.url);
            return CodeTestBotApp.ApiSessionToken.acquire().then(function(result) {
                if (result.result === 'success') {
                    authController.login(result.token.get('token'));
                } else if (result.result === 'auth_required') {
                    self.controllerFor('auth.login').set('auth_url', result.auth_url);
                    self.transitionTo('auth.login');
                }
            });
        }
    }
});