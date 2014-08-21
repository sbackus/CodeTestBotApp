import Ember from 'ember';

export default (function() {
    var helper = Ember.Object.extend();
    helper.reopenClass({
        setLocation: function(location) {
            window.location = location;
        }
    });

    return helper;
})();
