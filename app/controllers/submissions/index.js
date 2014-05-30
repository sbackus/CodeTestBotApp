export default Ember.ArrayController.extend({
    activeSubmissions: Ember.computed.filterBy('content', 'active', true),
    inactiveSubmissions: Ember.computed.filterBy('content', 'active', false)
});
