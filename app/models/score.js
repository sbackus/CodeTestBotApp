import Ember from 'ember';

var scoreOptions = [
    {
        score: 1, 
        text: 'No, I don\'t think this candidate should advance.', 
        shortText: 'No',
        pluralText: 'No, we don\'t think this candidate should advance.'
    },
    {
        score: 2,
        text: 'I\'m on the fence. I think this candidate should advance if there are other positive indicators (e.g. a strong HR interview).',
        shortText: 'Maybe',
        pluralText: 'We\'re on the fence. We think this candidate should advance if there are other positive indicators.'
    },
    {
        score: 3,
        text: 'Yes, I think this candidate should advance.',
        shortText: 'Yes',
        pluralText: 'Yes, we think this candidate should advance.'
    }
];

var Score = Ember.Object.extend({
});

Score.reopenClass({
    displayTextForScore: function(score) {
        if (score < 1 || score > 3) {
            return '';
        }

        return scoreOptions[score - 1].text;
    },

    shortDisplayTextForScore: function(score) {
        if (score < 1 || score > 3) {
            return '';
        }

        return scoreOptions[score - 1].shortText;
    },

    pluralDisplayTextForScore: function(score) {
        if (score < 1 || score > 3) {
            return '';
        }

        return scoreOptions[score - 1].pluralText;
    },

    scoreOptions: function() {
        return scoreOptions;
    }
});

export default Score;
