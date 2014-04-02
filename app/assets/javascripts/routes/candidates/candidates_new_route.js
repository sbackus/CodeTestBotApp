CodeTestBotApp.CandidatesNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            candidate: this.store.createRecord('candidate'),
            levels: this.store.find('level')
        });
    }
});
