CodeTestBotApp.UserController = Ember.ObjectController.extend({
    editDisabled: Ember.computed.not('editable')
});
