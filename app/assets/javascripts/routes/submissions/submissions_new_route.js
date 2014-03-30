CodeTestBotApp.SubmissionsNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return this.store.createRecord('submission');
    }
});

