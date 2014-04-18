CodeTestBotApp.SubmissionIndexController = Ember.ObjectController.extend({
    needs: ['submission', 'assessmentsIndex'],

    assessments: Ember.computed.alias('controllers.assessmentsIndex'),

    hasAssessments: Ember.computed.notEmpty('assessments.[]')
});
