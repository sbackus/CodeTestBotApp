CodeTestBotApp.FoundationView = Ember.View.extend({
    didInsertElement: function() {
        $(document).foundation();
        this._super();
    }
});
