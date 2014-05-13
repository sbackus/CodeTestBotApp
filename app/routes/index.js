import AuthenticatedRoute from 'code-test-bot-app/routes/authenticated-route';

export default AuthenticatedRoute.extend({
    beforeModel: function(transition) {
        transition.abort();
        this.transitionTo('/submissions');
    }
});
