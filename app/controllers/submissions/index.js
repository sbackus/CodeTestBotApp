export default Ember.ArrayController.extend({
    sortProperties: ['createdAt'],
    sortAscending: false,

    activeSubmissions: Ember.computed.filterBy('content', 'active', true),
    inactiveSubmissions: Ember.computed.filterBy('content', 'active', false)
});
