import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

var AssessmentsIndexController = Ember.ArrayController.extend(UserAwareControllerMixin, {
    itemController: 'assessments/item',
    userHasPublishedAssessment: false,

    showAssessments: Ember.computed.or('userHasPublishedAssessment', 'isRecruiter', 'isInactive'),

    updateUserHasAssessment: function() {
        this.set('userHasPublishedAssessment', this.get('content').findBy('assessor.id', this.get('user.id')) !== undefined);
    }.observes('content.[]'),
});

export default AssessmentsIndexController;
