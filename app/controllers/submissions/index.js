import UserAwareControllerMixin from 'code-test-bot-app/mixins/user-aware-controller';

export default Ember.ArrayController.extend(UserAwareControllerMixin, {
    sortPropertiesActive: ['createdAtDisplay:desc'],
    sortPropertiesInactive: ['updatedAtDisplay:desc'],
    sortAscending: false,

    sortedActiveSubmissions: Ember.computed.sort('model', 'sortPropertiesActive'),
    activeSubmissions: Ember.computed.filterBy('sortedActiveSubmissions', 'active', true),
    sortedInactiveSubmissions: Ember.computed.sort('model', 'sortPropertiesInactive'),
    inactiveSubmissions: Ember.computed.filterBy('sortedInactiveSubmissions', 'active', false),

    actions: {
        confirmDelete: function(submission){
           return this.send('openModal', 'submission/confirm-delete', submission);
        },

        activeSortBy: function (sortPropertiesActive) {
            this.set('sortPropertiesActive', [sortPropertiesActive]);
        },

        inactiveSortBy: function (sortPropertiesInactive) {
            this.set('sortPropertiesInactive', [sortPropertiesInactive]);
        }
    }
});
