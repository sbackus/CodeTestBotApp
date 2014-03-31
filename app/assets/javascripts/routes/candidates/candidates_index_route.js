CodeTestBotApp.CandidatesIndexRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return this.store.find('candidate');
    }
});
