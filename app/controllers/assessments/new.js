export default Ember.ObjectController.extend({
    selectedLanguage: null,
    selectedLevel: null,

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
