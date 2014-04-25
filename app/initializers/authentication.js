export default {
    name: 'authentication',
    initialize: function(container, application) {
        container.register('authenticators:out-of-band-token', Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator);
        Ember.SimpleAuth.setup(container, application, {
            authenticationRoute: 'auth.login',
            crossOriginWhitelist: [CONFIG.SERVER_HOST]
        });
    }
};
