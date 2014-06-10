import 'code-test-bot-app/lib/ember-simple-auth/authenticators/out-of-band-token-authenticator';

export default {
    name: 'authentication',
    initialize: function(container, application) {
        container.register('authenticator:out-of-band-token', Ember.SimpleAuth.Authenticators.OutOfBandTokenAuthenticator);

        var options = {
            authorizerFactory: 'authorizer:oauth2-bearer',
            authenticationRoute: 'auth.login',
            routeAfterAuthentication: 'secured.index',
            crossOriginWhitelist: [CodeTestBotAppENV.SERVER_HOST]
        };

        options = Ember.merge({ storeFactory: application.get('storeFactory') }, options);

        Ember.SimpleAuth.setup(container, application, options);
    }
};
