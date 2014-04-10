CodeTestBotApp.SubmissionRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function(params) {
        return this.store.find('submission', params.submission_id);
    }
});
