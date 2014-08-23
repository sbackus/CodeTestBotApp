import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ArrayController.extend(UserAwareControllerMixin, {
    actions: {
        confirmDelete: function(submission){
           return this.send('openModal', 'submission/confirm-delete', submission);
        },

        reopenSubmission: function(submission) {
          submission.set('active', true);
          submission.save();
        }
    }
});
