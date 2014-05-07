export default Ember.ObjectController.extend({
    selectedLanguage: null,
    selectedLevel: null,

    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('assessment.score')) || Ember.isEmpty(this.get('assessment.notes'));
    }.property('assessment.score', 'assessment.notes'),

    actions: {
        createAssessment: function() {
            var self = this;
            var assessment = this.get('model.assessment');
            return assessment.save().then(function() {
                self.transitionToRoute('submission.index', assessment.get('submission'));
            });
        }
    }
});
