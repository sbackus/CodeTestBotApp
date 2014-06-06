export default Ember.Component.extend({
    actions: {
        close: function() {
            this.sendAction();
        }
    }
});
