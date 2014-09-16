import Ember from 'ember';

var SubmissionController = Ember.ObjectController.extend({
  breadCrumb: function() {
    return '%@ %@ Submission'.fmt(this.get('level.text'), this.get('language.name'));
  }.property('level', 'language')
});

export default SubmissionController;
