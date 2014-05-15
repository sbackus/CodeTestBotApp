import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';
import { cumulativeMovingAverage } from 'code-test-bot-app/utils/math';

export default Ember.ObjectController.extend(UserAwareMixin, {
    assessments: function() {
        var id = this.get('id');
        return this.store.filter('assessment', { submission_id: id }, function(assessment) {
            return assessment.get('submission.id') === id;
        });
    }.property('id'),

    averageScore: Ember.reduceComputed('assessments', {
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

    hasAssessments: function() {
        return this.get('assessments.length') > 0;
    }.property('assessments.length')
});
