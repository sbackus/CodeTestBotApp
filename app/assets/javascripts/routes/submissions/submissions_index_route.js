CodeTestBotApp.SubmissionsIndexRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return this.store.find('submission');
    }
});
