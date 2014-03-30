CodeTestBotApp.SubmissionsNewController = Ember.Controller.extend({
    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('model.emailText')) || Ember.isEmpty(this.get('model.zipfile'));
    }.property('model.emailText', 'model.zipfile'),

    actions: {
        createSubmission: function() {
            this.get('model').save();
        }
    }
});
