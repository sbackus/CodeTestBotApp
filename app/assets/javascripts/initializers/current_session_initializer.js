Ember.Application.initializer({
    name: 'currentSession',
    initialize: function(container, application) {
        var store = container.lookup('store:main');
        var SessionFinder = Ember.Object.extend({
            savedSession: null,

            current: function() {
                var self = this;
                return new Ember.RSVP.Promise(function(resolve, reject) {
                    var savedSession = self.get('savedSession');
                    if (!Ember.isNone(savedSession)) {
                        return resolve(savedSession)
                    }

                    return store.find('session', 'current').then(function(session) {
                        self.set('savedSession', session);
                        return resolve(session);
                    }, reject);
                });
            }.property()
        });

        container.register('code-test-bot:session', SessionFinder);
    }
});

