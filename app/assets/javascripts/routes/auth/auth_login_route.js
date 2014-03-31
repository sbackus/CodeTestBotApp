CodeTestBotApp.AuthLoginRoute = Ember.Route.extend({
    model: function() {
        return Ember.$.getJSON(CONFIG.NEW_SESSION_URL + '?redirect_uri=' + CONFIG.APP_HOST + '/auth/complete');
    }
});
