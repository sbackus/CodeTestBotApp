import UserAwareMixin from 'code-test-bot-app/mixins/user-aware';

export default Ember.ArrayController.extend(UserAwareMixin, {
    sortProperties: ['createdAt'],
    sortAscending: false
});
