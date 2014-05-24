import UserAwareRoute from 'code-test-bot-app/routes/user-aware-route';

export default UserAwareRoute.extend({
    model: function() {
        return this.store.find('user');
    }
});
