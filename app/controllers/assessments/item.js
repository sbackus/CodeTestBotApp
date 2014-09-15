import Ember from 'ember';
import Score from 'code-test-bot-app/models/score';

var AssessmentsItemController = Ember.ObjectController.extend({
    recommendation: function() {
        return Score.shortDisplayTextForScore(this.get('score'));
    }.property('score'),

    isIncomplete: Ember.computed.not('published')
});

export default AssessmentsItemController;
