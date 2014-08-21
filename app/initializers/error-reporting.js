import Ember from 'ember';

export default {
    name: 'error-reporting',
    initialize: function() {
        Ember.onerror = function(error) {
            Raven.captureException(error, {tags: { environment: CodeTestBotAppENV.environment }});
        };
    }
};
