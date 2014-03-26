window.WindowLocationHelper = Ember.Object.extend();
WindowLocationHelper.reopenClass({
    setLocation: function(location) {
        window.location = location;
    }
});
