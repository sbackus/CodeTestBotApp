import ApplicationRoute from './application';

export default ApplicationRoute.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    beforeModel: function(transition) {
        var session = this.get('session');
        if (!session.get('isAuthenticated')) {
            window.CodeTestBotApp.get('dataStore').setItem('attemptedTransition', transition.intent.url);
        }

        return this._super(transition);
    },

    actions: {
        authenticate: function(params) {
            var token_data = {
                access_token: params.token,
                expires_at: params.expires_at,
                expires: params.expires
            };

            return this.get('session').authenticate('authenticator:out-of-band-token', token_data);
        }
    }
});
