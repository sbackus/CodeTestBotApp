import ApplicationRoute from 'code-test-bot-app/routes/application';
import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';

export default ApplicationRoute.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, UserAwareMixin, {
    beforeModel: function(transition) {
        var self = this;
        var session = this.get('session');
        if (!session.get('isAuthenticated')) {
            window.CodeTestBotApp.get('dataStore').setItem('attemptedTransition', transition.intent.url);
            return this._super(transition);
        }

        return self.store.find('session', 'current').then(function(session) {
            self.set('user', session.get('user'));
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        this.controllerFor('application').set('user', this.get('user'));
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
