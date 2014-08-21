import Ember from 'ember';
import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';
import { cumulativeMovingAverage, roundToNearestHalf } from 'code-test-bot-app/utils/math';

export default Ember.ObjectController.extend(UserAwareControllerMixin, {
    userHasPublishedAssessment: false,

    assessments: function() {
        var id = this.get('id');
        return this.store.filter('assessment', { submission_id: id, include_unpublished: true }, function(assessment) {
            return assessment.get('submission.id') === id;
        });
    }.property('id'),

    publishedAssessments: Ember.computed.filterBy('assessments', 'published', true),
    unpublishedAssessments: Ember.computed.filterBy('assessments', 'published', false),

    rawAverageScore: Ember.reduceComputed('publishedAssessments', {
        initialValue: 0,
        initialize: function(initialValue, changeMeta, instanceMeta) {
            instanceMeta.count = 0;
        },
        addedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
            var score = item.get('score');
            var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count);
            instanceMeta.count++;
            return avg;
        },
        removedItem: function(accumulatedValue, item, changeMeta, instanceMeta) {
            var score = item.get('score');
            var avg = cumulativeMovingAverage(accumulatedValue, score, instanceMeta.count, true);
            instanceMeta.count--;
            return avg;
        }
    }),

    averageScore: function() {
        return roundToNearestHalf(this.get('rawAverageScore'));
    }.property('rawAverageScore'),

    hasPublishedAssessments: function() {
        return this.get('publishedAssessments.length') > 0;
    }.property('publishedAssessments.length'),

    isInactive: Ember.computed.not('active'),
    showCloseButton: Ember.computed.and('isRecruiter', 'active'),
    showReportButton: Ember.computed.and('isRecruiter', 'hasPublishedAssessments'),
    showReopenButton: Ember.computed.and('isRecruiter', 'isInactive'),
    showAssessments: Ember.computed.or('userHasPublishedAssessment', 'isRecruiter', 'isInactive'),
    userCanCreateAssessment: Ember.computed.not('userHasPublishedAssessment'),

    updateUserHasAssessment: function() {
        var assessments = this.get('publishedAssessments');
        this.set('userHasPublishedAssessment', assessments.findBy('assessor.id', this.get('user.id')) !== undefined);
    }.observes('publishedAssessments.[]'),

    newAssessmentButtonText: function() {
        var userId = this.get('user.id');
        var assessments = this.get('unpublishedAssessments');
            if (assessments.findBy('assessor.id', userId) !== undefined) {
                return 'Resume Assessment';
            } else {
                return 'New Assessment';
            }
    }.property('assessments.[]'),

    actions: {
        closeSubmission: function() {
            var self = this;
            var submission = this.get('content');
            submission.set('active', false);
            submission.set('averageScore', this.get('averageScore'));
            submission.save().then(function() {
                self.transitionToRoute('/submissions');
            });
        },

        reopenSubmission: function() {
          var self = this;
          var submission = this.get('content');
          submission.set('active', true);
          submission.save().then(function() {
            self.transitionToRoute('/submissions');
          });
        }
    }
});
