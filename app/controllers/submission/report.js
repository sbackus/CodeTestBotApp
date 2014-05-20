/* globals marked */

import { cumulativeMovingAverage } from 'code-test-bot-app/utils/math';

export default Ember.ObjectController.extend({
    // TODO: this is duplicated with submission/index.js
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

    assessors: '',
    report: '',

    updateAssessors: function() {
        var self = this;
        self.get('assessments').then(function(assessments) {
            var assessors = assessments.map(function(assessment) {
                return assessment.get('assessor.name') + ' (score: ' + assessment.get('score') + ')';
            });
            self.set('assessors', assessors.join(', '));
        });
    }.observes('assessments.[]'),

    updateReport: function() {
        var self = this;
        self.get('assessments').then(function(assessments) {
            var report = assessments.reduce(function(previousValue, item, index) {
                if (previousValue !== '') {
                    previousValue += '\n\n';
                }

                return previousValue + '##### Developer ' + (index + 1) + ' wrote:\n\n' + item.get('notes');
            }, '');

            var renderer = new marked.Renderer();
            report = marked(report, { renderer: renderer });

            self.set('report', report);
        });
    }.observes('assessments.[]')
});
