//= require ../auth/authenticated_route

CodeTestBotApp.AssessmentsNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            assessment: this.store.createRecord('assessment'),
            languages: this.store.find('language'),
            levels: this.store.find('level')
        });
    },
    setupController: function(controller, model) {
        this._super(controller, model);

        var self = this;
        var submission = this.controllerFor('submission').get('model');
        model.set('assessment.submission', submission);
        controller.set('selectedLanguage', submission.get('language'));
        controller.set('selectedLevel', submission.get('candidate.level'));

        return this.get('user.current').then(function(user) {
            var assessor = user.toJSON({ includeId: true });
            model.set('assessment.assessor', self.store.push('assessor', assessor));
        });
    }
});
