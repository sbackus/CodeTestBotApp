import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        save: function() {
            var self = this;
            self.get('content').save().then(function() {
                self.transitionToRoute('/');
            });
        }
    }
});
