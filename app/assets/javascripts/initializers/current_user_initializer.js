Ember.Application.initializer({
    name: 'currentUser',
    initialize: function(container, application) {
        var UserFactory = Ember.Object.extend({
            current: function() {
                return this.get('session.current').then(function(session) {
                    return session.get('user');
                });
            }.property(),

            session: function() {
                return container.lookup('code-test-bot:session');
            }.property()
        });

        container.register('code-test-bot:user', UserFactory);
        Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
            container.injection(component, 'user', 'code-test-bot:user');
        });
    }
});


