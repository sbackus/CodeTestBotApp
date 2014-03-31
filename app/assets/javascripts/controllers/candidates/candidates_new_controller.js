CodeTestBotApp.CandidatesNewController = Ember.ObjectController.extend({
    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('model.name')) || Ember.isEmpty(this.get('model.email'));
    }.property('model.name', 'model.email'),

    actions: {
        createCandidate: function() {
            this.get('model').save();
        }
    }
});
