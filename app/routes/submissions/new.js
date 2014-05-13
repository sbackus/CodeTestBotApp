import AuthenticatedRoute from 'code-test-bot-app/routes/authenticated-route';

export default AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            submission: this.store.createRecord('submission'),
            languages: this.store.find('language'),
            levels: this.store.find('level')
        });
    },

    actions: {
        willTransition: function() {
            var submission = this.controller.get('submission');
            if (submission.get('isNew')) {
                submission.deleteRecord();
            }
        }
    }
});
