CodeTestBotApp.SubmissionsNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            submission: this.store.createRecord('submission'),
            candidates: this.store.find('candidate'),
            languages: this.store.find('language')
        });
    }
});

