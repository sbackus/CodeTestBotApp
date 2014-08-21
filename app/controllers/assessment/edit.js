import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {

    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment').volatile(),
    notOwnAssessment: Ember.computed.not('ownAssessment').volatile(),
    actions: {
        editAssessment: function() {
            var self = this;
            var assessment = this.get('content');
            assessment.save();
            return assessment.save().then(function() {
               self.transitionToRoute('submission.index', assessment.get('submission'));
            });

        }
    }
});
