import Ember from 'ember';
import ArrangeableMixin from 'code-test-bot-app/mixins/arrangeable';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ArrayController.extend(ArrangeableMixin, UserAwareControllerMixin, {
    actions: {
        sort: function(property) {
            if (this.get('isSorted') && this.get('sortProperties')[0] === property) {
                this.toggleProperty('sortAscending');
            } else {
                this.set('sortProperties', [property]);
                this.set('sortAscending', true);
            }
        },

        confirmDelete: function(submission){
           return this.send('openModal', 'submission/confirm-delete', submission);
        },

        reopenSubmission: function(submission) {
          submission.set('active', true);
          submission.save();
        }
    }
});
