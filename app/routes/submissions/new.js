import AuthenticatedRoute from 'code-test-bot-app/routes/authenticated-route';

export default AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            submission: this.store.createRecord('submission'),
            candidates: this.store.find('candidate'),
            languages: this.store.find('language')
        });
    }
});
