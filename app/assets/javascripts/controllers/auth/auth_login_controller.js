CodeTestBotApp.AuthLoginController = Ember.Controller.extend({
    needs: ['auth'],
    actions: {
        login: function() {
            var authController = this.get('controllers.auth');
            CodeTestBotApp.ApiSessionToken.acquire().then(function(response) {
                authController.handleAuthResponse(response, true);
            });
        }
    }
});
