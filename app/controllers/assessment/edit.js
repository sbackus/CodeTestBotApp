export default Ember.ObjectController.extend({

    actions: {
        editAssessment: function() {
            var assessment_id = this.get('id');
            var promises = {
                assessment: this.store.find('assessment', assessment_id)
            };
            var self = this;

            Ember.RSVP.hash(promises).then(function(hash) {
                var assessment = hash.assessment;
                return assessment.save().then(function() {
                    self.transitionToRoute('submission.index', assessment.get('submission'));
                });

            });
        }
    }
});