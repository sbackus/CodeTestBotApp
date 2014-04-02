CodeTestBotApp.SubmissionsNewController = Ember.Controller.extend({
    selectedCandidate: null,
    selectedLanguage: null,

    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('model.submission.emailText')) ||
            Ember.isEmpty(this.get('model.submission.zipfile')) ||
            Ember.isNone(this.get('selectedCandidate'));
    }.property('model.submission.emailText', 'model.submission.zipfile', 'selectedCandidate'),

    actions: {
        createSubmission: function() {
            var submission = this.get('model.submission');
            submission.set('candidate', this.get('selectedCandidate'));
            submission.set('language', this.get('selectedLanguage'));
            submission.save();
        }
    }
});
