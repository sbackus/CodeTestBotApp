export default Ember.ArrayController.extend({
    sortPropertiesActive: ['createdAtDisplay:desc'],
    sortPropertiesInactive: ['updatedAtDisplay:desc'],
    sortAscending: false,

    sortedActiveSubmissions: Ember.computed.sort('model', 'sortPropertiesActive'),
    activeSubmissions: Ember.computed.filterBy('sortedActiveSubmissions', 'active', true),
    sortedInactiveSubmissions: Ember.computed.sort('model', 'sortPropertiesInactive'),
    inactiveSubmissions: Ember.computed.filterBy('sortedInactiveSubmissions', 'active', false),

    actions: {
        delete: function(submission){
            submission.deleteRecord();
            submission.save();
        },
        activeSortBy: function (sortPropertiesActive) {
            this.set('sortPropertiesActive', [sortPropertiesActive]);
        },

        inactiveSortBy: function (sortPropertiesInactive) {
            this.set('sortPropertiesInactive', [sortPropertiesInactive]);
        }
    }
});
