
export default Ember.ObjectController.extend({
    assessments: function() {
        var id = this.get('id');
        return this.store.filter('assessment', { submission_id: id }, function(assessment) {
            return assessment.get('submission.id') === id;
        });
    }.property(),

    hasAssessments: function() {
        return this.get('assessments.length') > 0;
    }.property('assessments.length')
});
