export default Ember.ObjectController.extend({

    actions: {
        editAssessment: function() {
            var assessment_id = this.get('id');
            var promises = {
                assessment: this.store.find('assessment', assessment_id)
            };
            //var self = this;
            var score = this.get('score');
            var notes = this.get('notes');

            Ember.RSVP.hash(promises).then(function(hash) {
                var assessment = hash.assessment;
                assessment.score = score;
                assessment.notes = notes;
                assessment.save();
            });
        }
    }
});