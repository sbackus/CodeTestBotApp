export default Ember.Route.extend({
    beforeModel: function(transition) {
        transition.abort();
        this.transitionTo('/submissions');
    }
});

