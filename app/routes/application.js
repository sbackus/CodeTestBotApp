import WWWAuthenticateHeader from 'code-test-bot-app/lib/auth/www-authenticate-header';

export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    handleUnauthorized: function(xhr) {
        var header = WWWAuthenticateHeader.parse(xhr);
        if (header.get('isEmpty') || header.get('isInvalidToken')) {
            this.transitionTo('auth.login');
        }
    },

    actions: {
        error: function(err) {
            var xhr = err.jqXHR ? err.jqXHR : err;
            if (xhr.status === 401) {
                this.handleUnauthorized(xhr);
            }
        },
        unauthorized: function(jqXHR) {
            this.handleUnauthorized(jqXHR);
        }
    }
});
