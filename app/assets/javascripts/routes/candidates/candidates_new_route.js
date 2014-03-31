CodeTestBotApp.CandidatesNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return this.store.createRecord('candidate');
    }
});
