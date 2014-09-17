import Ember from 'ember';

var SubmissionsRoute = Ember.Route.extend({
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

export default SubmissionsRoute;
