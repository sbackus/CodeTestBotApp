import Ember from 'ember';
import ArrangeableMixin from 'code-test-bot-app/mixins/arrangeable';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

var SecuredIndexController = Ember.ArrayController.extend(ArrangeableMixin, UserAwareControllerMixin, {
  filterProperties: [['active', true]],
  assessments: [],
  submissions: Ember.computed.alias('arrangedContent'),
  submissionIds: Ember.computed.mapBy('submissions', 'id'),

  init: function() {
    this._super();
    this.updateAssessments();
  },

  updateAssessments: function() {
    var ids = this.get('submissionIds');
    var self = this;
    this.store.find('assessment', { include_unpublished: true }, function(assessment) {
      return ids.contains(assessment.get('submission.id'));
    }).then(function(assessments) {
      self.set('assessments', assessments);
    });
  }.observes('submissionIds'),

  userAssessments: Ember.computed.filter('assessments', function(assessment) {
    var userId = this.get('user.id');
    return assessment.get('assessor.id') === userId && !assessment.get('published');
  }),

  submissionsWithUnfinishedAssessment: function() {
    var submissions = this.get('submissions');
    var assessments = this.get('userAssessments');
    var submissionsWithUserAssessment = assessments.mapBy('submission.id');
    return submissions.filter(function(submission) {
      return submissionsWithUserAssessment.contains(submission.id);
    });
  }.property('userAssessments'),

  submissionsNeedingAssessment: function() {
    var submissions = this.get('submissions');
    var assessments = this.get('userAssessments');
    var submissionsWithUserAssessment = assessments.mapBy('submission.id');
    return submissions.filter(function(submission) {
      return !submissionsWithUserAssessment.contains(submission.id);
    });
  }.property('userAssessments'),

  noNotifications: function() {
    return Ember.isEmpty(this.get('submissionsNeedingAssessment')) && Ember.isEmpty(this.get('submissionsWithUnfinishedAssessment'));
  }.property('submissionsNeedingAssessment', 'submissionsWithUnfinishedAssessment')

});

export default SecuredIndexController;
