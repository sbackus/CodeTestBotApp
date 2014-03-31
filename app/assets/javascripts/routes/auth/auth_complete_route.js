CodeTestBotApp.AuthCompleteRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        var params = transition.queryParams;
        var token_data = {
            access_token: params.token,
            expires_at: params.expires_at,
            expires: params.expires
        };

        var self = this;
        return this.get('session').authenticate('authenticators:out-of-band-token', token_data).then(function() {
            var attemptedTransition = CodeTestBotApp.get('dataStore').getItem('attemptedTransition') || '/';
            CodeTestBotApp.get('dataStore').removeItem('attemptedTransition');

            self.transitionTo(attemptedTransition);
        });
    }
});