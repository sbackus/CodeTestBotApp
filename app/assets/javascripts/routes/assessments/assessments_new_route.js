//= require ../auth/authenticated_route

CodeTestBotApp.AssessmentsNewRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    model: function() {
        return Ember.Object.create({
            submission: null,
            languages: this.store.find('language'),
            levels: this.store.find('level')
        });
    },
    setupController: function(controller, model) {
        var submissionController = this.controllerFor('submission');
        var submission = submissionController.get('model');
        model.set('submission', submission);
        controller.set('selectedLanguage', submission.get('language'));
        controller.set('selectedLevel', submission.get('candidate.level'));
        this._super(controller, model);
    }
});
