CodeTestBotApp.CandidatesNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            candidate: this.store.createRecord('candidate'),
            levels: this.store.find('level')
        });
    },
    deactivate: function() {
        var candidate = this.currentModel.candidate;
        if (candidate.get('isNew')) {
            candidate.deleteRecord();
        }
    }
});
