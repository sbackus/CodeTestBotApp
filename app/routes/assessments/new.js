import AuthenticatedRoute from 'code-test-bot-app/routes/authenticated-route';

export default AuthenticatedRoute.extend({
    beforeModel: function(transition, queryParams) {
        var self = this;
        self._super(transition, queryParams);
        return self.store.find('session', 'current').then(function(session) {
            var user = session.get('user');
            var assessor = user.toJSON({ includeId: true });
            transition.data.assessor = self.store.push('assessor', assessor);
        });
    },
    model: function(params, transition) {
        var model = Ember.Object.create({
            assessment: this.store.createRecord('assessment'),
            languages: this.store.find('language'),
            levels: this.store.find('level')
        });

        model.set('assessment.assessor', transition.data.assessor);

        return model;
    },
    setupController: function(controller, model) {
        this._super(controller, model);

        var submission = this.controllerFor('submission').get('model');
        model.set('assessment.submission', submission);
        controller.set('selectedLanguage', submission.get('language'));
        controller.set('selectedLevel', submission.get('candidate.level'));
    }
});
