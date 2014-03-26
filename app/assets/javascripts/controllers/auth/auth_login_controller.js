CodeTestBotApp.AuthLoginController = Ember.Controller.extend({
    auth_url: null,
    actions: {
        login: function() {
            window.location = this.get('auth_url');
        }
    }
});
