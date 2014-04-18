CodeTestBotApp.SubmissionIndexRoute = CodeTestBotApp.AuthenticatedRoute.extend({
    setupController: function(controller, model) {
        this._super(controller, model);
        var assessmentsController = this.controllerFor('assessmentsIndex');
        assessmentsController.set('model', this.store.find('assessment', { submission_id: model.id }));
    }
});
