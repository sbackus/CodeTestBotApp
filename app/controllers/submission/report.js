/* globals marked */
import Ember from 'ember';
import Score from 'code-test-bot-app/models/score';
import { cumulativeMovingAverage } from 'code-test-bot-app/utils/math';

export default Ember.ObjectController.extend({
  breadCrumb: 'Report',
    // TODO: this is duplicated with submission/index.js
    assessments: function() {
        var id = this.get('id');
        return this.store.filter('assessment', { submission_id: id }, function(assessment) {
            return assessment.get('submission.id') === id;
        });
    }.property('id'),

    publishedAssessments: Ember.computed.filterBy('assessments', 'published', true),

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
        return Math.round(this.get('rawAverageScore'));
    }.property('rawAverageScore'),

    averageScoreText: function() {
        return Score.pluralDisplayTextForScore(this.get('averageScore'));
    }.property('averageScore'),

    assessors: '',
    report: '',

    updateAssessors: function() {
        var assessments = this.get('publishedAssessments');
        var assessors = assessments.map(function(assessment) {
            return assessment.get('assessor.name') + ' (' + Score.shortDisplayTextForScore(assessment.get('score')) + ')';
        });
        this.set('assessors', assessors.join(', '));
    }.observes('publishedAssessments.[]'),

    updateReport: function() {
        var assessments = this.get('publishedAssessments');
        var report = assessments.reduce(function(previousValue, item, index) {
            if (previousValue !== '') {
                previousValue += '\n\n';
            }

            return previousValue + '##### Developer ' + (index + 1) + ' wrote:\n\n' + item.get('notes');
        }, '');

        var renderer = new marked.Renderer();
        report = marked(report, { renderer: renderer });

        this.set('report', report);
    }.observes('publishedAssessments.[]')
});
