CodeTestBotApp.CandidatesNewController = Ember.ObjectController.extend({
    selectedLevel: null,

    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('model.candidate.name')) ||
            Ember.isEmpty(this.get('model.candidate.email')) || Ember.isNone(this.get('selectedLevel'));
    }.property('model.candidate.name', 'model.candidate.email', 'selectedLevel'),

    actions: {
        createCandidate: function() {
            var candidate = this.get('model.candidate');
            var self = this;
            candidate.set('level', this.get('selectedLevel'));
            return candidate.save().then(function(){
                self.transitionToRoute('/candidates');
            });
        }
    }
});
