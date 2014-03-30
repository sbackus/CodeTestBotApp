CodeTestBotApp.SubmissionsNewController = Ember.Controller.extend({
    emailText: null,
    file: null,

    isFormIncomplete: function() {
        return Ember.isEmpty(this.get('emailText')) || Ember.isEmpty(this.get('file'));
    }.property('emailText', 'file')
});
