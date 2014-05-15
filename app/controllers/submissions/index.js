import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';

export default Ember.ArrayController.extend(UserAwareMixin, {
    sortProperties: ['createdAt'],
    sortAscending: false,

    activeSubmissions: Ember.computed.filterBy('content', 'active', true),
    inactiveSubmissions: Ember.computed.filterBy('content', 'active', false)
});
