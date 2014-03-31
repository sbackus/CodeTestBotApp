CodeTestBotApp.AuthenticatedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    beforeModel: function(transition) {
        if (!this.get('session.isAuthenticated')) {
            CodeTestBotApp.get('dataStore').setItem('attemptedTransition', transition.intent.url);
        }

        this._super(transition);
    }
});