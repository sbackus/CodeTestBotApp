CodeTestBotApp.AuthLoginController = Ember.Controller.extend({
    actions: {
        login: function() {
            WindowLocationHelper.setLocation(this.get('model.auth_uri'));
        }
    }
});
