import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {

    ownAssessment: function(){
        return this.get('user.id') === this.get('assessor.id');
    }.property('ownAssessment'),
    notOwnAssessment: Ember.computed.not('ownAssessment'),
    actions: {
        editAssessment: function() {
            var assessment_id = this.get('id');
            var promises = {
                assessment: this.store.find('assessment', assessment_id)
            };
            var self = this;
            var score = this.get('score');
            var notes = this.get('notes');

            Ember.RSVP.hash(promises).then(function(hash) {
                var assessment = hash.assessment;
                assessment.score = score;
                assessment.notes = notes;
                assessment.save();
                return assessment.save().then(function() {
                    self.transitionToRoute('submission.index', assessment.get('submission'));
                });
            });
        }
    }
});