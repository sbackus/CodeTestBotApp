CodeTestBotApp.SubmissionsNewController = Ember.Controller.extend({
    selectedCandidate: null,

    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('model.submission.emailText')) ||
            Ember.isEmpty(this.get('model.submission.zipfile')) ||
            Ember.isNone(this.get('selectedCandidate'));
    }.property('model.submission.emailText', 'model.submission.zipfile', 'selectedCandidate'),

    actions: {
        createSubmission: function() {
            this.get('model.submission').save();
        }
    }
});
