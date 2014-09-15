import Ember from 'ember';

var SubmissionIndexRoute = Ember.Route.extend({
   model: function() {
       var submission = this.modelFor('submission');
       var assessments = this.store.filter('assessment', { submission_id: submission.get('id'), include_unpublished: true }, function(assessment) {
           return assessment.get('submission.id') === submission.get('id');
       });
       return Ember.RSVP.hash({
           submission: submission,
           assessments: assessments
       });
   },

   setupController: function(controller, model) {
       this._super(controller, model.submission);
   },

   renderTemplate: function(controller, model) {
       this._super(controller, model.submission);
       this.render('assessments/index', {
           into: 'submission/index',
           outlet: 'assessments',
           model: model.assessments
       });
   }
});

export default SubmissionIndexRoute;
