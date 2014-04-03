CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    beforeModel: function(transition) {
        var session = this.get('session');
        if (!session.get('isAuthenticated')) {
            CodeTestBotApp.get('dataStore').setItem('attemptedTransition', transition.intent.url);
        } else {
            this.get('user.current').then(null, function(err) {
                if (err.status === 403) {
                    session.invalidate();
                }
            });
        }

        this._super(transition);
    }
});