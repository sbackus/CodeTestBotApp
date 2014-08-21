import Ember from 'ember';
import LocalStore from 'code-test-bot-app/lib/stores/local';
import EphemeralStore from 'code-test-bot-app/lib/stores/ephemeral';

export default {
    name: 'stores',
    initialize: function(container, application) {
        container.register('data-store:local', LocalStore);
        container.register('data-store:ephemeral', EphemeralStore);

        var dataStore = application.get('dataStore');
        if (Ember.isEmpty(dataStore)) {
            dataStore = 'data-store:local';
        }

        if (typeof dataStore === 'string') {
            application.set('dataStore', container.lookup(dataStore));
        }
    }
};
