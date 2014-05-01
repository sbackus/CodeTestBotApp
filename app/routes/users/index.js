import AuthenticatedRoute from 'code-test-bot-app/routes/authenticated-route';

export default AuthenticatedRoute.extend({
    model: function() {
        return this.store.find('user');
    }
});
