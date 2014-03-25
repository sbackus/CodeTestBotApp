CodeTestBotApp.AuthLoginController = Ember.Controller.extend({
    auth_url: null,
    actions: {
        login: function() {
//            CodeTestBotApp.ApiSessionToken.acquire();
            window.location = this.get('auth_url');
        }
    }
});
